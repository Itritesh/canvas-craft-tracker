
import React, { useState } from 'react';
import { X, ZoomIn, Download, RotateCw, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "Uploaded project image",
  onRemove,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `project-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={`relative group rounded-lg overflow-hidden ${className || ''}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:shadow-glow"
            >
              <ZoomIn className="h-5 w-5 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden glass-card">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <span className="bg-gradient-to-r from-amber-200 via-purple-200 to-pink-200 text-transparent bg-clip-text">
                  Project Preview
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 rounded-lg overflow-hidden relative">
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? 
                    <Minimize className="h-4 w-4 text-white" /> : 
                    <Maximize className="h-4 w-4 text-white" />
                  }
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 text-white" />
                </Button>
              </div>
              <div className="flex justify-center items-center bg-black/20 p-4 transition-all duration-300 min-h-[300px]">
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-w-full max-h-[70vh] object-contain transition-all duration-300 hover:scale-[1.02]"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:shadow-glow"
          onClick={handleDownload}
        >
          <Download className="h-5 w-5 text-white" />
        </Button>
        
        {onRemove && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-red-500/60 hover:bg-red-500/80 backdrop-blur-sm transition-all duration-300 hover:shadow-glow"
            onClick={onRemove}
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
