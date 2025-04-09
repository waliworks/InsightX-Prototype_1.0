
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data
const data = [
  { name: 'Plumbing', value: 35 },
  { name: 'HVAC', value: 25 },
  { name: 'Electrical', value: 20 },
  { name: 'Handyman', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

const JobsPerformanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Jobs by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
              />
              <Pie
                data={data}
                cx="40%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobsPerformanceChart;
