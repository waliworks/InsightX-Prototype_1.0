
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getJobColor } from '@/utils/schedule';

interface JobCardProps {
  job: any;
  compact?: boolean;
}

const JobCard = ({ job, compact = false }: JobCardProps) => {
  const bgColor = getJobColor(job.job_type);
  const startTime = job.scheduled_start ? format(parseISO(job.scheduled_start), 'h:mm a') : 'N/A';
  const formattedRevenue = job.revenue ? `$${job.revenue.toLocaleString()}` : 'N/A';
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="text-xs p-1 rounded cursor-pointer truncate"
              style={{ backgroundColor: bgColor }}
            >
              <div className="font-medium truncate">{job.customer_name}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div><span className="font-medium">Customer:</span> {job.customer_name}</div>
              <div><span className="font-medium">Time:</span> {startTime}</div>
              <div><span className="font-medium">Type:</span> {job.job_type}</div>
              <div><span className="font-medium">Value:</span> {formattedRevenue}</div>
              {job.technicians?.name && (
                <div><span className="font-medium">Technician:</span> {job.technicians.name}</div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div
      className="p-1.5 rounded-md cursor-pointer text-xs"
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-medium mb-0.5 truncate">{job.customer_name}</div>
      <div className="flex justify-between">
        <div className="capitalize">{job.job_type}</div>
        <div>{startTime}</div>
      </div>
      <div className="flex justify-between mt-0.5">
        <div>{job.technicians?.name || 'Unassigned'}</div>
        <div className="font-medium">{formattedRevenue}</div>
      </div>
    </div>
  );
};

export default JobCard;
