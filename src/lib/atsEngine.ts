import type { Resume } from '@/types/resume';

interface ATSRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  check: (resume: Resume) => { passed: boolean; score: number; feedback: string };
}

const atsRules: ATSRule[] = [
  {
    id: 'contact-info',
    name: 'Contact Information',
    description: 'Check if all contact information is provided',
    weight: 15,
    check: (resume) => {
      const { fullName, email, phone, location } = resume.personalInfo;
      const hasAll = Boolean(fullName && email && phone && location);
      const partial = [fullName, email, phone, location].filter(Boolean).length;
      const score = (partial / 4) * 100;
      return {
        passed: hasAll,
        score,
        feedback: hasAll 
          ? 'All contact information provided' 
          : `Missing: ${[!fullName && 'name', !email && 'email', !phone && 'phone', !location && 'location'].filter(Boolean).join(', ')}`,
      };
    },
  },
  {
    id: 'summary',
    name: 'Professional Summary',
    description: 'Check if summary is between 50-300 characters',
    weight: 10,
    check: (resume) => {
      const length = resume.summary.length;
      const hasGoodLength = length >= 50 && length <= 300;
      const score = length === 0 ? 0 : hasGoodLength ? 100 : length < 50 ? (length / 50) * 100 : Math.max(0, 100 - ((length - 300) / 100) * 50);
      return {
        passed: hasGoodLength,
        score: Math.min(100, Math.max(0, score)),
        feedback: length === 0 
          ? 'Add a professional summary' 
          : hasGoodLength 
            ? 'Summary length is optimal' 
            : length < 50 
              ? 'Summary is too short' 
              : 'Summary may be too long',
      };
    },
  },
  {
    id: 'skills',
    name: 'Skills Section',
    description: 'Check if skills section has 5-15 relevant skills',
    weight: 15,
    check: (resume) => {
      const count = resume.skills.length;
      const hasGoodCount = count >= 5 && count <= 15;
      const score = count === 0 ? 0 : hasGoodCount ? 100 : count < 5 ? (count / 5) * 100 : Math.max(50, 100 - ((count - 15) * 5));
      return {
        passed: hasGoodCount,
        score: Math.min(100, Math.max(0, score)),
        feedback: count === 0 
          ? 'Add relevant skills' 
          : hasGoodCount 
            ? `Good number of skills (${count})` 
            : count < 5 
              ? 'Add more skills (aim for 5-15)' 
              : 'Consider reducing skills to highlight the most relevant',
      };
    },
  },
  {
    id: 'experience',
    name: 'Work Experience',
    description: 'Check work experience entries with achievements',
    weight: 25,
    check: (resume) => {
      const count = resume.experience.length;
      const hasAchievements = resume.experience.filter(exp => exp.achievements.length > 0).length;
      
      if (count === 0) {
        return { passed: false, score: 0, feedback: 'Add work experience' };
      }
      
      const achievementScore = (hasAchievements / count) * 50;
      const countScore = Math.min(count, 3) / 3 * 50;
      const score = achievementScore + countScore;
      
      return {
        passed: count >= 1 && hasAchievements >= count * 0.5,
        score,
        feedback: hasAchievements < count 
          ? 'Add achievements/bullet points to all experiences' 
          : 'Work experience is well documented',
      };
    },
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Check if education is provided',
    weight: 10,
    check: (resume) => {
      const count = resume.education.length;
      return {
        passed: count > 0,
        score: count > 0 ? 100 : 0,
        feedback: count > 0 ? 'Education information provided' : 'Add education details',
      };
    },
  },
  {
    id: 'action-verbs',
    name: 'Action Verbs',
    description: 'Check if descriptions use strong action verbs',
    weight: 10,
    check: (resume) => {
      const actionVerbs = [
        'achieved', 'accomplished', 'administered', 'analyzed', 'built', 'created', 
        'designed', 'developed', 'directed', 'established', 'executed', 'generated',
        'implemented', 'improved', 'increased', 'launched', 'led', 'managed', 
        'optimized', 'orchestrated', 'organized', 'oversaw', 'planned', 'produced',
        'reduced', 'resolved', 'spearheaded', 'streamlined', 'supervised', 'transformed'
      ];
      
      const allText = [
        resume.summary,
        ...resume.experience.flatMap(exp => [exp.description, ...exp.achievements]),
        ...resume.projects.map(p => p.description),
      ].join(' ').toLowerCase();
      
      const foundVerbs = actionVerbs.filter(verb => allText.includes(verb));
      const score = Math.min(100, (foundVerbs.length / 5) * 100);
      
      return {
        passed: foundVerbs.length >= 3,
        score,
        feedback: foundVerbs.length >= 3 
          ? `Using ${foundVerbs.length} action verbs` 
          : 'Use more action verbs (achieved, developed, led, etc.)',
      };
    },
  },
  {
    id: 'quantifiable',
    name: 'Quantifiable Results',
    description: 'Check if achievements include numbers and metrics',
    weight: 15,
    check: (resume) => {
      const numberPattern = /\d+%?|\$[\d,]+|#\d+/g;
      
      const allAchievements = resume.experience.flatMap(exp => exp.achievements).join(' ');
      const matches = allAchievements.match(numberPattern) || [];
      const score = Math.min(100, (matches.length / 5) * 100);
      
      return {
        passed: matches.length >= 3,
        score,
        feedback: matches.length >= 3 
          ? `Found ${matches.length} quantifiable results` 
          : 'Add numbers and metrics to achievements (%, $, counts)',
      };
    },
  },
];

export interface ATSAnalysis {
  overallScore: number;
  rules: Array<{
    id: string;
    name: string;
    passed: boolean;
    score: number;
    feedback: string;
    weight: number;
  }>;
  suggestions: string[];
}

export function analyzeResume(resume: Resume): ATSAnalysis {
  const results = atsRules.map(rule => {
    const result = rule.check(resume);
    return {
      id: rule.id,
      name: rule.name,
      passed: result.passed,
      score: result.score,
      feedback: result.feedback,
      weight: rule.weight,
    };
  });
  
  const totalWeight = atsRules.reduce((sum, rule) => sum + rule.weight, 0);
  const weightedScore = results.reduce((sum, result) => {
    return sum + (result.score * result.weight);
  }, 0);
  
  const overallScore = Math.round(weightedScore / totalWeight);
  
  const suggestions = results
    .filter(r => !r.passed)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(r => r.feedback);
  
  return {
    overallScore,
    rules: results,
    suggestions,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-score-excellent';
  if (score >= 60) return 'text-score-good';
  return 'text-score-poor';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}
