export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  title: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface ResumeSection {
  id: string;
  type: 'personalInfo' | 'summary' | 'skills' | 'experience' | 'education' | 'projects' | 'certifications' | 'achievements';
  enabled: boolean;
  order: number;
}

export interface Resume {
  id: string;
  name: string;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  sections: ResumeSection[];
  atsScore?: number;
}

export interface CoverLetter {
  id: string;
  resumeId?: string;
  name: string;
  companyName: string;
  jobTitle: string;
  hiringManagerName?: string;
  tone: 'professional' | 'friendly' | 'confident' | 'formal';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
  industry?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  isPro: boolean;
  preview: string;
}

export interface UserSettings {
  isPro: boolean;
  licenseKey?: string;
  activatedAt?: Date;
}
