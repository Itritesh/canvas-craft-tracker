
import React, { useState, useRef } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companies, WorkEntry } from '@/utils/dashboardUtils';
import { ImagePreview } from './ImagePreview';
import { toast } from "@/components/ui/use-toast";

// Extended form schema for validation
const formSchema = z.object({
  designerName: z.string().min(2, {
    message: "Designer name must be at least 2 characters.",
  }),
  workTopic: z.string().min(3, {
    message: "Work topic must be at least 3 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  company: z.string().min(1, {
    message: "Please select a company.",
  }),
  paymentAmount: z.coerce
    .number()
    .min(1, { message: "Payment must be at least 1." }),
  status: z.enum(["pending", "in-progress", "completed"], {
    required_error: "Please select a status.",
  }),
});

type WorkEntryFormProps = {
  onAddEntry: (entry: Omit<WorkEntry, 'id'>, projectImage?: File) => void;
};

export const WorkEntryForm: React.FC<WorkEntryFormProps> = ({ onAddEntry }) => {
  const [customCompany, setCustomCompany] = useState("");
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      designerName: "",
      workTopic: "",
      date: new Date(),
      company: "",
      paymentAmount: 0,
      status: "pending" as const,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const finalCompany = values.company === "Other" ? customCompany : values.company;
    
    onAddEntry(
      {
        designerName: values.designerName,
        workTopic: values.workTopic,
        date: values.date,
        company: finalCompany,
        paymentAmount: values.paymentAmount,
        status: values.status,
      },
      imageFile || undefined
    );
    
    form.reset({
      designerName: "",
      workTopic: "",
      date: new Date(),
      company: "",
      paymentAmount: 0,
      status: "pending" as const,
    });
    
    setCustomCompany("");
    setShowCustomCompany(false);
    setProjectImage(null);
    setImageFile(null);
  };

  // Handle company selection with "Other" option
  const handleCompanyChange = (value: string) => {
    form.setValue("company", value);
    setShowCustomCompany(value === "Other");
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setProjectImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setProjectImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full glass-card animate-on-load" style={{ "--delay": "1" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center">
          <div className="mr-2 p-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="h-5 w-5 text-white" />
          </div>
          Add New Work Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="designerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-100">Designer Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter designer name" 
                        {...field}
                        className="glass-input animate-hover" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="workTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-100">Work Topic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Festival Poster" 
                        {...field}
                        className="glass-input animate-hover" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-amber-100">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal glass-input animate-hover",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-100">Company</FormLabel>
                    <Select
                      onValueChange={handleCompanyChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="glass-input animate-hover">
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {showCustomCompany && (
                <FormItem>
                  <FormLabel className="text-amber-100">Custom Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      className="glass-input animate-hover"
                    />
                  </FormControl>
                </FormItem>
              )}
              
              <FormField
                control={form.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-100">Payment Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Enter amount"
                        {...field}
                        className="glass-input animate-hover"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-100">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="glass-input animate-hover">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Project Image Upload Section */}
            <div className="mt-4">
              <FormLabel className="text-amber-100 mb-2 block">Project Image</FormLabel>
              <div className="flex flex-col sm:flex-row gap-4">
                <div 
                  onClick={triggerFileInput}
                  className={`
                    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 
                    cursor-pointer transition-colors ${projectImage ? 'border-purple-500/40' : 'border-white/20 hover:border-purple-500/40'}
                    ${projectImage ? 'bg-purple-900/20' : 'bg-white/5 hover:bg-purple-900/10'}
                    flex-grow min-h-[150px] animate-hover
                  `}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  
                  {projectImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Image className="h-8 w-8 text-purple-400" />
                      <p className="text-sm text-center text-white/80">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-purple-400" />
                      <p className="text-base font-medium text-white/90">Upload Project Image</p>
                      <p className="text-xs text-white/60">Click to browse or drag and drop</p>
                      <p className="text-xs text-white/60">PNG, JPG, GIF (max 5MB)</p>
                    </div>
                  )}
                </div>
                
                {projectImage && (
                  <div className="flex-shrink-0 w-full sm:w-1/3 h-[150px] rounded-lg overflow-hidden shadow-lg animate-float">
                    <ImagePreview 
                      src={projectImage} 
                      alt="Project preview" 
                      onRemove={handleRemoveImage}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 animate-hover shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Entry
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
