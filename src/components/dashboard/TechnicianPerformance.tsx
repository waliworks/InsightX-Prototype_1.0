
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data
const data = [
  { name: 'Mike', jobsCompleted: 32, revenue: 15400, satisfaction: 4.9 },
  { name: 'Sarah', jobsCompleted: 27, revenue: 12300, satisfaction: 4.8 },
  { name: 'John', jobsCompleted: 29, revenue: 14500, satisfaction: 4.7 },
  { name: 'Lisa', jobsCompleted: 24, revenue: 10800, satisfaction: 4.5 },
  { name: 'Dave', jobsCompleted: 19, revenue: 8900, satisfaction: 4.2 },
];

const TechnicianPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Technician Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 50,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                scale="band" 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'revenue') return [`$${value}`, 'Revenue'];
                  if (name === 'satisfaction') return [`${value}/5`, 'Rating'];
                  return [value, 'Jobs Completed'];
                }}
                labelStyle={{ color: '#1E293B' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Bar 
                dataKey="jobsCompleted" 
                fill="#2563EB" 
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                <LabelList dataKey="jobsCompleted" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianPerformance;
