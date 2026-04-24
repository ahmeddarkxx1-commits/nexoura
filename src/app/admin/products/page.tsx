"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Eye, EyeOff, Tag } from "lucide-react";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`/api/products/${id}`, { isActive: !currentStatus });
      fetchProducts();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="text-white">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-slate-400">Manage your product inventory and discounts</p>
        </div>
        <Link href="/admin/products/new" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-violet-500/20">
          <Plus size={18} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="p-4 text-sm font-medium text-slate-300">Product</th>
              <th className="p-4 text-sm font-medium text-slate-300">Category</th>
              <th className="p-4 text-sm font-medium text-slate-300">Price Info</th>
              <th className="p-4 text-sm font-medium text-slate-300">Status</th>
              <th className="p-4 text-sm font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No products found. Add one to get started.
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-[#020408] border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#020408] flex items-center justify-center border border-white/5">
                          <span className="text-[10px] text-slate-500">No img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{product.title}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-300 capitalize">{product.category}</td>
                  <td className="p-4">
                    <div className="text-sm">
                      {product.discount > 0 ? (
                        <>
                          <p className="text-slate-500 line-through text-xs">${product.price.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-bold">${product.finalPrice.toLocaleString()}</p>
                            <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">-{product.discount}%</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-white font-bold">${product.price.toLocaleString()}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(product._id, product.isActive)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        product.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20'
                      }`}
                    >
                      {product.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      {product.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${product._id}`} className="p-2 text-slate-400 hover:text-violet-400 bg-white/5 rounded-lg transition-colors border border-white/5">
                        <Edit size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 bg-white/5 rounded-lg transition-colors border border-white/5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
