"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export default function ImageGallery({ images, itemName }: { images: { url: string; publicId: string }[], itemName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50">
        <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
        <p>No images provided</p>
      </div>
    );
  }

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-full flex flex-col">
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <img 
          src={images[currentIndex].url} 
          alt={`${itemName} - Image ${currentIndex + 1}`} 
          className="max-w-full max-h-[600px] object-contain"
        />
        
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 p-4 bg-gray-100 overflow-x-auto">
          {images.map((img, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`relative h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${i === currentIndex ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={img.url} className="w-full h-full object-cover" alt="Thumbnail" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
