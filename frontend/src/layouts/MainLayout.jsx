import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] flex">
      {/* 250px Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[250px] flex flex-col min-h-screen transition-all duration-300">
        <div className="flex-1 max-w-7xl w-full mx-auto pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
