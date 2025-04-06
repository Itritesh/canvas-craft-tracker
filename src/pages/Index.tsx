
import React from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { WorkEntryForm } from '@/components/WorkEntryForm';
import { DataTable } from '@/components/DataTable';
import { ChartsSection } from '@/components/ChartsSection';
import { useDashboardData } from '@/hooks/useDashboardData';

const Index = () => {
  const {
    filteredEntries,
    isLoading,
    dailyAssignmentData,
    monthlyPaymentData,
    totalPayment,
    addEntry,
    updateEntry,
    deleteEntry,
    applyFilter
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse-subtle"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 rounded-full bg-pink-600/10 blur-3xl animate-pulse-subtle" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-32 rounded-full bg-amber-500/5 blur-3xl animate-pulse-subtle" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-subtle" style={{ animationDelay: "2.5s" }}></div>
        
        {/* Animated gradient lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-pink-500/0 animate-pulse-subtle"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500/0 via-pink-500/30 to-purple-500/0 animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500/0 via-purple-500/30 to-pink-500/0 animate-pulse-subtle" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-pink-500/0 via-pink-500/30 to-purple-500/0 animate-pulse-subtle" style={{ animationDelay: "2s" }}></div>
      </div>
      
      {/* Main content with enhanced styling */}
      <div className="container mx-auto py-8 px-4 sm:px-6 relative z-10">
        <DashboardHeader />
        
        <div className="space-y-8">
          <WorkEntryForm onAddEntry={addEntry} />
          
          <DataTable
            entries={filteredEntries}
            isLoading={isLoading}
            onUpdateEntry={updateEntry}
            onDeleteEntry={deleteEntry}
            onFilter={applyFilter}
            totalPayment={totalPayment}
          />
          
          <ChartsSection
            dailyData={dailyAssignmentData}
            monthlyData={monthlyPaymentData}
          />
        </div>
        
        <footer className="mt-16 text-center text-base text-gray-300 font-medium py-4 animate-on-load relative" style={{"--delay": "5"} as React.CSSProperties}>
          <div className="flex flex-col items-center">
            <p className="mb-2 relative z-10 font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-pink-200">
              Gautam Modi Group © 2025. All rights reserved.
            </p>
            <div className="w-48 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
