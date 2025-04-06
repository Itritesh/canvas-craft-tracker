
import React, { useEffect, useState } from 'react';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DashboardHeader: React.FC = () => {
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
    <header className="w-full flex flex-col sm:flex-row justify-between items-center mb-8 animate-on-load" style={{"--delay": "0"} as React.CSSProperties}>
      <div className="flex flex-col items-start">
        <h1 className="text-4xl font-bold relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500 animate-pulse-subtle">
            Gautam Modi Group
          </span>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500 rounded-full"></div>
        </h1>
        <div className="mt-3 text-xl font-semibold flex flex-col sm:flex-row sm:items-center gap-1">
          <span className="font-medium animate-pulse-subtle text-amber-400">{formattedDate}</span>
          <span className="hidden sm:inline text-white mx-2">•</span>
          <span className="font-medium text-pink-400">{formattedTime}</span>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-0 animate-float">
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl border-2 border-pink-500/50 bg-gradient-to-br from-purple-900/70 to-pink-800/70 hover:from-purple-800 hover:to-pink-700 transition-all duration-300"
        >
          <Sun size={20} className="mr-2 text-amber-400" />
          <span className="font-medium text-white">Dashboard</span>
        </Button>
      </div>
    </header>
  );
};
