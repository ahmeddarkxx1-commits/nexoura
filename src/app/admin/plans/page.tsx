"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/api/plans");
      setPlans(res.data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.delete(`/api/plans/${id}`);
      fetchPlans();
    } catch (error) {
      alert("Failed to delete plan");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/plans/${id}`, { isActive: !currentStatus });
      fetchPlans();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="text-white">Loading plans...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pricing Plans</h1>
          <p className="text-slate-400">Manage your subscription tiers and service packages</p>
        </div>
        <Link href="/admin/plans/new" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-violet-500/20">
          <Plus size={18} />
          <span>Create Plan</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center text-slate-500 rounded-2xl">
            No pricing plans defined.
          </div>
        ) : (
          plans.map((plan: any) => (
            <div key={plan._id} className={`glass-card rounded-2xl p-6 border transition-all relative ${plan.isPopular ? 'border-violet-500/50 shadow-xl shadow-violet-500/10' : 'border-white/5'}`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Popular Choice
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-2xl font-black text-cyan-400 mt-1">${plan.price.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/project</span></p>
                </div>
                <div className="flex gap-1">
                   <button 
                      onClick={() => toggleActive(plan._id, plan.isActive)}
                      className={`p-2 rounded-lg transition-colors border border-white/5 ${plan.isActive ? 'text-emerald-400 bg-emerald-500/5' : 'text-slate-500 bg-white/5'}`}
                      title={plan.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {plan.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <Link href={`/admin/plans/${plan._id}`} className="p-2 text-slate-400 hover:text-violet-400 bg-white/5 rounded-lg transition-colors border border-white/5">
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 text-slate-400 hover:text-rose-400 bg-white/5 rounded-lg transition-colors border border-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.slice(0, 5).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 5 && (
                  <p className="text-[10px] text-slate-500 font-medium">+{plan.features.length - 5} more features</p>
                )}
              </div>

              {!plan.isActive && (
                <div className="bg-slate-900/60 absolute inset-0 rounded-2xl flex items-center justify-center backdrop-blur-[2px] pointer-events-none z-10">
                   <span className="bg-slate-800 text-slate-400 px-4 py-1 rounded-full text-xs font-bold border border-white/10 uppercase shadow-xl">Inactive Plan</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
