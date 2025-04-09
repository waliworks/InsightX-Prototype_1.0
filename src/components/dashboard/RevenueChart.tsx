
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data
const data = [
  { name: 'Week 1', current: 4000, previous: 2400 },
  { name: 'Week 2', current: 3000, previous: 1398 },
  { name: 'Week 3', current: 2000, previous: 9800 },
  { name: 'Week 4', current: 2780, previous: 3908 },
  { name: 'Week 5', current: 1890, previous: 4800 },
];

const RevenueChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                labelStyle={{ color: '#1E293B' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E2E8F0'
                }}
              />
              <Bar dataKey="current" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previous" fill="#93C5FD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
