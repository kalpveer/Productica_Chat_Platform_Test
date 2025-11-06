import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  variant?: 'typing' | 'skeleton' | 'pulse';
  message?: string;
}

export function LoadingState({ variant = 'typing', message }: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className="flex gap-4 animate-fade-in">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-[70%] space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex gap-4 animate-fade-in">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="bg-card border border-border rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            {message && (
              <span className="text-sm text-muted-foreground ml-2">{message}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default typing variant
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="bg-card border border-border rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          {message && (
            <span className="text-sm text-muted-foreground ml-3">{message}</span>
          )}
        </div>
      </div>
    </div>
  );
}