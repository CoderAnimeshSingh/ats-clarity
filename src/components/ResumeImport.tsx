import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileJson, Linkedin, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Resume, Experience, Education, Project, ResumeSection } from '@/types/resume';

interface ResumeImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (resume: Resume) => void;
}

const defaultSections: ResumeSection[] = [
  { id: '1', type: 'personalInfo', enabled: true, order: 0 },
  { id: '2', type: 'summary', enabled: true, order: 1 },
  { id: '3', type: 'skills', enabled: true, order: 2 },
  { id: '4', type: 'experience', enabled: true, order: 3 },
  { id: '5', type: 'projects', enabled: true, order: 4 },
  { id: '6', type: 'education', enabled: true, order: 5 },
  { id: '7', type: 'certifications', enabled: true, order: 6 },
  { id: '8', type: 'achievements', enabled: true, order: 7 },
];

export function ResumeImport({ open, onOpenChange, onImport }: ResumeImportProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseLinkedInData = (data: any): Resume => {
    const now = new Date();
    
    // Parse positions/experience
    const experience: Experience[] = (data.positions || data.experience || []).map((pos: any) => ({
      id: uuidv4(),
      company: pos.companyName || pos.company || '',
      position: pos.title || pos.position || '',
      location: pos.location || pos.locationName || '',
      startDate: pos.startDate ? `${pos.startDate.month || '01'}/${pos.startDate.year || ''}` : '',
      endDate: pos.endDate ? `${pos.endDate.month || '01'}/${pos.endDate.year || ''}` : '',
      current: !pos.endDate,
      description: pos.description || pos.summary || '',
      achievements: [],
    }));

    // Parse education
    const education: Education[] = (data.education || []).map((edu: any) => ({
      id: uuidv4(),
      institution: edu.schoolName || edu.school || edu.institution || '',
      degree: edu.degreeName || edu.degree || '',
      field: edu.fieldOfStudy || edu.field || '',
      startDate: edu.startDate ? `${edu.startDate.year || ''}` : '',
      endDate: edu.endDate ? `${edu.endDate.year || ''}` : '',
      gpa: edu.grade || edu.gpa || '',
      achievements: [],
    }));

    // Parse skills
    const skills: string[] = (data.skills || []).map((skill: any) => 
      typeof skill === 'string' ? skill : skill.name || skill.skill || ''
    ).filter(Boolean);

    // Parse projects
    const projects: Project[] = (data.projects || []).map((proj: any) => ({
      id: uuidv4(),
      name: proj.name || proj.title || '',
      description: proj.description || '',
      technologies: proj.technologies || [],
      link: proj.url || proj.link || '',
    }));

    return {
      id: uuidv4(),
      name: `${data.firstName || data.name || 'Imported'} Resume`,
      templateId: 'modern-1',
      createdAt: now,
      updatedAt: now,
      personalInfo: {
        fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.name || '',
        email: data.emailAddress || data.email || '',
        phone: data.phoneNumbers?.[0]?.number || data.phone || '',
        location: data.location?.name || data.location || data.locationName || '',
        linkedIn: data.linkedInUrl || data.publicProfileUrl || '',
        website: data.website || data.websites?.[0]?.url || '',
        title: data.headline || data.title || experience[0]?.position || '',
      },
      summary: data.summary || data.about || '',
      skills,
      experience,
      education,
      projects,
      certifications: (data.certifications || []).map((cert: any) => ({
        id: uuidv4(),
        name: cert.name || '',
        issuer: cert.authority || cert.issuer || '',
        date: cert.startDate ? `${cert.startDate.year || ''}` : '',
        credentialId: cert.licenseNumber || cert.credentialId || '',
        link: cert.url || '',
      })),
      achievements: [],
      sections: [...defaultSections],
    };
  };

  const parseJSONResume = (data: any): Resume => {
    const now = new Date();

    // Check if it's a standard JSON Resume format
    if (data.basics) {
      return {
        id: uuidv4(),
        name: `${data.basics.name || 'Imported'} Resume`,
        templateId: 'modern-1',
        createdAt: now,
        updatedAt: now,
        personalInfo: {
          fullName: data.basics.name || '',
          email: data.basics.email || '',
          phone: data.basics.phone || '',
          location: data.basics.location ? 
            `${data.basics.location.city || ''}, ${data.basics.location.region || ''}`.replace(/, $/, '') : '',
          linkedIn: data.basics.profiles?.find((p: any) => p.network?.toLowerCase() === 'linkedin')?.url || '',
          website: data.basics.url || data.basics.website || '',
          title: data.basics.label || '',
        },
        summary: data.basics.summary || '',
        skills: (data.skills || []).flatMap((s: any) => 
          typeof s === 'string' ? [s] : s.keywords || [s.name]
        ).filter(Boolean),
        experience: (data.work || []).map((w: any) => ({
          id: uuidv4(),
          company: w.company || w.name || '',
          position: w.position || w.title || '',
          location: w.location || '',
          startDate: w.startDate || '',
          endDate: w.endDate || '',
          current: !w.endDate,
          description: w.summary || w.description || '',
          achievements: w.highlights || [],
        })),
        education: (data.education || []).map((e: any) => ({
          id: uuidv4(),
          institution: e.institution || '',
          degree: e.studyType || e.degree || '',
          field: e.area || e.field || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          gpa: e.gpa || e.score || '',
          achievements: e.courses || [],
        })),
        projects: (data.projects || []).map((p: any) => ({
          id: uuidv4(),
          name: p.name || '',
          description: p.description || '',
          technologies: p.keywords || p.technologies || [],
          link: p.url || '',
        })),
        certifications: (data.certificates || []).map((c: any) => ({
          id: uuidv4(),
          name: c.name || '',
          issuer: c.issuer || '',
          date: c.date || '',
          link: c.url || '',
        })),
        achievements: (data.awards || []).map((a: any) => ({
          id: uuidv4(),
          title: a.title || '',
          description: a.summary || '',
          date: a.date || '',
        })),
        sections: [...defaultSections],
      };
    }

    // Try to parse as our own format or LinkedIn format
    return parseLinkedInData(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const resume = parseJSONResume(data);
      
      onImport(resume);
      toast({
        title: 'Resume imported successfully!',
        description: `Imported "${resume.name}" with ${resume.experience.length} experiences and ${resume.skills.length} skills.`,
      });
      onOpenChange(false);
      setJsonInput('');
    } catch (err) {
      setError('Failed to parse the file. Please ensure it\'s a valid JSON file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasteImport = () => {
    if (!jsonInput.trim()) {
      setError('Please paste your JSON data first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = JSON.parse(jsonInput);
      const resume = parseJSONResume(data);
      
      onImport(resume);
      toast({
        title: 'Resume imported successfully!',
        description: `Imported "${resume.name}" with ${resume.experience.length} experiences and ${resume.skills.length} skills.`,
      });
      onOpenChange(false);
      setJsonInput('');
    } catch (err) {
      setError('Failed to parse JSON. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Resume
          </DialogTitle>
          <DialogDescription>
            Import your resume from LinkedIn export or JSON Resume format.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="file" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              Paste JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4 space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-file-input"
              />
              <label 
                htmlFor="resume-file-input"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Click to upload JSON file</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports LinkedIn export, JSON Resume format
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <h4 className="font-medium mb-2">How to export from LinkedIn:</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Go to LinkedIn Settings & Privacy</li>
                <li>Click "Get a copy of your data"</li>
                <li>Select "Want something in particular?" → Profile</li>
                <li>Download and upload the JSON file here</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="json-input">Paste JSON Data</Label>
              <Textarea
                id="json-input"
                placeholder='{"basics": {"name": "John Doe", "email": "john@example.com"}, ...}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handlePasteImport} 
              disabled={isProcessing || !jsonInput.trim()}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Import Resume'}
            </Button>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm mt-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-4 p-3 bg-accent/10 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-accent">Supported Formats:</p>
              <ul className="text-muted-foreground mt-1 space-y-0.5">
                <li>• LinkedIn Data Export (JSON)</li>
                <li>• JSON Resume Standard (jsonresume.org)</li>
                <li>• Custom JSON with resume fields</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
