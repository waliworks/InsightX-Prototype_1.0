
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import LocationPerformance from '@/components/dashboard/LocationPerformance';
import { Button } from '@/components/ui/button';
import { MapPin, Building, TrendingUp, FileSpreadsheet } from 'lucide-react';
import InsightCard from '@/components/dashboard/InsightCard';
import ZipCodeMap from '@/components/locations/ZipCodeMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define Location type based on the database schema
type Location = {
  id: string;
  zip_code: string;
  city: string;
  state: string;
  area_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Type for location performance metrics
type LocationMetrics = {
  zip_code: string;
  area_name: string | null;
  city: string;
  job_count: number;
  total_revenue: number;
  avg_ticket: number;
  customer_count: number;
};

const LocationsPage = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch locations
  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('city');
      
      if (error) throw new Error(error.message);
      return data as Location[];
    },
  });

  // Fetch location metrics
  const { data: locationMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['locationMetrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          locations!inner(zip_code, city, area_name),
          revenue
        `)
        .not('revenue', 'is', null);

      if (error) throw new Error(error.message);
      
      // Process the data to calculate metrics
      const metricsByZip: Record<string, LocationMetrics> = {};
      
      data.forEach(job => {
        const zipCode = job.locations.zip_code;
        
        if (!metricsByZip[zipCode]) {
          metricsByZip[zipCode] = {
            zip_code: zipCode,
            area_name: job.locations.area_name,
            city: job.locations.city,
            job_count: 0,
            total_revenue: 0,
            avg_ticket: 0,
            customer_count: 0
          };
        }
        
        metricsByZip[zipCode].job_count++;
        metricsByZip[zipCode].total_revenue += job.revenue;
      });
      
      // Calculate average ticket
      Object.values(metricsByZip).forEach(metric => {
        metric.avg_ticket = metric.total_revenue / metric.job_count;
        // For simple demo, assume 1 customer per 1.5 jobs
        metric.customer_count = Math.round(metric.job_count / 1.5);
      });
      
      return Object.values(metricsByZip).sort((a, b) => b.total_revenue - a.total_revenue);
    },
  });

  // Generate AI insights based on data
  const generateInsights = () => {
    if (!locationMetrics || locationMetrics.length === 0) return [];
    
    // Sort locations by different metrics
    const byRevenue = [...locationMetrics].sort((a, b) => b.total_revenue - a.total_revenue);
    const byTicket = [...locationMetrics].sort((a, b) => b.avg_ticket - a.avg_ticket);
    const byJobCount = [...locationMetrics].sort((a, b) => b.job_count - a.job_count);
    
    return [
      {
        title: 'Highest Revenue Area',
        insight: `${byRevenue[0].area_name || byRevenue[0].city} (${byRevenue[0].zip_code}) generates the most revenue at $${byRevenue[0].total_revenue.toLocaleString()}, which is ${Math.round((byRevenue[0].total_revenue / byRevenue[1].total_revenue - 1) * 100)}% higher than the second highest area.`,
        priority: 'high' as const
      },
      {
        title: 'Highest Average Ticket',
        insight: `Jobs in ${byTicket[0].area_name || byTicket[0].city} have the highest average ticket at $${byTicket[0].avg_ticket.toFixed(0)}, suggesting premium services or affluent customers in this area.`,
        priority: 'medium' as const
      },
      {
        title: 'Market Expansion Opportunity',
        insight: `${byJobCount[byJobCount.length-1].area_name || byJobCount[byJobCount.length-1].city} has the lowest job count but decent average ticket. Consider targeted marketing to increase presence in this area.`,
        priority: 'medium' as const
      }
    ];
  };

  const insights = generateInsights();
  const isLoading = locationsLoading || metricsLoading;

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Locations</h1>
                <p className="text-muted-foreground">Manage service areas and analyze performance by location</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <MapPin size={16} />
                  Add Location
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet size={16} />
                  Export Data
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Service Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoading ? <Skeleton className="h-8 w-16" /> : locations?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Across {isLoading ? '...' : new Set(locations?.map(l => l.city)).size} cities</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Top Performing ZIP</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoading ? 
                          <Skeleton className="h-8 w-16" /> : 
                          locationMetrics && locationMetrics.length > 0 ? locationMetrics[0].zip_code : 'N/A'
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isLoading ? 
                          <Skeleton className="h-4 w-24" /> : 
                          locationMetrics && locationMetrics.length > 0 ? 
                          `$${locationMetrics[0].total_revenue.toLocaleString()} revenue` : 'No data'
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Revenue per Area</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoading ? 
                          <Skeleton className="h-8 w-16" /> : 
                          locationMetrics && locationMetrics.length > 0 ? 
                          `$${(locationMetrics.reduce((sum, loc) => sum + loc.total_revenue, 0) / locationMetrics.length).toFixed(0)}` : 'N/A'
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Per service area</p>
                    </CardContent>
                  </Card>
                </div>
                
                <LocationPerformance />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">All Service Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ZIP Code</TableHead>
                            <TableHead>Area</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {locations && locations.length > 0 ? (
                            locations.map((location) => (
                              <TableRow key={location.id}>
                                <TableCell className="font-medium">{location.zip_code}</TableCell>
                                <TableCell>{location.area_name || location.city}</TableCell>
                                <TableCell>{location.city}</TableCell>
                                <TableCell>{location.state}</TableCell>
                                <TableCell>
                                  <Badge variant={location.is_active ? "default" : "outline"}>
                                    {location.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                No locations found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Areas Map</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ZipCodeMap locations={locations || []} metrics={locationMetrics || []} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))
                  ) : insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <InsightCard
                        key={index}
                        title={insight.title}
                        insight={insight.insight}
                        priority={insight.priority}
                        className="p-4 border rounded-lg"
                      />
                    ))
                  ) : (
                    <p>No insights available</p>
                  )}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h3 className="font-medium mb-1">Targeted Marketing Strategy</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on your location data, we recommend focusing more resources on Beverly Hills and Bel Air where your average tickets are highest. Consider special promotions in Studio City to improve job volume.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h3 className="font-medium mb-1">Service Mix Optimization</h3>
                      <p className="text-sm text-muted-foreground">
                        In higher-income areas like Beverly Hills, promote premium services that have higher margins. For more price-sensitive areas, consider bundled service packages to increase job size.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LocationsPage;
