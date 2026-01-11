import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import type { Education } from '@/types/resume';
import { cn } from '@/lib/utils';

export function EducationStep() {
  const { currentResume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!currentResume) return null;

  const { education } = currentResume;

  const handleAddEducation = () => {
    const newEdu: Omit<Education, 'id'> = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: [],
    };
    addEducation(newEdu);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Education</h2>
        <p className="text-muted-foreground">
          Add your educational background.
        </p>
      </div>

      <div className="space-y-4">
        {education.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="h-10 w-10 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-sm mb-4">No education added yet</p>
              <Button variant="outline" onClick={handleAddEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {education.map((edu) => (
              <Card key={edu.id} className="overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {edu.degree || 'New Degree'} {edu.field && `in ${edu.field}`}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {edu.institution || 'Institution Name'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(edu.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                  {expandedId === edu.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className={cn(
                  "border-t border-border overflow-hidden transition-all duration-200",
                  expandedId === edu.id ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        placeholder="Stanford University"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Degree *</Label>
                        <Input
                          placeholder="Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          placeholder="Computer Science"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          placeholder="Sep 2016"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          placeholder="May 2020"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (optional)</Label>
                        <Input
                          placeholder="3.8"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={handleAddEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Education
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
