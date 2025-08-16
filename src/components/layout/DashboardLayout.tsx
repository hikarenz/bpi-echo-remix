import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}