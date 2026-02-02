import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

export function AchievementsStep() {
  const { currentResume, addAchievement, updateAchievement, removeAchievement } = useResumeStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: '',
  });

  if (!currentResume) return null;

  const handleAdd = () => {
    if (newAchievement.title.trim()) {
      addAchievement(newAchievement);
      setNewAchievement({ title: '', description: '', date: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Achievements & Awards</h2>
        <p className="text-muted-foreground">
          Highlight notable achievements, awards, and recognitions that set you apart.
        </p>
      </div>

      {/* Existing Achievements */}
      <div className="space-y-4">
        {currentResume.achievements.map((achievement) => (
          <Card key={achievement.id} className="relative group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-score-excellent/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-score-excellent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`ach-title-${achievement.id}`}>Achievement Title</Label>
                        <Input
                          id={`ach-title-${achievement.id}`}
                          value={achievement.title}
                          onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })}
                          placeholder="Employee of the Year"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ach-date-${achievement.id}`}>Date (Optional)</Label>
                        <Input
                          id={`ach-date-${achievement.id}`}
                          value={achievement.date || ''}
                          onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })}
                          placeholder="2024"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`ach-desc-${achievement.id}`}>Description (Optional)</Label>
                      <Textarea
                        id={`ach-desc-${achievement.id}`}
                        value={achievement.description}
                        onChange={(e) => updateAchievement(achievement.id, { description: e.target.value })}
                        placeholder="Recognized for outstanding performance and leadership..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeAchievement(achievement.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Achievement */}
      {isAdding ? (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="new-ach-title">Achievement Title *</Label>
                <Input
                  id="new-ach-title"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Dean's List, Best Paper Award, etc."
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="new-ach-date">Date (Optional)</Label>
                <Input
                  id="new-ach-date"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                  placeholder="2024"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-ach-desc">Description (Optional)</Label>
              <Textarea
                id="new-ach-desc"
                value={newAchievement.description}
                onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                placeholder="Brief description of the achievement and its significance..."
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} size="sm">
                Add Achievement
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
        <h4 className="font-medium">Types of Achievements to Include:</h4>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li><strong>Academic:</strong> Dean's List, Scholarships, Research Awards</li>
          <li><strong>Professional:</strong> Employee of the Month/Year, Performance Awards</li>
          <li><strong>Industry:</strong> Patents, Publications, Speaking Engagements</li>
          <li><strong>Leadership:</strong> Team Awards, Project Milestones</li>
          <li><strong>Quantifiable Results:</strong> "Increased sales by 40%", "Saved $50K annually"</li>
        </ul>
      </div>
    </div>
  );
}
