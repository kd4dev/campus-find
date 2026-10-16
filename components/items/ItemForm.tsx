"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, X, AlertCircle } from "lucide-react";
import { createItem } from "@/lib/actions/item.actions";
import { motion } from "framer-motion";

const categories = [
  "Electronics", "Wallet", "ID Card", "Documents", "Bag", 
  "Books", "Keys", "Clothing", "Accessories", "Stationery", "Other"
];

const formSchema = z.object({
  itemName: z.string().min(2, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Provide a better description"),
  location: z.string().min(2, "Location is required"),
  date: z.string().min(1, "Date is required"),
  approximateTime: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  itemModel: z.string().optional(),
  distinguishingFeatures: z.string().optional(),
  serialNumber: z.string().optional(),
});

export default function ItemForm({ type }: { type: "LOST" | "FOUND" }) {
  const router = useRouter();
  const [images, setImages] = useState<{url: string, publicId: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setErrorMessage(null);
    
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (data.secure_url) {
        setImages([...images, { url: data.secure_url, publicId: data.public_id }]);
      }
    } catch (error) {
      console.error("Upload failed", error);
      setErrorMessage("Image upload failed. Please verify image size or format.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const itemData = {
        ...values,
        type,
        images,
        date: new Date(values.date),
      };
      const newItem = await createItem(itemData);
      router.push(`/items/${newItem._id}`);
    } catch (error: any) {
      console.error("Failed to create item", error);
      setErrorMessage(error.message || "Something went wrong while publishing your report.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Item Name *</label>
          <input {...register("itemName")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500" placeholder="e.g. Black Leather Wallet" />
          {errors.itemName && <p className="text-red-500 text-xs mt-1">{errors.itemName.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Category *</label>
          <select {...register("category")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c]">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Description *</label>
        <textarea {...register("description")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500 h-24" placeholder="Describe the item..." />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">{type === 'LOST' ? 'Lost' : 'Found'} Location *</label>
          <input {...register("location")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500" placeholder="e.g. Main Library, 2nd floor" />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Date *</label>
          <input type="date" {...register("date")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c]" />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Color</label>
          <input {...register("color")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Brand</label>
          <input {...register("brand")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Model</label>
          <input {...register("itemModel")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">
          Distinguishing Features
          {type === 'FOUND' && <span className="text-slate-500 dark:text-neutral-400 text-xs ml-2">(Keep some private for verification)</span>}
        </label>
        <input {...register("distinguishingFeatures")} className="w-full border border-gray-300 dark:border-white/10 rounded-xl p-2.5 text-sm bg-white dark:bg-[#18181c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] placeholder:text-gray-400 dark:placeholder:text-neutral-500" placeholder="e.g. Scratch on left side" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Images</label>
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
              <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white dark:bg-[#141416] border border-gray-200 dark:border-white/10 rounded-full p-1 shadow">
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 bg-white dark:bg-[#18181c]">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400 dark:text-neutral-400" /> : <UploadCloud className="w-6 h-6 text-gray-400 dark:text-neutral-400" />}
              <span className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Upload</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        type="submit" 
        disabled={isSubmitting} 
        className="cursor-pointer w-full btn-asym bg-[#FF7D0C] hover:bg-[#ea6c00] text-white font-semibold py-3.5 px-4 disabled:opacity-50 flex justify-center items-center shadow-md dark:shadow-[0_0_20px_-3px_rgba(255,125,12,0.4)] transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span>Publishing to Campus Board...</span>
          </>
        ) : (
          `Submit ${type === 'LOST' ? 'Lost' : 'Found'} Report`
        )}
      </motion.button>
    </form>
  );
}
