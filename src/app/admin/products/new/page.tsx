"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, ArrowLeft, Loader2, Plus, Tag } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: "0",
    category: "website",
    description: "",
    previewLink: "",
    techStack: "",
    isActive: true,
    isFeatured: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate final price for preview
  const priceNum = Number(formData.price) || 0;
  const discountNum = Number(formData.discount) || 0;
  const finalPrice = priceNum - (priceNum * (discountNum / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrls = [];
      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const uploadRes = await axios.post('/api/upload', uploadFormData);
        uploadedImageUrls.push(uploadRes.data.url);
      }

      const productData = {
        ...formData,
        price: priceNum,
        discount: discountNum,
        finalPrice: finalPrice,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        images: uploadedImageUrls,
      };

      await axios.post('/api/products', productData);
      
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Error creating product";
      console.error("Error creating product:", error);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="text-slate-400">Create a new digital product with discounts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-8 rounded-2xl space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-violet-500 rounded-full" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  placeholder="e.g. Nexoura E-commerce Pro"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                >
                  <option value="website">Website Template</option>
                  <option value="app">Mobile App</option>
                  <option value="saas">SaaS Dashboard</option>
                  <option value="branding">Branding Package</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Preview Link (Optional)</label>
                <input
                  type="url"
                  value={formData.previewLink}
                  onChange={e => setFormData({ ...formData, previewLink: e.target.value })}
                  className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  placeholder="https://demo.nexoura.com"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Discount */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-cyan-500 rounded-full" />
              Pricing & Discounts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Original Price ($)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  placeholder="e.g. 1500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Discount (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all pr-10"
                    placeholder="0"
                  />
                  <Tag size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Final Price</p>
                <p className="text-2xl font-bold text-emerald-400">${finalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full" />
              Product Configuration
            </h3>
            
            <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Active & Visible</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-violet-500' : 'bg-slate-700'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Featured Product</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none transition-all"
                placeholder="Describe the product value proposition..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                placeholder="e.g. React, Node.js, MongoDB, Tailwind"
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              Product Media
            </h3>
            
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:bg-white/5 transition-all relative group cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="relative z-0">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <p className="text-slate-200 font-medium mb-1">Upload high-quality screenshots</p>
                <p className="text-sm text-slate-500">Drag & drop or click to browse files</p>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-[#020408] border border-white/10 shadow-xl">
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className="px-8 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>{loading ? 'Creating...' : 'Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
