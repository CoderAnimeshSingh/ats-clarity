import { useResumeStore } from '@/store/resumeStore';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb } from 'lucide-react';

const summaryTips = [
  "Keep it between 2-4 sentences (50-300 characters)",
  "Lead with your years of experience and expertise",
  "Mention your key skills and what makes you unique",
  "Include quantifiable achievements when possible",
  "Tailor it to the specific job you're applying for",
];

export function SummaryStep() {
  const { currentResume, updateSummary } = useResumeStore();

  if (!currentResume) return null;

  const charCount = currentResume.summary.length;
  const isOptimal = charCount >= 50 && charCount <= 300;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold mb-2">Professional Summary</h2>
        <p className="text-muted-foreground">
          Write a compelling summary that highlights your key qualifications.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Summary</Label>
            <span className={`text-xs ${isOptimal ? 'text-score-excellent' : charCount > 300 ? 'text-score-poor' : 'text-muted-foreground'}`}>
              {charCount}/300 characters
            </span>
          </div>
          <Textarea
            id="summary"
            placeholder="Experienced software engineer with 5+ years of expertise in building scalable web applications. Proven track record of delivering high-impact projects that increased revenue by 40%. Passionate about clean code and user-centric design."
            value={currentResume.summary}
            onChange={(e) => updateSummary(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </div>

        <div className="rounded-xl bg-accent/5 border border-accent/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm">Pro Tips</span>
          </div>
          <ul className="space-y-2">
            {summaryTips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
