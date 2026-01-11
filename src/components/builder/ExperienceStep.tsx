import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import type { Experience } from '@/types/resume';
import { cn } from '@/lib/utils';

export function ExperienceStep() {
  const { currentResume, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newAchievement, setNewAchievement] = useState<{ [key: string]: string }>({});

  if (!currentResume) return null;

  const { experience } = currentResume;

  const handleAddExperience = () => {
    const newExp: Omit<Experience, 'id'> = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    addExperience(newExp);
  };

  const handleAddAchievement = (expId: string) => {
    const achievement = newAchievement[expId]?.trim();
    if (achievement) {
      const exp = experience.find((e) => e.id === expId);
      if (exp) {
        updateExperience(expId, {
          achievements: [...exp.achievements, achievement],
        });
        setNewAchievement({ ...newAchievement, [expId]: '' });
      }
    }
  };

  const handleRemoveAchievement = (expId: string, index: number) => {
    const exp = experience.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, {
        achievements: exp.achievements.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Work Experience</h2>
        <p className="text-muted-foreground">
          Add your relevant work experience. Include achievements with numbers.
        </p>
      </div>

      <div className="space-y-4">
        {experience.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-10 w-10 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-sm mb-4">No experience added yet</p>
              <Button variant="outline" onClick={handleAddExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {experience.map((exp, index) => (
              <Card key={exp.id} className="overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {exp.position || 'New Position'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {exp.company || 'Company Name'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(exp.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                  {expandedId === exp.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className={cn(
                  "border-t border-border overflow-hidden transition-all duration-200",
                  expandedId === exp.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Position *</Label>
                        <Input
                          placeholder="Software Engineer"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company *</Label>
                        <Input
                          placeholder="Google"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="San Francisco, CA"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          placeholder="Jan 2020"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          placeholder="Present"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) => 
                          updateExperience(exp.id, { 
                            current: !!checked,
                            endDate: checked ? 'Present' : ''
                          })
                        }
                      />
                      <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                        I currently work here
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Brief description of your role and responsibilities..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        className="resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Achievements (use numbers for impact!)</Label>
                      <div className="space-y-2">
                        {exp.achievements.map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-center gap-2 group">
                            <span className="text-muted-foreground">•</span>
                            <span className="flex-1 text-sm">{achievement}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={() => handleRemoveAchievement(exp.id, achIndex)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Increased sales by 40% through..."
                            value={newAchievement[exp.id] || ''}
                            onChange={(e) => setNewAchievement({ ...newAchievement, [exp.id]: e.target.value })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddAchievement(exp.id);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleAddAchievement(exp.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={handleAddExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Experience
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
