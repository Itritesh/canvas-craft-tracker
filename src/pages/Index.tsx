
import React from 'react';
import { ThemeProvider } from "next-themes";
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-gradient-dark dark:bg-gradient-dark">
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
          
          <footer className="mt-16 text-center text-sm text-muted-foreground">
            <p>Designer Dashboard © 2025. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
