
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ProgressBar = ({ progress, size = 'md', showLabel = true }: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  // Determine color based on progress
  const getColorClass = () => {
    if (safeProgress < 25) return 'bg-danger';
    if (safeProgress < 50) return 'bg-warning';
    if (safeProgress < 75) return 'bg-info';
    return 'bg-success';
  };
  
  // Determine height based on size
  const getHeightClass = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3.5';
      default: return 'h-2.5';
    }
  };

  return (
    <div className="w-full">
      <div className={cn("w-full bg-gray-200 rounded-full", getHeightClass())}>
        <div
          className={cn("rounded-full transition-all duration-300 ease-in-out", getHeightClass(), getColorClass())}
          style={{ width: `${safeProgress}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {safeProgress}% Complete
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
