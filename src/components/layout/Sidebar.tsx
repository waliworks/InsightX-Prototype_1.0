
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Users, 
  MapPin, 
  Calendar, 
  Settings, 
  Upload,
  BarChart // Changed from LineChart3 to BarChart which exists in lucide-react
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = ({ className }: { className?: string }) => {
  // In a real app, we would use the router to determine the active route
  const activePath = '/';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Performance', path: '/performance', icon: <LineChart size={20} /> },
    { name: 'Technicians', path: '/technicians', icon: <Users size={20} /> },
    { name: 'Locations', path: '/locations', icon: <MapPin size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
    { name: 'Import Data', path: '/import', icon: <Upload size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={cn('w-64 h-screen bg-white border-r border-border flex flex-col', className)}>
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-insight">
          <BarChart size={24} />
          <span>Insight X</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={cn(
              'nav-link',
              activePath === item.path && 'active'
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
