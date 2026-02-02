// Role-based keywords for ATS optimization
export const roleKeywords: Record<string, string[]> = {
  'software-engineer': [
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js', 'aws', 
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'ci/cd', 'api', 'rest',
    'graphql', 'sql', 'nosql', 'mongodb', 'postgresql', 'microservices',
    'testing', 'unit testing', 'integration testing', 'cloud', 'devops'
  ],
  'product-manager': [
    'roadmap', 'stakeholder', 'user research', 'agile', 'scrum', 'jira',
    'product strategy', 'user stories', 'kpi', 'metrics', 'a/b testing',
    'market research', 'competitive analysis', 'prioritization', 'mvp',
    'customer feedback', 'data-driven', 'product lifecycle', 'backlog'
  ],
  'data-scientist': [
    'python', 'r', 'machine learning', 'deep learning', 'tensorflow', 'pytorch',
    'sql', 'pandas', 'numpy', 'scikit-learn', 'statistics', 'data visualization',
    'tableau', 'power bi', 'nlp', 'computer vision', 'big data', 'spark', 'aws'
  ],
  'marketing': [
    'seo', 'sem', 'ppc', 'google analytics', 'content marketing', 'social media',
    'email marketing', 'hubspot', 'salesforce', 'campaign management', 'branding',
    'conversion rate', 'roi', 'market research', 'digital marketing', 'copywriting',
    'lead generation', 'marketing automation', 'crm'
  ],
  'designer': [
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux',
    'user research', 'wireframing', 'prototyping', 'design systems', 'typography',
    'responsive design', 'accessibility', 'usability testing', 'user-centered design',
    'interaction design', 'visual design', 'brand identity'
  ],
  'project-manager': [
    'project planning', 'risk management', 'stakeholder management', 'agile', 'scrum',
    'waterfall', 'jira', 'asana', 'gantt chart', 'budget management', 'resource allocation',
    'milestone tracking', 'pmp', 'prince2', 'team leadership', 'cross-functional',
    'scope management', 'timeline', 'deliverables'
  ],
  'sales': [
    'salesforce', 'crm', 'pipeline management', 'lead generation', 'cold calling',
    'negotiation', 'closing', 'quota', 'revenue', 'client relationship', 'b2b', 'b2c',
    'account management', 'prospecting', 'sales strategy', 'upselling', 'cross-selling'
  ],
  'human-resources': [
    'recruitment', 'onboarding', 'employee relations', 'performance management',
    'hris', 'workday', 'benefits administration', 'compliance', 'training and development',
    'talent acquisition', 'succession planning', 'employee engagement', 'labor law',
    'diversity and inclusion', 'compensation', 'payroll'
  ],
  'general': [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'project management', 'time management', 'organization', 'strategic planning',
    'collaboration', 'innovation', 'adaptability', 'attention to detail'
  ]
};

// Strong action verbs categorized by impact type
export const actionVerbs = {
  leadership: [
    'directed', 'led', 'managed', 'supervised', 'coordinated', 'orchestrated',
    'spearheaded', 'oversaw', 'guided', 'mentored', 'championed', 'established'
  ],
  achievement: [
    'achieved', 'accomplished', 'exceeded', 'surpassed', 'attained', 'earned',
    'delivered', 'completed', 'succeeded', 'won', 'secured', 'captured'
  ],
  improvement: [
    'improved', 'enhanced', 'optimized', 'streamlined', 'accelerated', 'increased',
    'reduced', 'decreased', 'minimized', 'eliminated', 'transformed', 'revamped'
  ],
  creation: [
    'created', 'developed', 'designed', 'built', 'launched', 'initiated',
    'pioneered', 'introduced', 'invented', 'formulated', 'established', 'founded'
  ],
  analysis: [
    'analyzed', 'evaluated', 'assessed', 'researched', 'investigated', 'examined',
    'identified', 'diagnosed', 'audited', 'reviewed', 'measured', 'quantified'
  ],
  collaboration: [
    'collaborated', 'partnered', 'negotiated', 'facilitated', 'liaised', 'aligned',
    'unified', 'integrated', 'consolidated', 'bridged', 'connected', 'engaged'
  ]
};

// All action verbs flattened
export const allActionVerbs = Object.values(actionVerbs).flat();

// Weak phrases to avoid
export const weakPhrases = [
  'responsible for',
  'duties included',
  'worked on',
  'helped with',
  'assisted in',
  'was involved in',
  'participated in',
  'tasked with'
];

// Power words that strengthen resume content
export const powerWords = [
  'successfully', 'significantly', 'dramatically', 'consistently', 'effectively',
  'strategically', 'proactively', 'efficiently', 'comprehensively', 'innovatively'
];
