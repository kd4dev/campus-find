"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export default function ImageGallery({ images, itemName }: { images: { url: string; publicId: string }[], itemName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50">
        <ImageIcon className="w-16 h-16 mb-2 opacity-40" />
        <p className="text-sm font-medium">No images provided</p>
      </div>
    );
  }

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-full flex flex-col">
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[280px]">
        <img 
          src={images[currentIndex].url} 
          alt={`${itemName} - Image ${currentIndex + 1}`} 
          className="max-w-full max-h-[550px] object-contain transition-transform duration-300"
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prev} 
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-full shadow-lg text-slate-800 dark:text-slate-200 transition-all backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={next} 
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-full shadow-lg text-slate-800 dark:text-slate-200 transition-all backdrop-blur-sm hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 p-3 bg-slate-100 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
          {images.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex 
                  ? 'border-blue-600 ring-2 ring-blue-600/30 dark:ring-blue-500/40 opacity-100 scale-105' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-100'
              }`}
            >
              <img src={img.url} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
