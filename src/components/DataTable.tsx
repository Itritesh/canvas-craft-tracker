
import React, { useState } from 'react';
import { WorkEntry, formatDate, formatCurrency, downloadCSV } from '@/utils/dashboardUtils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Download, Filter, Edit, Trash2 } from 'lucide-react';
import { EditEntryForm } from './EditEntryForm';

interface DataTableProps {
  entries: WorkEntry[];
  isLoading: boolean;
  onUpdateEntry: (entry: WorkEntry) => void;
  onDeleteEntry: (id: string) => void;
  onFilter: (filterText: string) => void;
  totalPayment: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  entries,
  isLoading,
  onUpdateEntry,
  onDeleteEntry,
  onFilter,
  totalPayment,
}) => {
  const [filterText, setFilterText] = useState('');
  const [entryToEdit, setEntryToEdit] = useState<WorkEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    onFilter(e.target.value);
  };
  
  const handleDownload = () => {
    downloadCSV(entries);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card className="w-full mt-6 glass-card animate-on-load" style={{"--delay": "2"}}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium">Work Entries</CardTitle>
            <CardDescription>
              Manage and track work assigned to designers
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <div className="relative">
              <Input
                placeholder="Filter entries..."
                value={filterText}
                onChange={handleFilterChange}
                className="min-w-[200px] pr-8 animate-hover"
              />
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="animate-hover"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designer</TableHead>
                <TableHead>Work Topic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Payment (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 7 }).map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No entries found. {filterText && "Try a different filter."}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id} className="animate-hover">
                    <TableCell className="font-medium">{entry.designerName}</TableCell>
                    <TableCell>{entry.workTopic}</TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.company}</TableCell>
                    <TableCell>{formatCurrency(entry.paymentAmount)}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog open={dialogOpen && entryToEdit?.id === entry.id} onOpenChange={(open) => {
                          if (!open) setEntryToEdit(null);
                          setDialogOpen(open);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEntryToEdit(entry)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit Work Entry</DialogTitle>
                            </DialogHeader>
                            {entryToEdit && (
                              <EditEntryForm
                                entry={entryToEdit}
                                onUpdate={(updatedEntry) => {
                                  onUpdateEntry(updatedEntry);
                                  setDialogOpen(false);
                                }}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Total Entries: {entries.length}
        </div>
        <div className="font-medium">
          Total Payment: {formatCurrency(totalPayment)}
        </div>
      </CardFooter>
    </Card>
  );
};
