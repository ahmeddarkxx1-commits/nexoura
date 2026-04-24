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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Orders</h1>
        <p className="text-slate-400">Manage client requests and orders</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-sm font-medium text-slate-300">Client Info</th>
              <th className="p-4 text-sm font-medium text-slate-300">Project Request</th>
              <th className="p-4 text-sm font-medium text-slate-300">Amount</th>
              <th className="p-4 text-sm font-medium text-slate-300">Status</th>
              <th className="p-4 text-sm font-medium text-slate-300 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id.toString()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-white">{order.clientName}</p>
                    <p className="text-xs text-slate-400">{order.clientEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-300">{order.projectTitle}</p>
                    {order.notes && <p className="text-xs text-slate-500 truncate max-w-[200px] mt-1">{order.notes}</p>}
                  </td>
                  <td className="p-4 text-sm text-slate-300">${order.amount?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
