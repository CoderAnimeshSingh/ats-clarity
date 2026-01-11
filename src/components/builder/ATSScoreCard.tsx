import type { ATSAnalysis } from '@/lib/atsEngine';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ATSScoreCardProps {
  analysis: ATSAnalysis;
  compact?: boolean;
}

export function ATSScoreCard({ analysis, compact = false }: ATSScoreCardProps) {
  const { overallScore, suggestions } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-score-excellent';
    if (score >= 60) return 'text-score-good';
    return 'text-score-poor';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-score-excellent';
    if (score >= 60) return 'bg-score-good';
    return 'bg-score-poor';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <div className={cn("h-2 w-2 rounded-full", getScoreBgColor(overallScore))} />
            <span className={cn("text-sm font-semibold", getScoreColor(overallScore))}>
              {overallScore}%
            </span>
            <span className="text-xs text-muted-foreground">
              {getScoreLabel(overallScore)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium mb-2">ATS Score: {overallScore}%</p>
          {suggestions.length > 0 ? (
            <ul className="text-xs space-y-1">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-1">
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">Your resume is well optimized!</p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h3 className="font-semibold text-sm">ATS Score</h3>
        </div>
        <div className={cn("text-2xl font-bold", getScoreColor(overallScore))}>
          {overallScore}%
        </div>
      </div>

      {/* Score Bar */}
      <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(overallScore))}
          style={{ width: `${overallScore}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        {overallScore >= 80 ? (
          <CheckCircle2 className="h-4 w-4 text-score-excellent" />
        ) : (
          <AlertCircle className="h-4 w-4 text-score-good" />
        )}
        <span className="text-sm">{getScoreLabel(overallScore)}</span>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Suggestions:</p>
          <ul className="space-y-1.5">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-accent mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
