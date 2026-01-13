import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { CoverLetterPDFDocument } from './CoverLetterPDFDocument';
import type { CoverLetter } from '@/types/resume';
import { cn } from '@/lib/utils';

interface CoverLetterExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coverLetter: CoverLetter;
}

export function CoverLetterExportDialog({ open, onOpenChange, coverLetter }: CoverLetterExportDialogProps) {
  const [pageSize, setPageSize] = useState<'A4' | 'LETTER'>('A4');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // No watermark - everything is free
      const doc = <CoverLetterPDFDocument coverLetter={coverLetter} pageSize={pageSize} showWatermark={false} />;
      const blob = await pdf(doc).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${coverLetter.name.replace(/[^a-z0-9]/gi, '_')}_Cover_Letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      onOpenChange(false);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Export Cover Letter
          </DialogTitle>
          <DialogDescription>
            Download your cover letter as a professional PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Page Size */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Page Size</Label>
            <RadioGroup
              value={pageSize}
              onValueChange={(v) => setPageSize(v as 'A4' | 'LETTER')}
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="cl-size-a4"
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
                  pageSize === 'A4' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <RadioGroupItem value="A4" id="cl-size-a4" className="sr-only" />
                <div className="w-8 h-11 border border-current rounded-sm" />
                <div className="text-center">
                  <p className="font-medium text-sm">A4</p>
                  <p className="text-xs text-muted-foreground">210 × 297 mm</p>
                </div>
              </Label>
              
              <Label
                htmlFor="cl-size-letter"
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
                  pageSize === 'LETTER' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <RadioGroupItem value="LETTER" id="cl-size-letter" className="sr-only" />
                <div className="w-9 h-11 border border-current rounded-sm" />
                <div className="text-center">
                  <p className="font-medium text-sm">US Letter</p>
                  <p className="text-xs text-muted-foreground">8.5 × 11 in</p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Free Export Badge */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-emerald-900">Free Download</p>
                <p className="text-xs text-emerald-700">No watermark • Professional quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="hero"
            className="flex-1"
            onClick={handleExport}
            disabled={isExporting || !coverLetter.content}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
