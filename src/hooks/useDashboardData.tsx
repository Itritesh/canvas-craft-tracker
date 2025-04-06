
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { 
  WorkEntry, 
  sampleWorkEntries, 
  generateId, 
  calculateTotalPayment,
  groupByDate,
  groupPaymentsByMonth
} from '@/utils/dashboardUtils';

// Extended WorkEntry with projectImage
interface ExtendedWorkEntry extends WorkEntry {
  projectImage?: string;
}

export const useDashboardData = () => {
  const [entries, setEntries] = useState<ExtendedWorkEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ExtendedWorkEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dailyAssignmentData, setDailyAssignmentData] = useState<{ date: string; count: number }[]>([]);
  const [monthlyPaymentData, setMonthlyPaymentData] = useState<{ month: string; total: number }[]>([]);
  const [totalPayment, setTotalPayment] = useState(0);
  
  // Initialize with sample data
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setEntries(sampleWorkEntries);
      setFilteredEntries(sampleWorkEntries);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update derived data when entries change
  useEffect(() => {
    setTotalPayment(calculateTotalPayment(entries));
    setDailyAssignmentData(groupByDate(entries));
    setMonthlyPaymentData(groupPaymentsByMonth(entries));
  }, [entries]);
  
  // Filter entries when filter changes
  useEffect(() => {
    if (!filter) {
      setFilteredEntries(entries);
      return;
    }
    
    const filtered = entries.filter(entry => 
      entry.designerName.toLowerCase().includes(filter.toLowerCase()) ||
      entry.workTopic.toLowerCase().includes(filter.toLowerCase()) ||
      entry.company.toLowerCase().includes(filter.toLowerCase())
    );
    
    setFilteredEntries(filtered);
  }, [filter, entries]);
  
  // Add a new work entry
  const addEntry = (entry: Omit<WorkEntry, 'id'>, projectImage?: File) => {
    const newEntryBase = {
      ...entry,
      id: generateId()
    };
    
    let newEntry: ExtendedWorkEntry = newEntryBase;
    
    // Process image if provided
    if (projectImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        
        // Update the entry with the image data
        setEntries(prev => 
          prev.map(e => 
            e.id === newEntryBase.id ? { ...e, projectImage: imageData } : e
          )
        );
      };
      reader.readAsDataURL(projectImage);
    }
    
    setEntries(prev => [...prev, newEntry]);
    toast({
      title: "Work entry added",
      description: `${entry.workTopic} for ${entry.company} has been added successfully.`,
    });
  };
  
  // Update an existing entry
  const updateEntry = (updatedEntry: ExtendedWorkEntry) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    
    toast({
      title: "Entry updated",
      description: `${updatedEntry.workTopic} has been updated successfully.`,
    });
  };
  
  // Delete an entry
  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    
    toast({
      title: "Entry deleted",
      description: "The work entry has been removed.",
      variant: "destructive",
    });
  };
  
  // Apply filter
  const applyFilter = (filterText: string) => {
    setFilter(filterText);
  };
  
  return {
    entries,
    filteredEntries,
    isLoading,
    dailyAssignmentData,
    monthlyPaymentData,
    totalPayment,
    addEntry,
    updateEntry,
    deleteEntry,
    applyFilter
  };
};
