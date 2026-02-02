import { v4 as uuidv4 } from 'uuid';
import type { Resume, ResumeSection } from '@/types/resume';

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

// Sample resume for first-time users to see how a completed resume looks
export const sampleResume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Sample Resume',
  templateId: 'modern-1',
  personalInfo: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
    title: 'Senior Software Engineer',
  },
  summary: 'Results-driven Senior Software Engineer with 6+ years of experience building scalable web applications. Led cross-functional teams to deliver products serving 2M+ users. Passionate about clean code, mentoring, and continuous improvement.',
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL',
    'Agile/Scrum', 'CI/CD', 'System Design'
  ],
  experience: [
    {
      id: uuidv4(),
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description: 'Lead engineer for the core platform team, responsible for architecture and development of customer-facing features.',
      achievements: [
        'Led migration of monolithic architecture to microservices, reducing deployment time by 75%',
        'Implemented real-time notification system serving 500K daily active users',
        'Mentored 4 junior developers, with 2 promoted to mid-level within 18 months',
        'Reduced API response times by 40% through database optimization and caching strategies'
      ],
    },
    {
      id: uuidv4(),
      company: 'StartupXYZ',
      position: 'Software Engineer',
      location: 'Remote',
      startDate: 'Mar 2018',
      endDate: 'Dec 2020',
      current: false,
      description: 'Full-stack developer working on B2B SaaS platform for project management.',
      achievements: [
        'Built React component library used across 3 product teams, improving development velocity by 30%',
        'Developed automated testing pipeline that increased code coverage from 45% to 85%',
        'Created internal CLI tool that reduced environment setup time from 2 hours to 15 minutes'
      ],
    },
  ],
  education: [
    {
      id: uuidv4(),
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      gpa: '3.8',
      achievements: ['Dean\'s List (6 semesters)', 'Computer Science Honors Society'],
    },
  ],
  projects: [
    {
      id: uuidv4(),
      name: 'Open Source Contribution - React Query',
      description: 'Contributed performance optimizations and bug fixes to the popular data-fetching library. Improved cache invalidation logic reducing memory usage by 15%.',
      technologies: ['TypeScript', 'React', 'Open Source'],
      link: 'github.com/alexjohnson/react-query',
    },
    {
      id: uuidv4(),
      name: 'Personal Portfolio & Blog',
      description: 'Built a personal website with an integrated blog using Next.js and MDX. Features server-side rendering, dark mode, and analytics.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      link: 'alexjohnson.dev',
    },
  ],
  certifications: [
    {
      id: uuidv4(),
      name: 'AWS Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: 'Mar 2023',
      expiryDate: 'Mar 2026',
      credentialId: 'AWS-SAA-123456',
      link: 'aws.amazon.com/verification',
    },
    {
      id: uuidv4(),
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: 'Jan 2022',
      credentialId: 'PSM-789012',
    },
  ],
  achievements: [
    {
      id: uuidv4(),
      title: 'Engineering Excellence Award',
      description: 'Recognized for exceptional contributions to platform reliability and team mentorship.',
      date: '2023',
    },
    {
      id: uuidv4(),
      title: 'Hackathon Winner - Internal Innovation Week',
      description: 'Led team of 4 to build AI-powered code review tool, adopted company-wide.',
      date: '2022',
    },
  ],
  sections: [...defaultSections],
};

// Create a full sample resume with generated IDs and dates
export function createSampleResume(): Resume {
  return {
    ...sampleResume,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
