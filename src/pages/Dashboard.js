import React from 'react';
import { Sidebar, Navbar } from '../components/Layout';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Navbar />
        <div className="mt-8 text-center">
          <h1 className="text-4xl font-semibold">Welcome to Your Dashboard</h1>
          <p className="mt-4 text-lg">Here is your dashboard, you can navigate through the sidebar.</p>
        </div>
      </div>
    </div>
  );
}

