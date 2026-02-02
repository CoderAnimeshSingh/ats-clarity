import type { ATSAnalysis } from '@/lib/atsEngine';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertCircle, CheckCircle2, Target, Lightbulb } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ATSScoreCardProps {
  analysis: ATSAnalysis;
  compact?: boolean;
}

export function ATSScoreCard({ analysis, compact = false }: ATSScoreCardProps) {
  const { overallScore, suggestions, keywordsMatched, keywordsMissing, strengthLevel } = analysis;

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
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
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
              {suggestions.slice(0, 3).map((suggestion, i) => (
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
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      {/* Header with Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h3 className="font-semibold text-sm">ATS Score</h3>
        </div>
        <div className={cn("text-2xl font-bold", getScoreColor(overallScore))}>
          {overallScore}%
        </div>
      </div>

      {/* Score Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getScoreBgColor(overallScore))}
          style={{ width: `${overallScore}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        {overallScore >= 80 ? (
          <CheckCircle2 className="h-4 w-4 text-score-excellent" />
        ) : overallScore >= 60 ? (
          <AlertCircle className="h-4 w-4 text-score-good" />
        ) : (
          <AlertCircle className="h-4 w-4 text-score-poor" />
        )}
        <span className="text-sm font-medium">{getScoreLabel(overallScore)}</span>
        <Badge variant="secondary" className="text-xs">
          {strengthLevel === 'excellent' ? '🔥 ATS Ready' : 
           strengthLevel === 'good' ? '✓ Looking Good' : 
           strengthLevel === 'fair' ? '↗ Almost There' : '📝 Keep Building'}
        </Badge>
      </div>

      {/* Keywords Matched */}
      {keywordsMatched && keywordsMatched.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            Keywords Found ({keywordsMatched.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {keywordsMatched.slice(0, 6).map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-[10px] bg-score-excellent/10 text-score-excellent border-score-excellent/30">
                {keyword}
              </Badge>
            ))}
            {keywordsMatched.length > 6 && (
              <Badge variant="outline" className="text-[10px]">
                +{keywordsMatched.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {keywordsMissing && keywordsMissing.length > 0 && overallScore < 85 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" />
            Consider Adding
          </div>
          <div className="flex flex-wrap gap-1">
            {keywordsMissing.slice(0, 5).map((keyword, i) => (
              <Badge key={i} variant="outline" className="text-[10px] bg-muted">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground">Priority Improvements:</p>
          <ul className="space-y-1.5">
            {suggestions.slice(0, 3).map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-accent mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {overallScore >= 85 && suggestions.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-score-excellent/10 rounded-lg text-sm">
          <CheckCircle2 className="h-4 w-4 text-score-excellent" />
          <span className="text-score-excellent font-medium">Your resume is ATS-optimized!</span>
        </div>
      )}
    </div>
  );
}
