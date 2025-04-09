
import React from 'react';
import { Card } from '@/components/ui/card';

interface Location {
  id: string;
  zip_code: string;
  city: string;
  state: string;
  area_name: string | null;
  is_active: boolean;
}

interface LocationMetrics {
  zip_code: string;
  area_name: string | null;
  city: string;
  job_count: number;
  total_revenue: number;
  avg_ticket: number;
  customer_count: number;
}

interface MapProps {
  locations: Location[];
  metrics: LocationMetrics[];
}

const ZipCodeMap = ({ locations, metrics }: MapProps) => {
  // For now, we'll display a placeholder since integrating a real map would require API keys
  // In a production app, this would use Google Maps, Mapbox, or similar service
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center bg-muted/30 border border-dashed border-muted-foreground/25 rounded-lg w-full h-[400px] mb-4">
        <div className="text-center p-6">
          <h3 className="text-lg font-semibold mb-2">Service Areas Map</h3>
          <p className="text-muted-foreground mb-4">
            A map showing your service areas would appear here, with heat maps indicating job density and revenue.
          </p>
          <p className="text-sm text-muted-foreground">
            This requires integration with a mapping API like Google Maps or Mapbox.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-4">
        {locations.slice(0, 6).map((location) => {
          const metric = metrics.find(m => m.zip_code === location.zip_code);
          return (
            <Card key={location.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{location.zip_code}</h3>
                  <p className="text-sm text-muted-foreground">
                    {location.area_name || location.city}, {location.state}
                  </p>
                </div>
                {metric ? (
                  <div className="text-right">
                    <span className="text-sm font-medium">${metric.total_revenue.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">{metric.job_count} jobs</p>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No data</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ZipCodeMap;
