
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { OkrProvider } from '@/contexts/OkrContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <OkrProvider>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </OkrProvider>
  );
};

export default MainLayout;
