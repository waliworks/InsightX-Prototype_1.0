
export type JobType = 'plumbing' | 'hvac' | 'electrical' | string;

export interface Job {
  id: string;
  scheduled_start: string;
  scheduled_end: string;
  job_type: JobType;
  job_number: string;
  customer_name: string;
  revenue?: number;
  location_id?: string;
  technician_id?: string;
  locations?: {
    zip_code: string;
    city: string;
    state: string;
  };
  technicians?: {
    name: string;
    email: string;
  };
}

export interface FilterOptions {
  locations: string[];
  jobTypes: JobType[];
  minValue: number;
  maxValue: number;
  dateRange: {
    from: Date;
    to: Date;
  };
}
