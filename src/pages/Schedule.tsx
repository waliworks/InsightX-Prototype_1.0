
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Filter, List, Grid2X2 } from 'lucide-react';
import CalendarView from '@/components/schedule/CalendarView';
import FiltersPanel from '@/components/schedule/FiltersPanel';
import { JobType } from '@/types/schedule';

const Schedule = () => {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    locations: [] as string[],
    jobTypes: [] as JobType[],
    minValue: 0,
    maxValue: 10000,
    dateRange: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 1))
    }
  });

  // Fetch jobs data from Supabase
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase.from('jobs')
        .select(`
          *,
          locations(city, state, zip_code),
          technicians(name, email)
        `)
        .gte('scheduled_start', format(filters.dateRange.from, 'yyyy-MM-dd'))
        .lte('scheduled_end', format(filters.dateRange.to, 'yyyy-MM-dd'));
      
      if (filters.locations.length) {
        query = query.in('locations.zip_code', filters.locations);
      }
      
      if (filters.jobTypes.length) {
        query = query.in('job_type', filters.jobTypes);
      }
      
      if (filters.minValue > 0) {
        query = query.gte('revenue', filters.minValue);
      }
      
      if (filters.maxValue < 10000) {
        query = query.lte('revenue', filters.maxValue);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load schedule data');
      console.error('Error loading jobs:', error);
    }
  }, [error]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border overflow-hidden">
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('week')}
                className="rounded-none border-0"
              >
                <List className="mr-1 h-4 w-4" />
                Week
              </Button>
              <Button
                variant={view === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('month')}
                className="rounded-none border-0"
              >
                <Grid2X2 className="mr-1 h-4 w-4" />
                Month
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="mr-1 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-1">
          {isFilterOpen && (
            <FiltersPanel 
              filters={filters} 
              setFilters={setFilters} 
              onClose={() => setIsFilterOpen(false)} 
            />
          )}
          
          <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
            <CalendarView 
              view={view} 
              jobs={jobs || []}
              isLoading={isLoading}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
