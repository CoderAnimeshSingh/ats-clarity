import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  ChevronLeft, 
  Download,
  Check,
  Building2,
  User,
  Briefcase,
  Sparkles,
  Lock
} from 'lucide-react';
import { 
  useCoverLetterStore, 
  createNewCoverLetter, 
  coverLetterTemplates,
  type CoverLetterTone 
} from '@/store/coverLetterStore';
import { getCoverLetter, saveCoverLetter } from '@/lib/db';
import { useAppStore } from '@/store/appStore';
import { ProUpgradeModal } from '@/components/upgrade/ProUpgradeModal';
import { CoverLetterExportDialog } from '@/components/cover-letter/CoverLetterExportDialog';
import { cn } from '@/lib/utils';
import type { CoverLetter } from '@/types/resume';

const toneOptions: { value: CoverLetterTone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Balanced and polished' },
  { value: 'confident', label: 'Confident', description: 'Bold and achievement-focused' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and personable' },
  { value: 'formal', label: 'Formal', description: 'Traditional and executive' },
];

export default function CoverLetterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPro } = useAppStore();
  const { 
    currentCoverLetter, 
    setCurrentCoverLetter, 
    updateCoverLetter,
    selectedTemplateId,
    applyTemplate,
    setSelectedTemplate
  } = useCoverLetterStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeStep, setActiveStep] = useState<'details' | 'template' | 'content'>('details');

  // Load cover letter
  useEffect(() => {
    const loadCoverLetter = async () => {
      if (id && id !== 'new') {
        const letter = await getCoverLetter(id);
        if (letter) {
          setCurrentCoverLetter(letter);
        } else {
          navigate('/dashboard');
        }
      } else {
        const newLetter = createNewCoverLetter();
        setCurrentCoverLetter(newLetter);
        navigate(`/cover-letter/${newLetter.id}`, { replace: true });
      }
    };
    loadCoverLetter();
  }, [id, setCurrentCoverLetter, navigate]);

  // Auto-save
  useEffect(() => {
    if (!currentCoverLetter || !isDirty) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      await saveCoverLetter(currentCoverLetter);
      setIsSaving(false);
      setIsDirty(false);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [currentCoverLetter, isDirty]);

  const handleUpdate = (updates: Partial<CoverLetter>) => {
    updateCoverLetter(updates);
    setIsDirty(true);
  };

  const handleSelectTemplate = (templateId: string) => {
    // All templates are free now
    applyTemplate(templateId);
    setIsDirty(true);
    setActiveStep('content');
  };

  if (!currentCoverLetter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card shrink-0">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded gradient-bg flex items-center justify-center">
                <Mail className="h-3 w-3 text-primary-foreground" />
              </div>
              <Input
                value={currentCoverLetter.name}
                onChange={(e) => handleUpdate({ name: e.target.value })}
                className="h-7 text-sm font-medium border-0 bg-transparent px-1 focus-visible:ring-0 w-[200px]"
              />
              {isSaving && (
                <span className="text-xs text-muted-foreground">Saving...</span>
              )}
              {!isSaving && !isDirty && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
          </div>

          <Button variant="hero" size="sm" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Export PDF</span>
          </Button>
        </div>
      </header>

      {/* Step Navigation */}
      <div className="border-b border-border bg-surface-2 py-3 shrink-0">
        <div className="flex items-center justify-center gap-4 px-4">
          {(['details', 'template', 'content'] as const).map((step, index) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200",
                activeStep === step 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium",
                activeStep === step 
                  ? "bg-accent-foreground/20" 
                  : "bg-muted"
              )}>
                {index + 1}
              </span>
              <span className="hidden sm:inline capitalize">{step}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 lg:w-1/2 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {activeStep === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">Job Details</h2>
                    <p className="text-muted-foreground">
                      Enter the job details to personalize your cover letter.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        placeholder="Google, Apple, etc."
                        value={currentCoverLetter.companyName}
                        onChange={(e) => handleUpdate({ companyName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="flex items-center gap-2">
                        <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                        Job Title *
                      </Label>
                      <Input
                        id="jobTitle"
                        placeholder="Software Engineer, Product Manager, etc."
                        value={currentCoverLetter.jobTitle}
                        onChange={(e) => handleUpdate({ jobTitle: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hiringManager" className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        Hiring Manager Name (optional)
                      </Label>
                      <Input
                        id="hiringManager"
                        placeholder="Jane Smith"
                        value={currentCoverLetter.hiringManagerName || ''}
                        onChange={(e) => handleUpdate({ hiringManagerName: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave blank to use "Hiring Manager"
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      variant="hero" 
                      onClick={() => setActiveStep('template')}
                      disabled={!currentCoverLetter.companyName || !currentCoverLetter.jobTitle}
                    >
                      Continue to Templates
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeStep === 'template' && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">Choose a Template</h2>
                    <p className="text-muted-foreground">
                      Select a tone that matches your style and the company culture.
                    </p>
                  </div>

                  {/* Tone Selector */}
                  <div className="grid grid-cols-2 gap-3">
                    {toneOptions.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => handleUpdate({ tone: tone.value })}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all duration-200",
                          currentCoverLetter.tone === tone.value
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <p className="font-medium text-sm">{tone.label}</p>
                        <p className="text-xs text-muted-foreground">{tone.description}</p>
                      </button>
                    ))}
                  </div>

                  {/* Templates */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">Available Templates</h3>
                    <div className="grid gap-3">
                      {coverLetterTemplates
                        .filter(t => t.tone === currentCoverLetter.tone)
                        .map((template) => {
                          const isLocked = template.isPro && !isPro;
                          const isSelected = selectedTemplateId === template.id;

                          return (
                            <button
                              key={template.id}
                              onClick={() => handleSelectTemplate(template.id)}
                              className={cn(
                                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                                isSelected
                                  ? "border-accent bg-accent/5"
                                  : "border-border hover:border-accent/50",
                                isLocked && "opacity-75"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{template.name}</p>
                                    {template.isPro && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent">
                                        PRO
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {template.content.split('\n')[0].replace(/{{.*?}}/g, '...').slice(0, 60)}...
                                  </p>
                                </div>
                                {isLocked ? (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                ) : isSelected ? (
                                  <Check className="h-5 w-5 text-accent" />
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 'content' && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">Edit Your Letter</h2>
                    <p className="text-muted-foreground">
                      Customize your cover letter content. Replace the placeholders with your information.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="content">Cover Letter Content</Label>
                      <Textarea
                        id="content"
                        value={currentCoverLetter.content}
                        onChange={(e) => handleUpdate({ content: e.target.value })}
                        className="min-h-[400px] font-mono text-sm resize-none"
                        placeholder="Select a template first, then customize your content here..."
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3" />
                      <span>Pro tip: Replace all [bracketed] placeholders with your actual information.</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="hero" onClick={() => setShowExport(true)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:flex flex-col w-1/2 border-l border-border bg-surface-2">
          <div className="p-4 border-b border-border bg-card">
            <h3 className="font-medium text-sm">Live Preview</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white shadow-hero rounded-lg overflow-hidden mx-auto max-w-[500px] aspect-[8.5/11]">
              <div className="p-6 h-full overflow-y-auto text-[10px] leading-relaxed text-gray-800 whitespace-pre-wrap font-serif">
                {currentCoverLetter.content || (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>Select a template to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProUpgradeModal 
        open={showUpgrade} 
        onOpenChange={setShowUpgrade}
        feature="Premium Templates"
      />
      
      <CoverLetterExportDialog
        open={showExport}
        onOpenChange={setShowExport}
        coverLetter={currentCoverLetter}
      />
    </div>
  );
}
