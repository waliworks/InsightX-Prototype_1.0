
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { JobType } from '@/types/schedule';
import { cn } from '@/lib/utils';

interface FiltersProps {
  filters: {
    locations: string[];
    jobTypes: JobType[];
    minValue: number;
    maxValue: number;
    dateRange: {
      from: Date;
      to: Date;
    };
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
}

const FiltersPanel = ({ filters, setFilters, onClose }: FiltersProps) => {
  const [valueRange, setValueRange] = useState([filters.minValue, filters.maxValue]);
  
  // Fetch locations and job types for filter options
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('zip_code, city, state');
      
      if (error) throw new Error(error.message);
      return data || [];
    }
  });

  const availableJobTypes: { value: JobType; label: string; color: string }[] = [
    { value: 'plumbing', label: 'Plumbing', color: '#D3E4FD' },
    { value: 'hvac', label: 'HVAC', color: '#ea384c' },
    { value: 'electrical', label: 'Electrical', color: '#FEF7CD' },
  ];

  const handleValueRangeChange = (newValue: number[]) => {
    setValueRange(newValue);
    // Debounced update to prevent too many filter changes while sliding
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        minValue: newValue[0],
        maxValue: newValue[1]
      }));
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleJobTypeToggle = (type: JobType, checked: boolean) => {
    if (checked) {
      setFilters(prev => ({
        ...prev,
        jobTypes: [...prev.jobTypes, type]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        jobTypes: prev.jobTypes.filter(t => t !== type)
      }));
    }
  };

  const handleLocationChange = (value: string) => {
    if (!value) return;
    
    if (!filters.locations.includes(value)) {
      setFilters(prev => ({
        ...prev,
        locations: [...prev.locations, value]
      }));
    }
  };

  const removeLocation = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== location)
    }));
  };

  return (
    <div className="w-64 bg-white p-4 border-r flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <Label className="mb-2 block">Date Range</Label>
          <div className="flex gap-2 flex-col">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <span>{format(filters.dateRange.from, 'PPP')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date) => 
                    date && setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, from: date }
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <span>{format(filters.dateRange.to, 'PPP')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date) => 
                    date && setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, to: date }
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Job Types */}
        <div>
          <Label className="mb-2 block">Job Types</Label>
          <div className="space-y-2">
            {availableJobTypes.map(jobType => (
              <div key={jobType.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`job-type-${jobType.value}`}
                  checked={filters.jobTypes.includes(jobType.value)}
                  onCheckedChange={(checked) => 
                    handleJobTypeToggle(jobType.value, checked as boolean)
                  }
                />
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: jobType.color }}
                  />
                  <label
                    htmlFor={`job-type-${jobType.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {jobType.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Locations */}
        <div>
          <Label className="mb-2 block">Locations</Label>
          <Select onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations?.map((location) => (
                <SelectItem
                  key={location.zip_code}
                  value={location.zip_code}
                >
                  {location.city}, {location.state} ({location.zip_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.locations.map((location) => {
              const locationInfo = locations?.find(loc => loc.zip_code === location);
              return (
                <div
                  key={location}
                  className="bg-muted flex items-center gap-1 text-xs rounded-full px-2 py-1"
                >
                  <span>{locationInfo ? `${locationInfo.city} (${location})` : location}</span>
                  <button
                    onClick={() => removeLocation(location)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Contract Value Range */}
        <div>
          <div className="flex justify-between mb-2">
            <Label>Contract Value</Label>
            <span className="text-xs text-muted-foreground">
              ${valueRange[0]} - ${valueRange[1]}
            </span>
          </div>
          <Slider
            value={valueRange}
            min={0}
            max={10000}
            step={100}
            onValueChange={handleValueRangeChange}
            className="my-6"
          />
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setFilters({
              locations: [],
              jobTypes: [],
              minValue: 0,
              maxValue: 10000,
              dateRange: {
                from: new Date(),
                to: new Date(new Date().setMonth(new Date().getMonth() + 1))
              }
            });
            setValueRange([0, 10000]);
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FiltersPanel;
