import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Copy, 
  Clock, 
  MoreVertical,
  Mail,
  ChevronRight,
  Search,
  Upload
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllResumes, deleteResume, duplicateResume, getAllCoverLetters, deleteCoverLetter } from '@/lib/db';
import { createNewResume, useResumeStore } from '@/store/resumeStore';
import { saveResume } from '@/lib/db';
import type { Resume, CoverLetter } from '@/types/resume';
import { analyzeResume } from '@/lib/atsEngine';
import { formatDistanceToNow } from 'date-fns';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ResumeImport } from '@/components/ResumeImport';

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [activeTab, setActiveTab] = useState('resumes');
  const navigate = useNavigate();
  const { setCurrentResume } = useResumeStore();


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resumeData, coverLetterData] = await Promise.all([
        getAllResumes(),
        getAllCoverLetters(),
      ]);
      setResumes(resumeData);
      setCoverLetters(coverLetterData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    const newResume = createNewResume();
    await saveResume(newResume);
    setCurrentResume(newResume);
    navigate(`/builder/${newResume.id}`);
  };

  const handleCreateCoverLetter = () => {
    navigate('/cover-letter/new');
  };

  const handleDeleteResume = async (id: string) => {
    await deleteResume(id);
    setResumes(resumes.filter(r => r.id !== id));
  };

  const handleDuplicateResume = async (id: string) => {
    const newId = await duplicateResume(id);
    await loadData();
    navigate(`/builder/${newId}`);
  };

  const handleDeleteCoverLetter = async (id: string) => {
    await deleteCoverLetter(id);
    setCoverLetters(coverLetters.filter(c => c.id !== id));
  };

  const handleImportResume = async (resume: Resume) => {
    await saveResume(resume);
    setCurrentResume(resume);
    navigate(`/builder/${resume.id}`);
  };

  const filteredResumes = resumes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoverLetters = coverLetters.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container-wide section-padding">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">ResumeATS</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={() => setShowImport(true)}>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Import</span>
              </Button>
              <Button variant="hero" onClick={handleCreateResume}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">New Resume</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-wide section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Your Documents</h1>
          <p className="text-muted-foreground">Manage your resumes and cover letters</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="resumes" className="gap-2">
              <FileText className="h-4 w-4" />
              Resumes ({resumes.length})
            </TabsTrigger>
            <TabsTrigger value="cover-letters" className="gap-2">
              <Mail className="h-4 w-4" />
              Cover Letters ({coverLetters.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumes" className="space-y-4">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredResumes.length === 0 ? (
              <EmptyState
                title="No resumes yet"
                description="Create your first ATS-optimized resume and land your dream job."
                actionLabel="Create Resume"
                onAction={handleCreateResume}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Create New Card */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleCreateResume}
                  className="group h-48 rounded-xl border-2 border-dashed border-border hover:border-accent bg-surface-2 hover:bg-accent/5 flex flex-col items-center justify-center gap-3 transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Plus className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-medium text-muted-foreground group-hover:text-accent transition-colors">
                    Create New Resume
                  </span>
                </motion.button>

                {/* Resume Cards */}
                {filteredResumes.map((resume, index) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    index={index}
                    onDelete={() => handleDeleteResume(resume.id)}
                    onDuplicate={() => handleDuplicateResume(resume.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cover-letters" className="space-y-4">
            {filteredCoverLetters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">No cover letters yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Create a personalized cover letter to accompany your resume.</p>
                <Button variant="hero" asChild>
                  <Link to="/cover-letter/new">
                    <Plus className="h-4 w-4" />
                    Create Cover Letter
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Create New Card */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleCreateCoverLetter}
                  className="group h-48 rounded-xl border-2 border-dashed border-border hover:border-accent bg-surface-2 hover:bg-accent/5 flex flex-col items-center justify-center gap-3 transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Plus className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-medium text-muted-foreground group-hover:text-accent transition-colors">
                    Create Cover Letter
                  </span>
                </motion.button>

                {filteredCoverLetters.map((letter, index) => (
                  <CoverLetterCard
                    key={letter.id}
                    letter={letter}
                    index={index + 1}
                    onDelete={() => handleDeleteCoverLetter(letter.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Resume Import Dialog */}
        <ResumeImport
          open={showImport}
          onOpenChange={setShowImport}
          onImport={handleImportResume}
        />
      </main>
    </div>
  );
}

interface ResumeCardProps {
  resume: Resume;
  index: number;
  onDelete: () => void;
  onDuplicate: () => void;
}

const ResumeCard = React.forwardRef<HTMLDivElement, ResumeCardProps>(
  function ResumeCard({ resume, index, onDelete, onDuplicate }, ref) {
    const navigate = useNavigate();
    const { setCurrentResume } = useResumeStore();
    const analysis = analyzeResume(resume);
    
    const handleEdit = () => {
      setCurrentResume(resume);
      navigate(`/builder/${resume.id}`);
    };

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'bg-score-excellent';
      if (score >= 60) return 'bg-score-good';
      return 'bg-score-poor';
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group relative rounded-xl border border-border bg-card p-5 hover:shadow-elevated hover:border-accent/50 transition-all duration-200 cursor-pointer"
        onClick={handleEdit}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold line-clamp-1">{resume.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {resume.personalInfo.fullName || 'No name added'}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(); }}>
                <ChevronRight className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getScoreColor(analysis.overallScore)}`} />
            <span className="text-sm font-medium">{analysis.overallScore}%</span>
          </div>
        </div>
      </motion.div>
    );
  }
);

interface CoverLetterCardProps {
  letter: CoverLetter;
  index: number;
  onDelete: () => void;
}

function CoverLetterCard({ letter, index, onDelete }: CoverLetterCardProps) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-xl border border-border bg-card p-5 hover:shadow-elevated hover:border-accent/50 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/cover-letter/${letter.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold line-clamp-1">{letter.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {letter.companyName} - {letter.jobTitle}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{formatDistanceToNow(new Date(letter.updatedAt), { addSuffix: true })}</span>
      </div>
    </motion.div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

function EmptyState({ title, description, actionLabel, onAction, icon: Icon = FileText }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button variant="hero" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAction(); }}>
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Button>
    </div>
  );
}
