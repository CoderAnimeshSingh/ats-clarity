import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Lightbulb } from 'lucide-react';

const suggestedSkills = {
  Technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'],
  'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management'],
  Tools: ['VS Code', 'Jira', 'Figma', 'Slack', 'GitHub', 'Notion'],
};

export function SkillsStep() {
  const { currentResume, updateSkills } = useResumeStore();
  const [newSkill, setNewSkill] = useState('');

  if (!currentResume) return null;

  const { skills } = currentResume;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      updateSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    updateSkills(skills.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSuggestedSkillClick = (skill: string) => {
    if (!skills.includes(skill)) {
      updateSkills([...skills, skill]);
    }
  };

  const isOptimalCount = skills.length >= 5 && skills.length <= 15;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Skills</h2>
        <p className="text-muted-foreground">
          Add your relevant skills. Aim for 5-15 skills for optimal ATS performance.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Your Skills</Label>
            <span className={`text-xs ${isOptimalCount ? 'text-score-excellent' : skills.length < 5 ? 'text-muted-foreground' : 'text-score-good'}`}>
              {skills.length} skills {isOptimalCount && '✓'}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button type="button" onClick={handleAddSkill} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="gap-1 pr-1 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="rounded-xl bg-surface-2 border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm">Suggested Skills</span>
          </div>
          
          {Object.entries(suggestedSkills).map(([category, categorySkills]) => (
            <div key={category} className="mb-4 last:mb-0">
              <p className="text-xs text-muted-foreground mb-2">{category}</p>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSuggestedSkillClick(skill)}
                    disabled={skills.includes(skill)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      skills.includes(skill)
                        ? 'bg-accent/10 border-accent/30 text-accent cursor-default'
                        : 'border-border hover:border-accent hover:bg-accent/5 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {skills.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
