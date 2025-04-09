
import React from 'react';
import { format, parseISO, isToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import JobCard from '@/components/schedule/JobCard';
import { getJobColor } from '@/utils/schedule';

interface CalendarViewProps {
  view: 'week' | 'month';
  jobs: any[];
  isLoading: boolean;
  filters: any;
}

const CalendarView = ({ view, jobs, isLoading, filters }: CalendarViewProps) => {
  const today = new Date();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-7 gap-2 h-full">
        {Array.from({ length: view === 'week' ? 7 : 35 }).map((_, index) => (
          <div 
            key={index} 
            className="border rounded-md p-2 h-32"
          >
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    return (
      <div className="grid grid-cols-7 gap-1 h-full">
        {days.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayJobs = jobs.filter(job => {
            const jobDay = job.scheduled_start ? format(parseISO(job.scheduled_start), 'yyyy-MM-dd') : null;
            return jobDay === dayStr;
          });

          return (
            <div 
              key={dayStr} 
              className={`flex flex-col border rounded-md overflow-hidden h-[calc(100vh-200px)] ${
                isToday(day) ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className={`p-2 text-sm font-medium sticky top-0 z-10 ${
                isToday(day) ? 'bg-blue-100' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-center">
                  <span>{format(day, 'EEE')}</span>
                  <span className={`text-xs font-semibold ${
                    isToday(day) ? 'bg-blue-500 text-white rounded-full px-2 py-0.5' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-1 overflow-y-auto space-y-1">
                {dayJobs.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs mt-2">
                    No appointments
                  </div>
                ) : (
                  dayJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    // Get first day of current month and create array for weeks
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDay = startOfWeek(firstDay, { weekStartsOn: 1 });
    
    // Create array of 42 days (6 weeks) starting from startDay
    const days = Array.from({ length: 42 }).map((_, i) => addDays(startDay, i));
    
    // Group days by week
    const weeks = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(days.slice(i * 7, (i + 1) * 7));
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-7 gap-1 text-center py-2 bg-gray-50 rounded-t-md">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isCurrentMonth = day.getMonth() === today.getMonth();
                const dayJobs = jobs.filter(job => {
                  const jobDay = job.scheduled_start ? format(parseISO(job.scheduled_start), 'yyyy-MM-dd') : null;
                  return jobDay === dayStr;
                });

                return (
                  <div 
                    key={dayStr} 
                    className={`border rounded-md p-1 min-h-[100px] ${
                      !isCurrentMonth ? 'bg-gray-50 opacity-70' : ''
                    } ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className={`text-right mb-1 ${
                      isToday(day) ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto' : 
                      !isCurrentMonth ? 'text-gray-400' : ''
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="overflow-y-auto max-h-[80px] space-y-1">
                      {dayJobs.slice(0, 3).map((job) => (
                        <JobCard key={job.id} job={job} compact={true} />
                      ))}
                      {dayJobs.length > 3 && (
                        <div className="text-xs text-center bg-gray-100 rounded py-0.5">
                          +{dayJobs.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return view === 'week' ? renderWeekView() : renderMonthView();
};

export default CalendarView;
