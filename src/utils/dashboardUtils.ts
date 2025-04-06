
import { format } from "date-fns";

export interface WorkEntry {
  id: string;
  designerName: string;
  workTopic: string;
  date: Date;
  company: string;
  paymentAmount: number;
  status: 'pending' | 'completed' | 'in-progress';
}

// Default companies list
export const companies = [
  "Hyundai",
  "Mahindra",
  "Mahindra BEV",
  "Audi",
  "Kia",
  "MG",
  "Other"
];

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Format date for display
export const formatDate = (date: Date): string => {
  return format(date, "PPP");
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

// Group work entries by date for daily assignment chart
export const groupByDate = (entries: WorkEntry[]) => {
  const grouped = entries.reduce((acc, entry) => {
    const dateStr = format(entry.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(entry);
    return acc;
  }, {} as Record<string, WorkEntry[]>);
  
  return Object.entries(grouped).map(([date, items]) => ({
    date: format(new Date(date), 'dd MMM'),
    count: items.length
  })).slice(-7); // Last 7 days
};

// Group payments by month for payment chart
export const groupPaymentsByMonth = (entries: WorkEntry[]) => {
  const grouped = entries.reduce((acc, entry) => {
    const monthStr = format(entry.date, 'yyyy-MM');
    if (!acc[monthStr]) {
      acc[monthStr] = 0;
    }
    acc[monthStr] += entry.paymentAmount;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped).map(([month, total]) => ({
    month: format(new Date(month + '-01'), 'MMM yyyy'),
    total
  })).slice(-6); // Last 6 months
};

// Convert data to CSV
export const convertToCSV = (entries: WorkEntry[]): string => {
  const headers = ['Designer Name', 'Work Topic', 'Date', 'Company', 'Payment Amount', 'Status'];
  
  const rows = entries.map(entry => [
    entry.designerName,
    entry.workTopic,
    formatDate(entry.date),
    entry.company,
    entry.paymentAmount.toString(),
    entry.status
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
};

// Download data as CSV
export const downloadCSV = (entries: WorkEntry[], filename = 'dashboard-data.csv'): void => {
  const csv = convertToCSV(entries);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Calculate total payment amount
export const calculateTotalPayment = (entries: WorkEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.paymentAmount, 0);
};

// Sample data for initial state
export const sampleWorkEntries: WorkEntry[] = [
  {
    id: generateId(),
    designerName: "Rahul Sharma",
    workTopic: "Festival Poster",
    date: new Date(2025, 3, 2),
    company: "Hyundai",
    paymentAmount: 5000,
    status: 'completed'
  },
  {
    id: generateId(),
    designerName: "Priya Patel",
    workTopic: "Social Media Banner",
    date: new Date(2025, 3, 3),
    company: "Mahindra",
    paymentAmount: 3500,
    status: 'completed'
  },
  {
    id: generateId(),
    designerName: "Amit Kumar",
    workTopic: "Product Brochure",
    date: new Date(2025, 3, 4),
    company: "Audi",
    paymentAmount: 7500,
    status: 'in-progress'
  },
  {
    id: generateId(),
    designerName: "Neha Singh",
    workTopic: "Website Banners",
    date: new Date(2025, 3, 5),
    company: "Kia",
    paymentAmount: 4500,
    status: 'pending'
  }
];
