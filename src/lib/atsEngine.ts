import type { Resume } from '@/types/resume';
import { allActionVerbs, weakPhrases, roleKeywords } from '@/data/keywords';

interface ATSRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  check: (resume: Resume, targetRole?: string) => { passed: boolean; score: number; feedback: string };
}

const atsRules: ATSRule[] = [
  {
    id: 'contact-info',
    name: 'Contact Information',
    description: 'Check if all contact information is provided',
    weight: 12,
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
    id: 'professional-title',
    name: 'Professional Title',
    description: 'Check if a professional title is provided',
    weight: 8,
    check: (resume) => {
      const hasTitle = Boolean(resume.personalInfo.title && resume.personalInfo.title.length >= 3);
      return {
        passed: hasTitle,
        score: hasTitle ? 100 : 0,
        feedback: hasTitle 
          ? 'Professional title included' 
          : 'Add a professional title (e.g., "Software Engineer", "Marketing Manager")',
      };
    },
  },
  {
    id: 'summary',
    name: 'Professional Summary',
    description: 'Check if summary is between 100-400 characters and contains impact',
    weight: 10,
    check: (resume) => {
      const length = resume.summary.length;
      const hasGoodLength = length >= 100 && length <= 400;
      const hasNumbers = /\d+/.test(resume.summary);
      
      let score = 0;
      if (length === 0) {
        score = 0;
      } else if (hasGoodLength && hasNumbers) {
        score = 100;
      } else if (hasGoodLength) {
        score = 80;
      } else if (length > 0) {
        score = Math.min(60, (length / 100) * 40);
      }
      
      let feedback = '';
      if (length === 0) {
        feedback = 'Add a professional summary highlighting your key strengths';
      } else if (!hasGoodLength && length < 100) {
        feedback = 'Summary is too short - aim for 100-400 characters with quantifiable achievements';
      } else if (!hasGoodLength && length > 400) {
        feedback = 'Summary is too long - keep it concise (100-400 characters)';
      } else if (!hasNumbers) {
        feedback = 'Add quantifiable achievements to your summary (e.g., "5+ years", "led team of 10")';
      } else {
        feedback = 'Summary is well-structured with quantifiable impact';
      }
      
      return { passed: hasGoodLength && hasNumbers, score, feedback };
    },
  },
  {
    id: 'skills',
    name: 'Skills Section',
    description: 'Check if skills section has 6-15 relevant skills',
    weight: 12,
    check: (resume) => {
      const count = resume.skills.length;
      const hasGoodCount = count >= 6 && count <= 15;
      const score = count === 0 ? 0 : hasGoodCount ? 100 : count < 6 ? (count / 6) * 100 : Math.max(60, 100 - ((count - 15) * 3));
      return {
        passed: hasGoodCount,
        score: Math.min(100, Math.max(0, score)),
        feedback: count === 0 
          ? 'Add relevant skills (aim for 6-15)' 
          : hasGoodCount 
            ? `Strong skills section (${count} skills)` 
            : count < 6 
              ? `Add more skills (${count}/6 minimum)` 
              : 'Consider focusing on your most relevant skills (6-15 recommended)',
      };
    },
  },
  {
    id: 'experience',
    name: 'Work Experience',
    description: 'Check work experience entries with achievements',
    weight: 20,
    check: (resume) => {
      const count = resume.experience.length;
      const withAchievements = resume.experience.filter(exp => exp.achievements.length >= 2).length;
      const totalAchievements = resume.experience.reduce((sum, exp) => sum + exp.achievements.length, 0);
      
      if (count === 0) {
        return { passed: false, score: 0, feedback: 'Add work experience with bullet points' };
      }
      
      const hasEnoughEntries = count >= 2;
      const hasGoodAchievements = withAchievements >= count * 0.75;
      const avgAchievements = totalAchievements / count;
      
      let score = 0;
      score += Math.min(40, (count / 2) * 40); // Up to 40 for having 2+ entries
      score += Math.min(40, (withAchievements / count) * 40); // Up to 40 for achievements
      score += Math.min(20, (avgAchievements / 3) * 20); // Up to 20 for avg 3+ per entry
      
      return {
        passed: hasEnoughEntries && hasGoodAchievements,
        score,
        feedback: !hasEnoughEntries 
          ? 'Add more work experience entries (2+ recommended)'
          : !hasGoodAchievements 
            ? 'Add 2-4 achievement bullet points to each experience'
            : 'Work experience is well documented with achievements',
      };
    },
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Check if education is provided with degree info',
    weight: 8,
    check: (resume) => {
      const count = resume.education.length;
      const hasComplete = resume.education.some(edu => edu.institution && edu.degree);
      
      return {
        passed: count > 0 && hasComplete,
        score: count > 0 && hasComplete ? 100 : count > 0 ? 70 : 0,
        feedback: count === 0 
          ? 'Add education details'
          : hasComplete 
            ? 'Education section complete' 
            : 'Add degree/institution details to education',
      };
    },
  },
  {
    id: 'action-verbs',
    name: 'Action Verbs',
    description: 'Check if descriptions use strong action verbs',
    weight: 10,
    check: (resume) => {
      const allText = [
        resume.summary,
        ...resume.experience.flatMap(exp => [exp.description, ...exp.achievements]),
        ...resume.projects.map(p => p.description),
      ].join(' ').toLowerCase();
      
      const foundVerbs = allActionVerbs.filter(verb => allText.includes(verb.toLowerCase()));
      const uniqueVerbs = new Set(foundVerbs);
      const score = Math.min(100, (uniqueVerbs.size / 8) * 100);
      
      return {
        passed: uniqueVerbs.size >= 5,
        score,
        feedback: uniqueVerbs.size >= 5 
          ? `Using ${uniqueVerbs.size} strong action verbs` 
          : `Use more action verbs (${uniqueVerbs.size}/5). Try: led, developed, achieved, improved, created`,
      };
    },
  },
  {
    id: 'weak-phrases',
    name: 'Weak Phrases',
    description: 'Check for weak phrases that should be avoided',
    weight: 8,
    check: (resume) => {
      const allText = [
        resume.summary,
        ...resume.experience.flatMap(exp => [exp.description, ...exp.achievements]),
        ...resume.projects.map(p => p.description),
      ].join(' ').toLowerCase();
      
      const foundWeakPhrases = weakPhrases.filter(phrase => allText.includes(phrase));
      const score = foundWeakPhrases.length === 0 ? 100 : Math.max(0, 100 - (foundWeakPhrases.length * 25));
      
      return {
        passed: foundWeakPhrases.length === 0,
        score,
        feedback: foundWeakPhrases.length === 0 
          ? 'No weak phrases detected' 
          : `Avoid weak phrases: "${foundWeakPhrases[0]}" - use action verbs instead`,
      };
    },
  },
  {
    id: 'quantifiable',
    name: 'Quantifiable Results',
    description: 'Check if achievements include numbers and metrics',
    weight: 12,
    check: (resume) => {
      const numberPattern = /\d+%|\d+\+|\$[\d,]+|\d+x|\d+K|\d+M|\d+ (users|customers|clients|employees|team|projects|revenue)/gi;
      
      const allAchievements = resume.experience.flatMap(exp => exp.achievements).join(' ');
      const allText = allAchievements + ' ' + resume.summary;
      const matches = allText.match(numberPattern) || [];
      const uniqueMetrics = new Set(matches.map(m => m.toLowerCase()));
      
      const score = Math.min(100, (uniqueMetrics.size / 4) * 100);
      
      return {
        passed: uniqueMetrics.size >= 3,
        score,
        feedback: uniqueMetrics.size >= 3 
          ? `Found ${uniqueMetrics.size} quantifiable metrics` 
          : 'Add more metrics: %, $, counts, timeframes (e.g., "increased sales by 40%", "led team of 8")',
      };
    },
  },
  {
    id: 'certifications',
    name: 'Certifications',
    description: 'Check if relevant certifications are included',
    weight: 5,
    check: (resume) => {
      const count = resume.certifications.length;
      return {
        passed: count >= 1,
        score: count >= 1 ? 100 : 50,
        feedback: count >= 1 
          ? `${count} certification(s) listed` 
          : 'Consider adding relevant certifications if you have any',
      };
    },
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Check if projects are included to demonstrate skills',
    weight: 5,
    check: (resume) => {
      const count = resume.projects.length;
      const withTech = resume.projects.filter(p => p.technologies.length > 0).length;
      
      if (count === 0) {
        return { passed: false, score: 50, feedback: 'Add projects to showcase your skills (especially for entry-level)' };
      }
      
      return {
        passed: true,
        score: withTech >= count * 0.5 ? 100 : 80,
        feedback: withTech >= count * 0.5 
          ? `${count} project(s) with technologies listed`
          : 'Add technologies used to your projects',
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
  keywordsMatched: string[];
  keywordsMissing: string[];
  strengthLevel: 'excellent' | 'good' | 'fair' | 'needs-work';
}

export function analyzeResume(resume: Resume, targetRole: string = 'general'): ATSAnalysis {
  const results = atsRules.map(rule => {
    const result = rule.check(resume, targetRole);
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
  
  // Keyword analysis
  const keywords = roleKeywords[targetRole] || roleKeywords['general'];
  const resumeText = [
    resume.summary,
    resume.skills.join(' '),
    ...resume.experience.flatMap(exp => [exp.description, ...exp.achievements, exp.position]),
    ...resume.projects.map(p => p.description + ' ' + p.technologies.join(' ')),
  ].join(' ').toLowerCase();
  
  const keywordsMatched = keywords.filter(kw => resumeText.includes(kw.toLowerCase()));
  const keywordsMissing = keywords.filter(kw => !resumeText.includes(kw.toLowerCase())).slice(0, 5);
  
  // Get top suggestions
  const suggestions = results
    .filter(r => !r.passed)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4)
    .map(r => r.feedback);
  
  // Determine strength level
  let strengthLevel: ATSAnalysis['strengthLevel'];
  if (overallScore >= 85) strengthLevel = 'excellent';
  else if (overallScore >= 70) strengthLevel = 'good';
  else if (overallScore >= 50) strengthLevel = 'fair';
  else strengthLevel = 'needs-work';
  
  return {
    overallScore,
    rules: results,
    suggestions,
    keywordsMatched,
    keywordsMissing,
    strengthLevel,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-score-excellent';
  if (score >= 60) return 'text-score-good';
  return 'text-score-poor';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-score-excellent';
  if (score >= 60) return 'bg-score-good';
  return 'bg-score-poor';
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
}
