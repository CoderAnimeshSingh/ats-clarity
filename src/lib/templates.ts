import type { Template } from '@/types/resume';

export const templates: Template[] = [
  // Modern Templates
  { id: 'modern-1', name: 'Modern Clean', category: 'modern', isPro: false, preview: '/templates/modern-1.png' },
  { id: 'modern-2', name: 'Modern Professional', category: 'modern', isPro: false, preview: '/templates/modern-2.png' },
  { id: 'modern-3', name: 'Modern Minimal', category: 'modern', isPro: true, preview: '/templates/modern-3.png' },
  { id: 'modern-4', name: 'Modern Bold', category: 'modern', isPro: true, preview: '/templates/modern-4.png' },
  
  // Classic Templates
  { id: 'classic-1', name: 'Classic Traditional', category: 'classic', isPro: false, preview: '/templates/classic-1.png' },
  { id: 'classic-2', name: 'Classic Executive', category: 'classic', isPro: true, preview: '/templates/classic-2.png' },
  { id: 'classic-3', name: 'Classic Elegant', category: 'classic', isPro: true, preview: '/templates/classic-3.png' },
  
  // Minimal Templates
  { id: 'minimal-1', name: 'Minimal Simple', category: 'minimal', isPro: false, preview: '/templates/minimal-1.png' },
  { id: 'minimal-2', name: 'Minimal Sleek', category: 'minimal', isPro: true, preview: '/templates/minimal-2.png' },
  { id: 'minimal-3', name: 'Minimal Swiss', category: 'minimal', isPro: true, preview: '/templates/minimal-3.png' },
  
  // Professional Templates
  { id: 'professional-1', name: 'Professional Corporate', category: 'professional', industry: 'Business', isPro: false, preview: '/templates/professional-1.png' },
  { id: 'professional-2', name: 'Professional Tech', category: 'professional', industry: 'Technology', isPro: true, preview: '/templates/professional-2.png' },
  { id: 'professional-3', name: 'Professional Finance', category: 'professional', industry: 'Finance', isPro: true, preview: '/templates/professional-3.png' },
  { id: 'professional-4', name: 'Professional Healthcare', category: 'professional', industry: 'Healthcare', isPro: true, preview: '/templates/professional-4.png' },
  
  // Experience Level Templates
  { id: 'entry-1', name: 'Entry Level Fresh', category: 'modern', experienceLevel: 'entry', isPro: false, preview: '/templates/entry-1.png' },
  { id: 'senior-1', name: 'Senior Executive', category: 'professional', experienceLevel: 'senior', isPro: true, preview: '/templates/senior-1.png' },
  { id: 'executive-1', name: 'C-Suite Executive', category: 'professional', experienceLevel: 'executive', isPro: true, preview: '/templates/executive-1.png' },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter(t => t.category === category);
}

export function getFreeTemplates(): Template[] {
  return templates.filter(t => !t.isPro);
}

export function getProTemplates(): Template[] {
  return templates.filter(t => t.isPro);
}
