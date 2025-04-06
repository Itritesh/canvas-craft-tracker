
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
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

// Form schema for validation
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
  onAddEntry: (entry: Omit<WorkEntry, 'id'>) => void;
};

export const WorkEntryForm: React.FC<WorkEntryFormProps> = ({ onAddEntry }) => {
  const [customCompany, setCustomCompany] = useState("");
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  
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
    
    onAddEntry({
      designerName: values.designerName,
      workTopic: values.workTopic,
      date: values.date,
      company: finalCompany,
      paymentAmount: values.paymentAmount,
      status: values.status,
    });
    
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
  };

  // Handle company selection with "Other" option
  const handleCompanyChange = (value: string) => {
    form.setValue("company", value);
    setShowCustomCompany(value === "Other");
  };

  return (
    <Card className="w-full glass-card animate-on-load" style={{ "--delay": "1" } as React.CSSProperties}>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Add New Work Entry</CardTitle>
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
                    <FormLabel>Designer Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter designer name" 
                        {...field}
                        className="animate-hover" 
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
                    <FormLabel>Work Topic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Festival Poster" 
                        {...field}
                        className="animate-hover" 
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
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal animate-hover",
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
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={handleCompanyChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="animate-hover">
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
                  <FormLabel>Custom Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      className="animate-hover"
                    />
                  </FormControl>
                </FormItem>
              )}
              
              <FormField
                control={form.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Enter amount"
                        {...field}
                        className="animate-hover"
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
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="animate-hover">
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
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto animate-hover"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Entry
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
