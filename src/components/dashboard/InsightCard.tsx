
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  insight: string;
  priority?: 'low' | 'medium' | 'high'; 
  className?: string;
}

const InsightCard = ({ 
  title, 
  insight,
  priority = 'medium',
  className 
}: InsightCardProps) => {
  const priorityClasses = {
    low: 'before:bg-blue-400',
    medium: 'before:bg-insight',
    high: 'before:bg-red-500',
  };
  
  return (
    <div className={cn('insight-card', priorityClasses[priority], className)}>
      <div className="flex items-start">
        <div className="bg-insight-light rounded-full p-2 mr-3">
          <Lightbulb className="text-insight" size={18} />
        </div>
        <div>
          <h3 className="font-medium text-sm text-gray-600">{title}</h3>
          <p className="mt-1 text-base">{insight}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
