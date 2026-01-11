import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Eye,
  Settings,
  Check
} from 'lucide-react';
import { useResumeStore, createNewResume } from '@/store/resumeStore';
import { getResume, saveResume } from '@/lib/db';
import { analyzeResume, getScoreLabel } from '@/lib/atsEngine';
import { PersonalInfoStep } from '@/components/builder/PersonalInfoStep';
import { SummaryStep } from '@/components/builder/SummaryStep';
import { SkillsStep } from '@/components/builder/SkillsStep';
import { ExperienceStep } from '@/components/builder/ExperienceStep';
import { EducationStep } from '@/components/builder/EducationStep';
import { ProjectsStep } from '@/components/builder/ProjectsStep';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { ATSScoreCard } from '@/components/builder/ATSScoreCard';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'personal', title: 'Personal Info', component: PersonalInfoStep },
  { id: 'summary', title: 'Summary', component: SummaryStep },
  { id: 'skills', title: 'Skills', component: SkillsStep },
  { id: 'experience', title: 'Experience', component: ExperienceStep },
  { id: 'education', title: 'Education', component: EducationStep },
  { id: 'projects', title: 'Projects', component: ProjectsStep },
];

export default function BuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, setCurrentResume, currentStep, setCurrentStep, isDirty } = useResumeStore();
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load resume
  useEffect(() => {
    const loadResume = async () => {
      if (id && id !== 'new') {
        const resume = await getResume(id);
        if (resume) {
          setCurrentResume(resume);
        } else {
          navigate('/dashboard');
        }
      } else {
        const newResume = createNewResume();
        setCurrentResume(newResume);
        navigate(`/builder/${newResume.id}`, { replace: true });
      }
    };
    loadResume();
  }, [id, setCurrentResume, navigate]);

  // Auto-save
  useEffect(() => {
    if (!currentResume || !isDirty) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      await saveResume(currentResume);
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [currentResume, isDirty]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleExport = async () => {
    // PDF export will be handled by preview component
    const previewElement = document.getElementById('resume-preview-container');
    if (previewElement) {
      // Trigger download through PDF component
      const event = new CustomEvent('exportPDF');
      previewElement.dispatchEvent(event);
    }
  };

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const analysis = analyzeResume(currentResume);
  const CurrentStepComponent = steps[currentStep].component;

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
                <FileText className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm">{currentResume.name}</span>
              {isSaving && (
                <span className="text-xs text-muted-foreground">Saving...</span>
              )}
              {!isSaving && isDirty === false && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <div className={cn(
                "h-2 w-2 rounded-full",
                analysis.overallScore >= 80 ? "bg-score-excellent" :
                analysis.overallScore >= 60 ? "bg-score-good" : "bg-score-poor"
              )} />
              <span className="text-sm font-medium">{analysis.overallScore}% ATS Score</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowTemplates(true)}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Template</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="lg:hidden"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button variant="hero" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border bg-surface-2 py-3 shrink-0 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 px-4 min-w-max">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                index === currentStep 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : index < currentStep
                    ? "text-foreground hover:bg-muted"
                    : "text-muted-foreground hover:bg-muted"
              )}
            >
              <span className={cn(
                "h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium",
                index === currentStep 
                  ? "bg-accent-foreground/20" 
                  : index < currentStep
                    ? "bg-score-excellent text-primary-foreground"
                    : "bg-muted"
              )}>
                {index < currentStep ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          showPreview ? "lg:w-1/2" : "w-full"
        )}>
          <div className="max-w-2xl mx-auto p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>

              <Button
                variant="hero"
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* ATS Score Card (Mobile) */}
            <div className="mt-8 lg:hidden">
              <ATSScoreCard analysis={analysis} />
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={cn(
          "hidden lg:flex flex-col w-1/2 border-l border-border bg-surface-2",
          !showPreview && "lg:hidden"
        )}>
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <h3 className="font-medium text-sm">Live Preview</h3>
            <ATSScoreCard analysis={analysis} compact />
          </div>
          <div id="resume-preview-container" className="flex-1 overflow-y-auto p-6">
            <ResumePreview resume={currentResume} />
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector 
        open={showTemplates} 
        onOpenChange={setShowTemplates}
        currentTemplate={currentResume.templateId}
      />
    </div>
  );
}
