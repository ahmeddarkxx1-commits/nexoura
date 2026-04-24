import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";
import Plan from "@/lib/models/Plan";
import Order from "@/lib/models/Order";
import { Package, CreditCard, ShoppingCart, TrendingUp, Globe, Users, MessageCircle } from "lucide-react";
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back, {session?.user?.name || "Admin"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">{stat.name}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Affiliates */}
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-violet-400" />
            Top Affiliates
          </h2>
          <div className="space-y-4">
            {affiliateCount === 0 ? (
              <p className="text-slate-500 text-sm">No affiliates yet.</p>
            ) : (
              /* Map top affiliates here if fetched */
              <p className="text-slate-400 text-sm">Check the Affiliates page for detailed tracking.</p>
            )}
          </div>
          <Link href="/admin/affiliates" className="inline-block mt-6 text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
            View All Affiliates →
          </Link>
        </div>

        {/* Quick Actions / Info */}
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-slate-500 uppercase mb-1">Products</p>
              <p className="text-xl font-bold text-white">{productCount}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-slate-500 uppercase mb-1">Pricing Plans</p>
              <p className="text-xl font-bold text-white">{planCount}</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-6">
            The referral system is active. All WhatsApp leads are now being attributed to their respective referrers.
          </p>
        </div>
      </div>
    </div>
  );
}
