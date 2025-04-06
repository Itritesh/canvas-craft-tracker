
import React, { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `project-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
              <ZoomIn className="h-5 w-5 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Project Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-4 rounded-lg overflow-hidden">
              <img src={src} alt={alt} className="w-full h-auto" />
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-white/20 hover:bg-white/30"
          onClick={handleDownload}
        >
          <Download className="h-5 w-5 text-white" />
        </Button>
        
        {onRemove && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-red-500/60 hover:bg-red-500/80"
            onClick={onRemove}
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};
