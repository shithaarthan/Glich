import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CreateEchoModal from '@/components/modals/CreateEchoModal';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-[280px]">
        <div className="max-w-8xl mx-auto py-8 px-10">
          <Outlet />
        </div>
      </main>
      <CreateEchoModal />
    </div>
  );
};

export default MainLayout;
