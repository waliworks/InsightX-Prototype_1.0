
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Star, Award, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TechnicianModal from '@/components/technicians/TechnicianModal';
import { useIsMobile } from '@/hooks/use-mobile';

// Define Technician type
type Technician = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hourly_rate: number;
  hire_date: string;
  status: string;
  rating: number;
  created_at: string;
  updated_at: string;
};

const TechniciansPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTechnician, setCurrentTechnician] = useState<Technician | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const fetchTechnicians = async () => {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching technicians:', error);
      throw new Error(error.message);
    }
    
    return data as Technician[];
  };

  const { data: technicians, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians,
  });

  const handleAddNew = () => {
    setCurrentTechnician(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (technician: Technician) => {
    setCurrentTechnician(technician);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('technicians')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Technician deleted",
        description: "The technician has been removed successfully.",
      });
      
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleModalClose = (shouldRefetch: boolean) => {
    setIsModalOpen(false);
    if (shouldRefetch) {
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on leave':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isError) {
    return (
      <div className="flex h-screen bg-background">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Technicians</h1>
              <Card>
                <CardContent className="p-6">
                  <div className="text-red-500">
                    Error loading technicians: {(error as Error)?.message || 'An unknown error occurred'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Technicians</h1>
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus size={16} />
                Add Technician
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technician Management</CardTitle>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Rate</TableHead>
                        <TableHead className="hidden md:table-cell">Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {technicians && technicians.length > 0 ? (
                        technicians.map((technician) => (
                          <TableRow key={technician.id}>
                            <TableCell className="font-medium">{technician.name}</TableCell>
                            <TableCell>{technician.specialization}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="text-sm">
                                <div>{technician.email}</div>
                                <div className="text-muted-foreground">{technician.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center">
                                <DollarSign size={16} className="mr-1 text-muted-foreground" />
                                ${technician.hourly_rate}/hr
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center">
                                <Star size={16} className="mr-1 text-amber-500" />
                                {technician.rating}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(technician.status)}>
                                {technician.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEdit(technician)}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDelete(technician.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No technicians found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <TechnicianModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        technician={currentTechnician}
        mode={modalMode} 
      />
    </div>
  );
};

export default TechniciansPage;
