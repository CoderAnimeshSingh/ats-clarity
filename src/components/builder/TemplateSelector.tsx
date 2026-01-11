import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { templates } from '@/lib/templates';
import { useResumeStore } from '@/store/resumeStore';
import { useAppStore } from '@/store/appStore';
import { Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: string;
}

export function TemplateSelector({ open, onOpenChange, currentTemplate }: TemplateSelectorProps) {
  const { setTemplate } = useResumeStore();
  const { isPro } = useAppStore();

  const handleSelectTemplate = (templateId: string, isPremium: boolean) => {
    if (isPremium && !isPro) {
      // Show upgrade modal or redirect to pricing
      return;
    }
    setTemplate(templateId);
    onOpenChange(false);
  };

  const categories = ['modern', 'classic', 'minimal', 'professional'] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Choose Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {categories.map((category) => {
            const categoryTemplates = templates.filter((t) => t.category === category);
            if (categoryTemplates.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="font-medium capitalize mb-4">{category} Templates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryTemplates.map((template) => {
                    const isSelected = currentTemplate === template.id;
                    const isLocked = template.isPro && !isPro;

                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id, template.isPro)}
                        className={cn(
                          "relative group rounded-xl border-2 overflow-hidden transition-all duration-200",
                          isSelected 
                            ? "border-accent ring-2 ring-accent/20" 
                            : "border-border hover:border-accent/50",
                          isLocked && "opacity-75"
                        )}
                      >
                        {/* Template Preview */}
                        <div className="aspect-[3/4] bg-surface-2 p-3">
                          <div className="h-full bg-white rounded shadow-sm p-2 space-y-2">
                            <div className="h-2 w-2/3 bg-muted rounded mx-auto" />
                            <div className="h-1.5 w-full bg-muted rounded" />
                            <div className="h-1.5 w-4/5 bg-muted rounded" />
                            <div className="h-4" />
                            <div className="h-1 w-1/3 bg-accent/30 rounded" />
                            <div className="h-1.5 w-full bg-muted rounded" />
                            <div className="h-1.5 w-full bg-muted rounded" />
                          </div>
                        </div>

                        {/* Template Info */}
                        <div className="p-3 bg-card">
                          <p className="text-sm font-medium truncate">{template.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {template.isPro && (
                              <Badge variant="secondary" className="text-[10px] py-0">
                                PRO
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-accent-foreground" />
                          </div>
                        )}

                        {/* Locked Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-1">
                              <Lock className="h-5 w-5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Pro Only</span>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!isPro && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div>
              <p className="font-medium text-sm">Unlock all templates</p>
              <p className="text-xs text-muted-foreground">Get access to 50+ premium templates</p>
            </div>
            <Button variant="hero" size="sm">
              Upgrade to Pro
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
