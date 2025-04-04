
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, BarChart, Calendar, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Objectives', icon: Target, path: '/objectives' },
    { name: 'Key Results', icon: BarChart, path: '/key-results' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Team', icon: Users, path: '/team' },
  ];

  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground h-full fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex items-center justify-between px-4 py-6">
        {isOpen ? (
          <h1 className="text-xl font-bold text-white">Goal Compass</h1>
        ) : (
          <h1 className="text-xl font-bold text-white mx-auto">GC</h1>
        )}
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => cn(
                  'flex items-center px-4 py-3 rounded-md transition-colors',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            'flex items-center px-4 py-3 rounded-md transition-colors',
            isActive 
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span className="ml-3">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
