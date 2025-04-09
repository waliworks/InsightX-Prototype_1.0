
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
};

interface TechnicianModalProps {
  isOpen: boolean;
  onClose: (shouldRefetch: boolean) => void;
  technician: Technician | null;
  mode: 'create' | 'edit';
}

const TechnicianModal = ({ isOpen, onClose, technician, mode }: TechnicianModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Technician>>({
    name: '',
    email: '',
    phone: '',
    specialization: 'Plumbing',
    hourly_rate: 60,
    status: 'active',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (technician && mode === 'edit') {
      setFormData({
        name: technician.name,
        email: technician.email,
        phone: technician.phone || '',
        specialization: technician.specialization,
        hourly_rate: technician.hourly_rate,
        status: technician.status,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: 'Plumbing',
        hourly_rate: 60,
        status: 'active',
      });
    }
  }, [technician, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourly_rate' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.specialization || !formData.hourly_rate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (mode === 'create') {
        const { data, error } = await supabase
          .from('technicians')
          .insert(formData)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Technician Created",
          description: `${formData.name} has been added successfully.`,
        });
      } else if (mode === 'edit' && technician) {
        const { data, error } = await supabase
          .from('technicians')
          .update(formData)
          .eq('id', technician.id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Technician Updated",
          description: `${formData.name}'s information has been updated.`,
        });
      }
      
      onClose(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Technician' : 'Edit Technician'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Fill in the details to add a new technician to your team.'
              : 'Update the technician\'s information.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="555-123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) => handleSelectChange('specialization', value)}
              >
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="General Handyman">General Handyman</SelectItem>
                  <SelectItem value="Carpentry">Carpentry</SelectItem>
                  <SelectItem value="Painting">Painting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate ($) *</Label>
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : mode === 'create' ? 'Add Technician' : 'Update Technician'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianModal;
