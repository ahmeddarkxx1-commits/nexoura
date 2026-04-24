"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UploadCloud, X, ArrowLeft, Loader2, Save, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [featureInput, setFeatureInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    discount: "0",
    category: "website",
    description: "",
    previewLink: "", // maps to liveDemo
    techStack: "",
    isActive: true,
    isFeatured: false,
    images: [] as string[],
    features: [] as string[],
    useCase: "",
    accentColor: "#8b5cf6",
    upsells: {
      customization: "499",
      hosting: "29",
      maintenance: "99"
    }
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        const p = res.data;
        setFormData({
          title: p.title,
          price: p.price.toString(),
          discount: p.discount.toString(),
          category: p.category,
          description: p.description,
          previewLink: p.liveDemo || "",
          techStack: (p.techStack || []).join(", "),
          isActive: p.isActive !== undefined ? p.isActive : true,
          isFeatured: p.isFeatured || false,
          images: p.images || [],
          features: p.features || [],
          useCase: p.useCase || "",
          accentColor: p.accentColor || "#8b5cf6",
          upsells: {
            customization: (p.upsells?.customization || 499).toString(),
            hosting: (p.upsells?.hosting || 29).toString(),
            maintenance: (p.upsells?.maintenance || 99).toString(),
          }
        });
        setPreviewUrls(p.images || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Product not found");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

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

  const priceNum = Number(formData.price) || 0;
  const discountNum = Number(formData.discount) || 0;
  const finalPrice = priceNum - (priceNum * (discountNum / 100));

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

      const productData = {
        ...formData,
        price: priceNum,
        discount: discountNum,
        finalPrice: finalPrice,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        images: uploadedImageUrls,
        liveDemo: formData.previewLink,
        upsells: {
          customization: Number(formData.upsells.customization),
          hosting: Number(formData.upsells.hosting),
          maintenance: Number(formData.upsells.maintenance),
        }
      };

      await axios.put(`/api/products/${id}`, productData);
      
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Error updating product";
      console.error("Error updating product:", error);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/products/${id}`);
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-violet-500 mb-4" />
        <p className="text-slate-400">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            <p className="text-slate-400">Update your digital product information</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all flex items-center gap-2"
        >
          {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          <span className="text-sm font-bold">Delete</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
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
                    <label className="block text-sm font-medium text-slate-300 mb-2">Live Demo Link</label>
                    <input
                      type="url"
                      value={formData.previewLink}
                      onChange={e => setFormData({ ...formData, previewLink: e.target.value })}
                      className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
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
                    className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none transition-all"
                    placeholder="Describe the product..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Best Use Case (Target Audience)</label>
                  <input
                    type="text"
                    value={formData.useCase}
                    onChange={e => setFormData({ ...formData, useCase: e.target.value })}
                    className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="e.g. Best for Startups and Digital Agencies"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                  Product Features
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Add a key feature..."
                  />
                  <button type="button" onClick={addFeature} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group">
                      <span className="text-xs text-slate-300">{feature}</span>
                      <button type="button" onClick={() => removeFeature(i)} className="p-1 text-slate-500 hover:text-rose-500 transition-all">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full" />
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
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Discount (%)</label>
                    <input
                      type="number"
                      min="0" max="100"
                      value={formData.discount}
                      onChange={e => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    />
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-center">
                    <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Final Price</p>
                    <p className="text-2xl font-bold text-emerald-400">${finalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-1 h-6 bg-amber-500 rounded-full" />
                  Media Gallery
                </h3>
                
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 transition-all relative group cursor-pointer">
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <UploadCloud size={32} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Upload product screenshots</p>
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-video bg-[#020408] border border-white/10">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status & Options */}
            <div className="glass-card p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-semibold text-white">Status & Meta</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-300">Active</span>
                  <input type="checkbox" className="sr-only" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-300">Featured</span>
                  <input type="checkbox" className="sr-only" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${formData.isFeatured ? 'bg-violet-500' : 'bg-slate-700'}`} />
                </label>
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="block text-xs font-medium text-slate-500 mb-2 uppercase">Accent Color</label>
                <div className="flex gap-2">
                  <input type="color" value={formData.accentColor} onChange={e => setFormData({ ...formData, accentColor: e.target.value })} className="w-10 h-10 bg-transparent border-none rounded cursor-pointer" />
                  <input type="text" value={formData.accentColor} onChange={e => setFormData({ ...formData, accentColor: e.target.value })} className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white" />
                </div>
              </div>
            </div>

            {/* Upsells */}
            <div className="glass-card p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-semibold text-white">Upsell Prices ($)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Customization Fee</label>
                  <input type="number" value={formData.upsells.customization} onChange={e => setFormData({ ...formData, upsells: { ...formData.upsells, customization: e.target.value }})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Monthly Hosting</label>
                  <input type="number" value={formData.upsells.hosting} onChange={e => setFormData({ ...formData, upsells: { ...formData.upsells, hosting: e.target.value }})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Maintenance (Monthly)</label>
                  <input type="number" value={formData.upsells.maintenance} onChange={e => setFormData({ ...formData, upsells: { ...formData.upsells, maintenance: e.target.value }})} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white" />
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-semibold text-white">Tech Stack</h3>
              <textarea
                rows={3}
                value={formData.techStack}
                onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="React, Next.js, etc..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <Link href="/admin/products" className="px-8 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all">Cancel</Link>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{saving ? 'Saving...' : 'Save Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
