import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import Plan from "@/lib/models/Plan";
import Order from "@/lib/models/Order";
import { Package, CreditCard, ShoppingCart, TrendingUp, Globe, Users, MessageCircle, Plus, Settings as SettingsIcon } from "lucide-react";
import { getLocal } from "@/lib/jsonStorage";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null; // Layout handles redirect
  }

  let visitCount = 0;
  let uniqueVisitors = 0;
  let affiliateCount = 0;
  let whatsappLeads = 0;
  let productCount = 0;
  let planCount = 0;
  let orderCount = 0;
  let totalRevenue = 0;

  try {
    await connectDB();
    productCount = await Product.countDocuments();
    planCount = await Plan.countDocuments();
    orderCount = await Order.countDocuments();
    const orders = await Order.find();
    totalRevenue = orders.reduce((acc: any, order: any) => acc + (order.amount || 0), 0);

    const Visit = (await import("@/lib/models/Visit")).default;
    const Referral = (await import("@/lib/models/Referral")).default;
    const Affiliate = (await import("@/lib/models/Affiliate")).default;

    visitCount = await Visit.countDocuments();
    uniqueVisitors = await Visit.distinct('ipHash').then(res => res.length);
    affiliateCount = await Affiliate.countDocuments();
    whatsappLeads = await Referral.countDocuments({ type: 'whatsapp' });

  } catch (error) {
    console.warn("Database connection failed, using local storage fallback for stats.");
    const localProducts = await getLocal('products');
    const localPlans = await getLocal('plans');
    const localOrders = await getLocal('orders');
    productCount = localProducts.length;
    planCount = localPlans.length;
    orderCount = localOrders.length;
    totalRevenue = localOrders.reduce((acc: any, order: any) => acc + (order.amount || 0), 0);
  }

  const stats = [
    { name: "Total Visits", value: visitCount, icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
    { name: "Unique Visitors", value: uniqueVisitors, icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { name: "WhatsApp Leads", value: whatsappLeads, icon: MessageCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Command Center</h1>
          <p className="text-slate-400 mt-1 font-medium">Welcome back, <span className="text-cyan-400">{session?.user?.name || "Commander"}</span>. Here's your mission report.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group relative">
            <div className={`absolute -inset-0.5 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${stat.color.replace('text-', 'bg-')}`} />
            <div className="glass-card relative p-8 rounded-3xl border border-white/5 flex flex-col gap-4 overflow-hidden">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} shadow-lg`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.name}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon size={80} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                Performance Matrix
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Daily</button>
                <button className="px-3 py-1 text-[10px] font-bold text-white bg-white/10 rounded-lg uppercase tracking-widest transition-colors">Weekly</button>
              </div>
            </div>

            <div className="h-[200px] flex items-end gap-2 px-2 relative z-10">
               {[40, 70, 45, 90, 65, 80, 55, 95, 40, 60, 85, 75].map((h, i) => (
                 <div key={i} className="flex-1 group/bar relative">
                   <div 
                    className="w-full bg-gradient-to-t from-cyan-600/20 to-cyan-400/60 rounded-t-lg transition-all duration-700 group-hover/bar:to-cyan-400 group-hover/bar:shadow-lg group-hover/bar:shadow-cyan-500/20" 
                    style={{ height: `${h}%` }} 
                   />
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                     {h}%
                   </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-xs font-bold text-cyan-400 hover:underline uppercase tracking-widest">View All</Link>
            </div>
            
            <div className="space-y-4">
              {orderCount === 0 ? (
                <div className="text-center py-10 text-slate-500 italic text-sm">Waiting for incoming project requests...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                        <th className="pb-4">Client</th>
                        <th className="pb-4">Project</th>
                        <th className="pb-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* This would ideally map orders from props/server */}
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-xs text-slate-500">
                          Incoming activity will appear here in real-time.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Feed */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-violet-600/10 to-transparent">
            <h2 className="text-xl font-bold text-white mb-6">Inventory</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                    <Package size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Live Products</span>
                </div>
                <span className="text-lg font-bold text-white">{productCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                    <CreditCard size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Pricing Tiers</span>
                </div>
                <span className="text-lg font-bold text-white">{planCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <ShoppingCart size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-300">Total Orders</span>
                </div>
                <span className="text-lg font-bold text-white">{orderCount}</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Growth Tip</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Add 2 more projects to your portfolio this week to increase conversion by an estimated 15%.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Quick Link</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/admin/projects/new" className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Publish Project</span>
                <Plus size={18} className="text-slate-500 group-hover:text-cyan-400" />
              </Link>
              <Link href="/admin/settings" className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Site Config</span>
                <SettingsIcon size={18} className="text-slate-500 group-hover:text-violet-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
