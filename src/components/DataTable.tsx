
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
import { Download, Filter, Edit, Trash2, Eye, Image } from 'lucide-react';
import { EditEntryForm } from './EditEntryForm';
import { ImagePreview } from './ImagePreview';

// Extended WorkEntry with projectImage
interface ExtendedWorkEntry extends WorkEntry {
  projectImage?: string;
}

interface DataTableProps {
  entries: ExtendedWorkEntry[];
  isLoading: boolean;
  onUpdateEntry: (entry: ExtendedWorkEntry) => void;
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
  const [entryToEdit, setEntryToEdit] = useState<ExtendedWorkEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
    onFilter(e.target.value);
  };
  
  const handleDownload = () => {
    downloadCSV(entries);
  };
  
  const handleViewImage = (image: string) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
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
    <Card className="w-full mt-6 glass-card animate-on-load" style={{ "--delay": "2" } as React.CSSProperties}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <CardTitle className="text-xl font-medium flex items-center">
              <div className="mr-2 p-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Filter className="h-5 w-5 text-white" />
              </div>
              Work Entries
            </CardTitle>
            <CardDescription className="mt-1">
              Manage and track work assigned to designers
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <div className="relative">
              <Input
                placeholder="Filter entries..."
                value={filterText}
                onChange={handleFilterChange}
                className="min-w-[200px] pr-8 glass-input animate-hover"
              />
              <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="animate-hover glass-input"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-purple-900/20">
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="text-white/90">Project</TableHead>
                <TableHead className="text-white/90">Designer</TableHead>
                <TableHead className="text-white/90">Work Topic</TableHead>
                <TableHead className="text-white/90">Date</TableHead>
                <TableHead className="text-white/90">Company</TableHead>
                <TableHead className="text-white/90">Payment (₹)</TableHead>
                <TableHead className="text-white/90">Status</TableHead>
                <TableHead className="text-right text-white/90">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="border-b border-white/10">
                    {Array.from({ length: 8 }).map((_, cellIndex) => (
                      <TableCell key={`skeleton-cell-${cellIndex}`}>
                        <Skeleton className="h-4 w-full bg-white/10" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow className="border-b border-white/10">
                  <TableCell colSpan={8} className="h-24 text-center">
                    No entries found. {filterText && "Try a different filter."}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id} className="animate-hover border-b border-white/10 hover:bg-purple-900/20">
                    <TableCell>
                      {entry.projectImage ? (
                        <div 
                          className="w-10 h-10 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleViewImage(entry.projectImage!)}
                        >
                          <img 
                            src={entry.projectImage} 
                            alt={`${entry.workTopic} project`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-700/50 flex items-center justify-center">
                          <Image className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{entry.designerName}</TableCell>
                    <TableCell>{entry.workTopic}</TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.company}</TableCell>
                    <TableCell>{formatCurrency(entry.paymentAmount)}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {entry.projectImage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewImage(entry.projectImage!)}
                          >
                            <Eye className="h-4 w-4 text-purple-400" />
                            <span className="sr-only">View</span>
                          </Button>
                        )}
                        
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
                              <Edit className="h-4 w-4 text-blue-400" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] glass-card">
                            <DialogHeader>
                              <DialogTitle>Edit Work Entry</DialogTitle>
                            </DialogHeader>
                            {entryToEdit && (
                              <EditEntryForm
                                entry={entryToEdit}
                                onUpdate={(updatedEntry) => {
                                  onUpdateEntry(updatedEntry as ExtendedWorkEntry);
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
        <div className="font-medium text-lg bg-gradient-to-r from-amber-200 to-pink-300 text-transparent bg-clip-text">
          Total Payment: {formatCurrency(totalPayment)}
        </div>
      </CardFooter>
      
      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto glass-card">
          <DialogHeader>
            <DialogTitle>Project Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 rounded-lg overflow-hidden">
            {selectedImage && (
              <img src={selectedImage} alt="Project preview" className="w-full h-auto" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
