
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import InsightCard from '@/components/dashboard/InsightCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import JobsPerformanceChart from '@/components/dashboard/JobsPerformanceChart';
import TechnicianPerformance from '@/components/dashboard/TechnicianPerformance';
import LocationPerformance from '@/components/dashboard/LocationPerformance';
import CsvUploader from '@/components/dashboard/CsvUploader';
import { 
  DollarSign, 
  BarChartHorizontal, 
  Calendar,
  Users,
  ArrowUpRight
} from 'lucide-react';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Total Revenue" 
                value="$78,650" 
                change={{ value: "18%", isPositive: true, text: "vs last month" }}
                icon={<DollarSign size={20} className="text-insight" />}
                tooltip="Total revenue from all completed jobs this month"
              />
              <StatCard 
                title="Completed Jobs" 
                value="156" 
                change={{ value: "12%", isPositive: true, text: "vs last month" }}
                icon={<BarChartHorizontal size={20} className="text-insight-secondary" />}
                tooltip="Number of jobs completed this month"
              />
              <StatCard 
                title="Avg. Ticket Size" 
                value="$504" 
                change={{ value: "5%", isPositive: true, text: "vs last month" }}
                icon={<DollarSign size={20} className="text-green-500" />}
                tooltip="Average revenue per completed job"
              />
              <StatCard 
                title="Cancellations" 
                value="12" 
                change={{ value: "3%", isPositive: false, text: "vs last month" }}
                icon={<Calendar size={20} className="text-red-500" />}
                tooltip="Number of canceled jobs this month"
              />
            </div>
            
            {/* AI Insights Section */}
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <ArrowUpRight className="mr-2 text-insight" />
              AI Insights
            </h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
              <InsightCard 
                title="Revenue Leakage Detected"
                insight="You've had 4 cancellations this week—12% more than last week. Most cancellations are coming from HVAC service calls scheduled more than 5 days in advance."
                priority="high"
              />
              <InsightCard 
                title="Opportunity Alert"
                insight="Water heater jobs generated $8,200 in revenue and 3 of 4 5-star reviews in the Beverly Hills area. Consider upselling maintenance plans to these customers."
                priority="medium"
              />
              <InsightCard 
                title="Scheduling Optimization"
                insight="Tuesday mornings are underbooked by 35% compared to other weekday mornings. Consider running a 10% promo for those time slots."
                priority="medium"
              />
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <RevenueChart />
              <JobsPerformanceChart />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <TechnicianPerformance />
              <LocationPerformance />
            </div>
            
            {/* Data Import Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <CsvUploader />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
