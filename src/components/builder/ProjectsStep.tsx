import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, FolderKanban, X } from 'lucide-react';
import type { Project } from '@/types/resume';
import { cn } from '@/lib/utils';

export function ProjectsStep() {
  const { currentResume, addProject, updateProject, removeProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newTech, setNewTech] = useState<{ [key: string]: string }>({});

  if (!currentResume) return null;

  const { projects } = currentResume;

  const handleAddProject = () => {
    const newProj: Omit<Project, 'id'> = {
      name: '',
      description: '',
      technologies: [],
      link: '',
    };
    addProject(newProj);
  };

  const handleAddTechnology = (projId: string) => {
    const tech = newTech[projId]?.trim();
    if (tech) {
      const proj = projects.find((p) => p.id === projId);
      if (proj && !proj.technologies.includes(tech)) {
        updateProject(projId, {
          technologies: [...proj.technologies, tech],
        });
        setNewTech({ ...newTech, [projId]: '' });
      }
    }
  };

  const handleRemoveTechnology = (projId: string, tech: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      updateProject(projId, {
        technologies: proj.technologies.filter((t) => t !== tech),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Projects</h2>
        <p className="text-muted-foreground">
          Showcase your best projects and side work.
        </p>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="h-10 w-10 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-sm mb-4">No projects added yet</p>
              <Button variant="outline" onClick={handleAddProject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {projects.map((proj) => (
              <Card key={proj.id} className="overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {proj.name || 'New Project'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {proj.technologies.slice(0, 3).join(', ') || 'No technologies added'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(proj.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                  {expandedId === proj.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className={cn(
                  "border-t border-border overflow-hidden transition-all duration-200",
                  expandedId === proj.id ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Project Name *</Label>
                        <Input
                          placeholder="E-commerce Platform"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project Link (optional)</Label>
                        <Input
                          placeholder="https://github.com/username/project"
                          value={proj.link || ''}
                          onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        placeholder="A full-stack e-commerce platform with payment integration and inventory management..."
                        value={proj.description}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        className="resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Technologies Used</Label>
                      {proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {proj.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="gap-1 pr-1"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => handleRemoveTechnology(proj.id, tech)}
                                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Input
                          placeholder="React, Node.js, PostgreSQL..."
                          value={newTech[proj.id] || ''}
                          onChange={(e) => setNewTech({ ...newTech, [proj.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTechnology(proj.id);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddTechnology(proj.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}

            <Button variant="outline" className="w-full" onClick={handleAddProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Another Project
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
