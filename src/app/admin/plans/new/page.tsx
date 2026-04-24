"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function NewPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    isPopular: false,
    isActive: true,
    buttonText: "Get Started",
    features: [] as string[],
  });

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.features.length === 0) {
      alert("Please add at least one feature");
      return;
    }
    setLoading(true);

    try {
      const planData = {
        ...formData,
        price: Number(formData.price),
      };

      await axios.post('/api/plans', planData);
      
      router.push('/admin/plans');
      router.refresh();
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("Error creating plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/plans" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Plan</h1>
          <p className="text-slate-400">Design a new pricing tier for your services</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-violet-500 rounded-full" />
                Plan Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="e.g. Professional"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="e.g. 1999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={e => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Get Started"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                  placeholder="A quick summary of this plan..."
                />
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-cyan-500 rounded-full" />
                Plan Features
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 bg-[#020408] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="e.g. 10 Pages Custom Design"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  Add
                </button>
              </div>

              <div className="space-y-3 mt-4">
                {formData.features.map((feature, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="p-1 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-center py-4 text-slate-500 text-sm italic">No features added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-semibold text-white">Status</h3>
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">Popular Choice</span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={formData.isPopular}
                    onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.isPopular ? 'bg-violet-500' : 'bg-slate-700'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isPopular ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">Plan Active</span>
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
              </label>
            </div>

            <div className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 p-6 rounded-2xl border border-white/10">
              <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Plan Preview</h4>
              <p className="text-xs text-slate-400">This is how your plan will appear in the pricing grid.</p>
              <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5">
                <p className="text-lg font-bold text-white">{formData.name || 'Plan Name'}</p>
                <p className="text-xl font-black text-cyan-400 mt-1">${Number(formData.price).toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/plans" className="px-8 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            <span>{loading ? 'Creating...' : 'Publish Plan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
