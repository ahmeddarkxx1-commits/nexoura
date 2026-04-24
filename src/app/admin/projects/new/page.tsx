"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, ArrowLeft, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "website",
    description: "",
    previewLink: "",
    techStack: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload images to Cloudinary via our API
      const uploadedImageUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post('/api/upload', formData);
        uploadedImageUrls.push(uploadRes.data.url);
      }

      // 2. Save project
      const projectData = {
        ...formData,
        price: Number(formData.price),
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        images: uploadedImageUrls,
      };

      await axios.post('/api/projects', projectData);
      
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Project</h1>
          <p className="text-slate-400">Create a new project for your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                placeholder="e.g. LuxeCart Pro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                placeholder="e.g. 2999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="website">Website</option>
                <option value="app">Mobile App</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="branding">Branding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Preview Link (Optional)</label>
              <input
                type="url"
                value={formData.previewLink}
                onChange={e => setFormData({ ...formData, previewLink: e.target.value })}
                className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
              placeholder="Project description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={e => setFormData({ ...formData, techStack: e.target.value })}
              className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="e.g. Next.js, Tailwind CSS, Framer Motion"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Project Images</label>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:bg-white/5 transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="mx-auto text-slate-400 mb-3" />
              <p className="text-slate-300 font-medium mb-1">Click or drag images here to upload</p>
              <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP</p>
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-[#020408] border border-white/10">
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
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
          <Link href="/admin/projects" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>Save Project</span>
          </button>
        </div>
      </form>
    </div>
  );
}
