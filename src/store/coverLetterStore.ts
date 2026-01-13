import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { CoverLetter } from '@/types/resume';

export type CoverLetterTone = 'professional' | 'friendly' | 'confident' | 'formal';

export interface CoverLetterTemplate {
  id: string;
  name: string;
  tone: CoverLetterTone;
  isPro: boolean;
  content: string;
}

export const coverLetterTemplates: CoverLetterTemplate[] = [
  {
    id: 'professional-1',
    name: 'Professional Standard',
    tone: 'professional',
    isPro: false,
    content: `Dear {{hiringManager}},

I am writing to express my strong interest in the {{jobTitle}} position at {{companyName}}. With my background in {{field}} and proven track record of delivering results, I am confident I would be a valuable addition to your team.

{{bodyContent}}

I am excited about the opportunity to bring my skills and experience to {{companyName}} and contribute to your continued success. Thank you for considering my application.

Sincerely,
{{fullName}}`
  },
  {
    id: 'confident-1',
    name: 'Confident Achiever',
    tone: 'confident',
    isPro: false,
    content: `Dear {{hiringManager}},

I am excited to apply for the {{jobTitle}} role at {{companyName}}. My experience has prepared me exceptionally well for this opportunity, and I am eager to bring my proven abilities to your organization.

{{bodyContent}}

I am confident that my skills align perfectly with your needs. I look forward to discussing how I can contribute to {{companyName}}'s success.

Best regards,
{{fullName}}`
  },
  {
    id: 'friendly-1',
    name: 'Friendly & Personable',
    tone: 'friendly',
    isPro: false,
    content: `Hi {{hiringManager}},

I hope this message finds you well! I'm thrilled to apply for the {{jobTitle}} position at {{companyName}}. When I came across this opportunity, I knew it was the perfect fit for my skills and passion.

{{bodyContent}}

I'd love the chance to chat more about how I can contribute to your amazing team. Thanks so much for your time and consideration!

Warm regards,
{{fullName}}`
  },
  {
    id: 'formal-1',
    name: 'Formal Executive',
    tone: 'formal',
    isPro: false,
    content: `Dear {{hiringManager}},

I respectfully submit my application for the position of {{jobTitle}} at {{companyName}}. Having carefully reviewed the requirements of this role, I am confident that my qualifications and experience align precisely with your organization's needs.

{{bodyContent}}

I would welcome the opportunity to discuss my candidacy at your earliest convenience. Thank you for your consideration of my application.

Respectfully yours,
{{fullName}}`
  },
  {
    id: 'professional-2',
    name: 'Impact-Focused',
    tone: 'professional',
    isPro: false,
    content: `Dear {{hiringManager}},

The {{jobTitle}} position at {{companyName}} immediately caught my attention. My background demonstrates a consistent pattern of driving measurable results, and I am eager to bring this same impact to your team.

{{bodyContent}}

I am enthusiastic about the possibility of contributing to {{companyName}}'s mission. I look forward to the opportunity to discuss how my experience can benefit your organization.

Best regards,
{{fullName}}`
  },
  {
    id: 'confident-2',
    name: 'Bold Innovator',
    tone: 'confident',
    isPro: false,
    content: `Dear {{hiringManager}},

Innovation drives me, and that's exactly why the {{jobTitle}} position at {{companyName}} excites me. I bring a unique combination of skills that will directly impact your team's success.

{{bodyContent}}

Let's connect and discuss how my innovative approach can drive results for {{companyName}}. I'm ready to make an immediate impact.

Best,
{{fullName}}`
  },
];

export const createNewCoverLetter = (): CoverLetter => ({
  id: uuidv4(),
  name: 'Untitled Cover Letter',
  companyName: '',
  jobTitle: '',
  hiringManagerName: '',
  tone: 'professional',
  content: '',
  createdAt: new Date(),
  updatedAt: new Date(),
});

interface CoverLetterState {
  currentCoverLetter: CoverLetter | null;
  selectedTemplateId: string | null;
  
  // Actions
  setCurrentCoverLetter: (coverLetter: CoverLetter | null) => void;
  updateCoverLetter: (updates: Partial<CoverLetter>) => void;
  setSelectedTemplate: (templateId: string | null) => void;
  applyTemplate: (templateId: string) => void;
  generateContent: () => void;
  resetStore: () => void;
}

export const useCoverLetterStore = create<CoverLetterState>((set, get) => ({
  currentCoverLetter: null,
  selectedTemplateId: null,

  setCurrentCoverLetter: (coverLetter) => set({ currentCoverLetter: coverLetter }),
  
  updateCoverLetter: (updates) =>
    set((state) => ({
      currentCoverLetter: state.currentCoverLetter
        ? { ...state.currentCoverLetter, ...updates, updatedAt: new Date() }
        : null,
    })),

  setSelectedTemplate: (templateId) => set({ selectedTemplateId: templateId }),

  applyTemplate: (templateId) => {
    const template = coverLetterTemplates.find(t => t.id === templateId);
    if (template) {
      const { currentCoverLetter } = get();
      if (currentCoverLetter) {
        const content = template.content
          .replace(/{{hiringManager}}/g, currentCoverLetter.hiringManagerName || 'Hiring Manager')
          .replace(/{{jobTitle}}/g, currentCoverLetter.jobTitle || '[Job Title]')
          .replace(/{{companyName}}/g, currentCoverLetter.companyName || '[Company Name]')
          .replace(/{{fullName}}/g, '[Your Name]')
          .replace(/{{field}}/g, '[Your Field]')
          .replace(/{{bodyContent}}/g, '[Describe your relevant experience, achievements, and why you\'re a great fit for this role...]');
        
        set((state) => ({
          selectedTemplateId: templateId,
          currentCoverLetter: state.currentCoverLetter
            ? { ...state.currentCoverLetter, tone: template.tone, content, updatedAt: new Date() }
            : null,
        }));
      }
    }
  },

  generateContent: () => {
    const { currentCoverLetter, selectedTemplateId } = get();
    if (currentCoverLetter && selectedTemplateId) {
      const template = coverLetterTemplates.find(t => t.id === selectedTemplateId);
      if (template) {
        const content = template.content
          .replace(/{{hiringManager}}/g, currentCoverLetter.hiringManagerName || 'Hiring Manager')
          .replace(/{{jobTitle}}/g, currentCoverLetter.jobTitle || '[Job Title]')
          .replace(/{{companyName}}/g, currentCoverLetter.companyName || '[Company Name]')
          .replace(/{{fullName}}/g, '[Your Name]')
          .replace(/{{field}}/g, '[Your Field]')
          .replace(/{{bodyContent}}/g, currentCoverLetter.content.includes('[Describe') 
            ? '[Describe your relevant experience, achievements, and why you\'re a great fit for this role...]'
            : currentCoverLetter.content.split('\n\n').slice(2, -2).join('\n\n') || '[Describe your relevant experience...]');
        
        set((state) => ({
          currentCoverLetter: state.currentCoverLetter
            ? { ...state.currentCoverLetter, content, updatedAt: new Date() }
            : null,
        }));
      }
    }
  },

  resetStore: () => set({ currentCoverLetter: null, selectedTemplateId: null }),
}));
