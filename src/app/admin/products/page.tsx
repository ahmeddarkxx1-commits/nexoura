"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Eye, EyeOff, Tag, Package, Loader2 } from "lucide-react";
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

  const toggleStatus = async (id: string, currentStatus: boolean) => {
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Inventory</h1>
          <p className="text-slate-400 mt-1">Manage your digital products, pricing and discounts</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-500/20 transition-all active:scale-95 shadow-xl shadow-violet-500/10"
        >
          <Plus size={20} />
          Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full py-20 glass-card rounded-3xl flex flex-col items-center justify-center border-dashed border-2 border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Package size={32} className="text-slate-500" />
            </div>
            <p className="text-slate-500 font-medium text-lg">No products found</p>
          </div>
        ) : (
          products.map((product: any) => (
            <div 
              key={product._id} 
              className="group glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 flex flex-col"
            >
              <div className="relative h-44 w-full overflow-hidden bg-[#0d1117]">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={40} className="text-white/10" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border shadow-lg ${
                    product.isActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                    {product.category}
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">{product.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {product.discount > 0 ? (
                      <>
                        <span className="text-lg font-black text-white">${product.finalPrice.toLocaleString()}</span>
                        <span className="text-xs text-slate-500 line-through">${product.price.toLocaleString()}</span>
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-lg font-bold">-{product.discount}%</span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-white">${product.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/products/${product._id}`} 
                      className="p-2 bg-white/5 hover:bg-violet-500/20 text-slate-400 hover:text-violet-400 rounded-xl transition-all border border-white/5"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all border border-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => toggleStatus(product._id, product.isActive)}
                    className="p-2 bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-xl transition-all border border-white/5"
                    title={product.isActive ? 'Hide Product' : 'Show Product'}
                  >
                    {product.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
