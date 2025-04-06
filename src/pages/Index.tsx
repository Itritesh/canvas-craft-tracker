
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <DashboardHeader />
        
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
        
        <footer className="mt-16 text-center text-base text-gray-300 font-medium py-4 animate-on-load" style={{"--delay": "5"} as React.CSSProperties}>
          <div className="flex flex-col items-center">
            <p className="mb-2">Gautam Modi Group © 2025. All rights reserved.</p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500 rounded-full"></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
