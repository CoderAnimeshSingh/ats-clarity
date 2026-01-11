import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Resume, PersonalInfo, Experience, Education, Project, Certification, Achievement, ResumeSection } from '@/types/resume';

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

const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedIn: '',
  website: '',
  title: '',
};

export const createNewResume = (): Resume => ({
  id: uuidv4(),
  name: 'Untitled Resume',
  templateId: 'modern-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  personalInfo: { ...defaultPersonalInfo },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  sections: [...defaultSections],
});

interface ResumeState {
  currentResume: Resume | null;
  currentStep: number;
  isDirty: boolean;
  
  // Actions
  setCurrentResume: (resume: Resume | null) => void;
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  updateSkills: (skills: string[]) => void;
  
  // Experience
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Education
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Certifications
  addCertification: (certification: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  
  // Achievements
  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, achievement: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;
  
  // Sections
  updateSections: (sections: ResumeSection[]) => void;
  toggleSection: (sectionId: string) => void;
  
  // Template
  setTemplate: (templateId: string) => void;
  
  // Resume name
  setResumeName: (name: string) => void;
  
  // Reset
  resetStore: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  currentResume: null,
  currentStep: 0,
  isDirty: false,

  setCurrentResume: (resume) => set({ currentResume: resume, isDirty: false }),
  
  setCurrentStep: (step) => set({ currentStep: step }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            personalInfo: { ...state.currentResume.personalInfo, ...info },
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateSummary: (summary) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, summary, updatedAt: new Date() }
        : null,
      isDirty: true,
    })),

  updateSkills: (skills) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, skills, updatedAt: new Date() }
        : null,
      isDirty: true,
    })),

  addExperience: (experience) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            experience: [...state.currentResume.experience, { ...experience, id: uuidv4() }],
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateExperience: (id, experience) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            experience: state.currentResume.experience.map((exp) =>
              exp.id === id ? { ...exp, ...experience } : exp
            ),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  removeExperience: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            experience: state.currentResume.experience.filter((exp) => exp.id !== id),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  addEducation: (education) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            education: [...state.currentResume.education, { ...education, id: uuidv4() }],
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateEducation: (id, education) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            education: state.currentResume.education.map((edu) =>
              edu.id === id ? { ...edu, ...education } : edu
            ),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  removeEducation: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            education: state.currentResume.education.filter((edu) => edu.id !== id),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  addProject: (project) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            projects: [...state.currentResume.projects, { ...project, id: uuidv4() }],
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateProject: (id, project) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            projects: state.currentResume.projects.map((proj) =>
              proj.id === id ? { ...proj, ...project } : proj
            ),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  removeProject: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            projects: state.currentResume.projects.filter((proj) => proj.id !== id),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  addCertification: (certification) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            certifications: [...state.currentResume.certifications, { ...certification, id: uuidv4() }],
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateCertification: (id, certification) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            certifications: state.currentResume.certifications.map((cert) =>
              cert.id === id ? { ...cert, ...certification } : cert
            ),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  removeCertification: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            certifications: state.currentResume.certifications.filter((cert) => cert.id !== id),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  addAchievement: (achievement) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            achievements: [...state.currentResume.achievements, { ...achievement, id: uuidv4() }],
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateAchievement: (id, achievement) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            achievements: state.currentResume.achievements.map((ach) =>
              ach.id === id ? { ...ach, ...achievement } : ach
            ),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  removeAchievement: (id) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            achievements: state.currentResume.achievements.filter((ach) => ach.id !== id),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  updateSections: (sections) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, sections, updatedAt: new Date() }
        : null,
      isDirty: true,
    })),

  toggleSection: (sectionId) =>
    set((state) => ({
      currentResume: state.currentResume
        ? {
            ...state.currentResume,
            sections: state.currentResume.sections.map((section) =>
              section.id === sectionId ? { ...section, enabled: !section.enabled } : section
            ),
            updatedAt: new Date(),
          }
        : null,
      isDirty: true,
    })),

  setTemplate: (templateId) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, templateId, updatedAt: new Date() }
        : null,
      isDirty: true,
    })),

  setResumeName: (name) =>
    set((state) => ({
      currentResume: state.currentResume
        ? { ...state.currentResume, name, updatedAt: new Date() }
        : null,
      isDirty: true,
    })),

  resetStore: () => set({ currentResume: null, currentStep: 0, isDirty: false }),
}));
