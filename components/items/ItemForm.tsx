"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, X } from "lucide-react";
import { createItem } from "@/lib/actions/item.actions";

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

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
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
      console.error("Upload failed", error); alert("Upload failed: Check console and your Cloudinary Environment Variables.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const itemData = {
        ...values,
        type,
        images,
        date: new Date(values.date),
      };
      const newItem = await createItem(itemData);
      router.push(`/items/${newItem._id}`);
    } catch (error) {
      console.error("Failed to create item", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Item Name *</label>
          <input {...register("itemName")} className="w-full border rounded-md p-2" placeholder="e.g. Black Leather Wallet" />
          {errors.itemName && <p className="text-red-500 text-xs mt-1">{errors.itemName.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select {...register("category")} className="w-full border rounded-md p-2">
            <option value="">Select a category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea {...register("description")} className="w-full border rounded-md p-2 h-24" placeholder="Describe the item..." />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">{type === 'LOST' ? 'Lost' : 'Found'} Location *</label>
          <input {...register("location")} className="w-full border rounded-md p-2" placeholder="e.g. Main Library, 2nd floor" />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input type="date" {...register("date")} className="w-full border rounded-md p-2" />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input {...register("color")} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input {...register("brand")} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input {...register("itemModel")} className="w-full border rounded-md p-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Distinguishing Features
          {type === 'FOUND' && <span className="text-gray-500 text-xs ml-2">(Keep some private for verification)</span>}
        </label>
        <input {...register("distinguishingFeatures")} className="w-full border rounded-md p-2" placeholder="e.g. Scratch on left side" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 border rounded-md overflow-hidden">
              <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow">
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <label className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
              <span className="text-xs text-gray-500 mt-1">Upload</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
      >
        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
        Submit Report
      </button>
    </form>
  );
}
