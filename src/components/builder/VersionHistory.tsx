import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { History, RotateCcw, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getResumeVersions, restoreResumeVersion, type ResumeVersion } from '@/lib/db';
import { useResumeStore } from '@/store/resumeStore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VersionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
}

export function VersionHistory({ open, onOpenChange, resumeId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRestoring, setIsRestoring] = useState(false);
  const { setCurrentResume } = useResumeStore();
  const { toast } = useToast();

  useEffect(() => {
    if (open && resumeId) {
      loadVersions();
    }
  }, [open, resumeId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const versionList = await getResumeVersions(resumeId);
      setVersions(versionList);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setIsRestoring(true);
    try {
      const restored = await restoreResumeVersion(versionId);
      if (restored) {
        setCurrentResume(restored);
        toast({
          title: 'Version restored',
          description: 'Your resume has been restored to the selected version.',
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: 'Restore failed',
        description: 'Failed to restore version. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Restore a previous version of your resume. Up to 10 versions are saved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-muted-foreground">Loading versions...</div>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No saved versions yet</p>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Versions are saved automatically as you edit
              </p>
            </div>
          ) : (
            versions.map((version, index) => (
              <div
                key={version.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors",
                  index === 0 && "border-accent/50 bg-accent/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    v{version.version}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {version.label || `Version ${version.version}`}
                      {index === 0 && (
                        <span className="ml-2 text-xs text-accent">(Latest)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRestore(version.id)}
                  disabled={isRestoring || index === 0}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restore
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
