"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Copy, CheckCircle2, UserCheck, UserX, TrendingUp, MousePointer2, DollarSign } from "lucide-react";
import axios from "axios";
import { Affiliate } from "@/lib/types";

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const res = await axios.get("/api/admin/affiliates");
      setAffiliates(res.data);
    } catch (error) {
      console.error("Error fetching affiliates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post("/api/admin/affiliates", newAffiliate);
      setShowAddModal(false);
      setNewAffiliate({ name: "", email: "" });
      fetchAffiliates();
    } catch (error) {
      console.error("Error adding affiliate:", error);
    } finally {
      setAdding(false);
    }
  };

  const toggleStatus = async (affiliate: Affiliate) => {
    try {
      await axios.put(`/api/admin/affiliates/${affiliate._id}`, { isActive: !affiliate.isActive });
      fetchAffiliates();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const copyRefLink = (code: string) => {
    const link = `${window.location.origin}?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-violet-500 mb-4" />
        <p className="text-slate-400">Loading affiliates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Affiliate Management</h1>
          <p className="text-slate-400">Manage your partners and track their performance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-violet-500/20 transition-all"
        >
          <Plus size={20} />
          Add Affiliate
        </button>
      </div>

      {/* Affiliates List */}
      <div className="grid grid-cols-1 gap-6">
        {affiliates.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <p className="text-slate-500">No affiliates found. Add your first partner!</p>
          </div>
        ) : (
          affiliates.map((affiliate) => (
            <div key={affiliate._id} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${affiliate.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                  {affiliate.isActive ? <UserCheck size={24} /> : <UserX size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{affiliate.name}</h3>
                  <p className="text-sm text-slate-400">{affiliate.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold">Code</p>
                  <p className="text-white font-mono bg-white/5 px-2 py-1 rounded text-sm">{affiliate.code}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold flex items-center gap-1 justify-center md:justify-start">
                    <MousePointer2 size={10} /> Clicks
                  </p>
                  <p className="text-white font-bold">{affiliate.totalClicks}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold flex items-center gap-1 justify-center md:justify-start">
                    <TrendingUp size={10} /> Sales
                  </p>
                  <p className="text-white font-bold">{affiliate.totalSales}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-bold flex items-center gap-1 justify-center md:justify-start">
                    <DollarSign size={10} /> Earnings
                  </p>
                  <p className="text-emerald-400 font-bold">${affiliate.totalEarnings}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => copyRefLink(affiliate.code)}
                  className="p-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                  title="Copy Referral Link"
                >
                  {copiedCode === affiliate.code ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  <span className="text-xs font-bold">{copiedCode === affiliate.code ? 'Copied' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={() => toggleStatus(affiliate)}
                  className={`p-3 border rounded-xl transition-all ${affiliate.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20'}`}
                  title={affiliate.isActive ? 'Deactivate' : 'Activate'}
                >
                  {affiliate.isActive ? <UserCheck size={18} /> : <UserX size={18} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md glass-card p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">New Affiliate</h2>
            <form onSubmit={handleAddAffiliate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAffiliate.name}
                  onChange={e => setNewAffiliate({ ...newAffiliate, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAffiliate.email}
                  onChange={e => setNewAffiliate({ ...newAffiliate, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {adding ? <Loader2 className="animate-spin" size={20} /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
