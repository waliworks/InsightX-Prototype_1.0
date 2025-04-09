
import React from 'react';
import { CircleUp, CircleDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive: boolean;
    text?: string;
  };
  tooltip?: string;
  className?: string;
  icon?: React.ReactNode;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  tooltip,
  className,
  icon
}: StatCardProps) => {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          {title}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={15} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </h3>
        {icon}
      </div>
      
      <div className="flex items-end justify-between mt-1">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {change.isPositive ? (
                <CircleUp size={16} className="text-green-600" />
              ) : (
                <CircleDown size={16} className="text-red-500" />
              )}
              <span className={change.isPositive ? 'trend-up' : 'trend-down'}>
                {change.value} {change.text || ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
