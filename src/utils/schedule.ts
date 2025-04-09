
import { JobType } from '@/types/schedule';

export const getJobColor = (jobType?: JobType): string => {
  if (!jobType) return '#f5f5f5'; // Default light gray
  
  const jobColors: Record<string, string> = {
    'plumbing': '#D3E4FD', // Soft blue
    'hvac': '#ea384c',     // Red
    'electrical': '#FEF7CD', // Soft yellow
    // Add more job types as needed
  };
  
  return jobColors[jobType.toLowerCase()] || '#f5f5f5';
};
