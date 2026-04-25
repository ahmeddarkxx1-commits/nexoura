"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UploadCloud, X, ArrowLeft, Loader2, Save, Trash2, Layout } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "website",
    description: "",
    previewLink: "",
    techStack: "",
    images: [] as string[],
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`);
        const p = res.data;
        setFormData({
          title: p.title,
          price: p.price.toString(),
          category: p.category,
          description: p.description,
          previewLink: p.liveDemo || "",
          techStack: (p.techStack || []).join(", "),
          images: p.images || [],
        });
        setPreviewUrls(p.images || []);
      } catch (error) {
        console.error("Error fetching project:", error);
        alert("Project not found");
        router.push("/admin/projects");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      const newUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    if (typeof previewUrls[index] === 'string' && !previewUrls[index].startsWith('blob:')) {
       setFormData(prev => ({
         ...prev,
         images: prev.images.filter((_, i) => i !== index)
       }));
    } else {
       const fileIndex = files.findIndex(f => URL.createObjectURL(f) === previewUrls[index]);
       if (fileIndex > -1) {
         setFiles(prev => prev.filter((_, i) => i !== fileIndex));
       }
    }
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const uploadedImageUrls = [...formData.images];
      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        const uploadRes = await axios.post('/api/upload', uploadFormData);
        uploadedImageUrls.push(uploadRes.data.url);
      }

      const projectData = {
        ...formData,
        price: Number(formData.price),
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        images: uploadedImageUrls,
        liveDemo: formData.previewLink,
      };

      await axios.put(`/api/projects/${id}`, projectData);
      
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/projects/${id}`);
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-violet-500 mb-4" />
        <p className="text-slate-400 font-medium">Fetching project data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Edit Project</h1>
            <p className="text-slate-400">Modify your portfolio project details</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all flex items-center gap-2"
        >
          {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          <span className="text-sm font-bold uppercase tracking-wider">Delete</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-8 rounded-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-lg"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all appearance-none"
              >
                <option value="website">Website</option>
                <option value="app">Mobile App</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="branding">Branding</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Live Demo Link</label>
            <input
              type="url"
              value={formData.previewLink}
              onChange={e => setFormData({ ...formData, previewLink: e.target.value })}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Tech Stack</label>
            <input
              type="text"
              value={formData.techStack}
              onChange={e => setFormData({ ...formData, techStack: e.target.value })}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              placeholder="Next.js, Tailwind, etc..."
            />
          </div>

          <div className="pt-6 border-t border-white/5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Media Gallery</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-black/40 border border-white/10">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <div className="relative group border-2 border-dashed border-white/10 rounded-xl aspect-video flex flex-col items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud size={24} className="text-slate-500 group-hover:text-violet-400 transition-colors" />
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Upload</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <Link href="/admin/projects" className="px-8 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-bold">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={saving} 
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-black rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            <span>{saving ? 'UPDATING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
