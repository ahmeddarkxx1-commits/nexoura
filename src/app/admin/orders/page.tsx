import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { CheckCircle, Clock } from "lucide-react";
import { getLocal } from "@/lib/jsonStorage";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  let orders: any[] = [];
  try {
    await connectDB();
    orders = await Order.find().sort({ createdAt: -1 });
  } catch (error) {
    console.warn("Database connection failed in orders page, using local storage.");
    orders = await getLocal('orders');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Project Orders</h1>
        <p className="text-slate-400 mt-1">Track and manage client requests and incoming orders</p>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Client</th>
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Project / Service</th>
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue</th>
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-600 font-medium italic">
                    No orders have been placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id.toString()} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{order.clientName}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{order.clientEmail}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col max-w-[250px]">
                        <span className="text-sm text-slate-300 font-medium">{order.projectTitle}</span>
                        {order.notes && (
                          <span className="text-[10px] text-slate-500 mt-1 truncate italic" title={order.notes}>
                            "{order.notes}"
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-sm">
                        ${order.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        order.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/5'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
