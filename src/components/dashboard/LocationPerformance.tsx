
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Dummy data
const data = [
  { 
    zipCode: '90210', 
    area: 'Beverly Hills', 
    jobCount: 48, 
    revenue: 24500, 
    avgTicket: 510, 
    trend: 'up' 
  },
  { 
    zipCode: '90402', 
    area: 'Santa Monica', 
    jobCount: 31, 
    revenue: 15800, 
    avgTicket: 510, 
    trend: 'up' 
  },
  { 
    zipCode: '91604', 
    area: 'Studio City', 
    jobCount: 29, 
    revenue: 12900, 
    avgTicket: 445, 
    trend: 'down' 
  },
  { 
    zipCode: '91436', 
    area: 'Encino', 
    jobCount: 27, 
    revenue: 13200, 
    avgTicket: 489, 
    trend: 'up' 
  },
  { 
    zipCode: '90077', 
    area: 'Bel Air', 
    jobCount: 21, 
    revenue: 18400, 
    avgTicket: 876, 
    trend: 'down' 
  },
];

const LocationPerformance = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Top Performing Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zip Code</TableHead>
              <TableHead>Area</TableHead>
              <TableHead className="text-right">Jobs</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Avg. Ticket</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((location) => (
              <TableRow key={location.zipCode}>
                <TableCell className="font-medium">{location.zipCode}</TableCell>
                <TableCell>{location.area}</TableCell>
                <TableCell className="text-right">{location.jobCount}</TableCell>
                <TableCell className="text-right">${location.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right">${location.avgTicket}</TableCell>
                <TableCell className="text-right">
                  {location.trend === 'up' ? (
                    <span className="inline-flex items-center text-green-600">
                      <ArrowUpRight size={16} className="mr-1" />
                      12%
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-500">
                      <ArrowDownRight size={16} className="mr-1" />
                      8%
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LocationPerformance;
