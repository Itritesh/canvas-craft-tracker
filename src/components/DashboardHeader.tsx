
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DashboardHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!mounted) return null;
  
  // Format current date and time
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(currentTime);
  
  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 animate-fade-in">
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Designer Dashboard
          </span>
        </h1>
        <div className="mt-1 text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1">
          <span className="font-medium animate-pulse-subtle">{formattedDate}</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-medium">{formattedTime}</span>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full w-10 h-10 p-0 animate-scale-in",
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
          )}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};
