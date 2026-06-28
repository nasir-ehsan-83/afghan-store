import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../api/axios.js";
import {
  PlusCircle,
  Edit,
  Trash2,
  Package,
  Layers,
  DollarSign,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Warehouse,
  Hash,
  Tag,
  TrendingUp,
  Circle,
  Clock,
  X,
  ZoomIn,
} from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products`);
      
      if (res.data && res.data.products && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else if (res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(
          products.filter((product) => product.id !== id && product._id !== id)
        );
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting product");
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const getStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600 bg-red-50 border-red-200" };
    if (stock < 10) return { label: "Low Stock", color: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  };

  const openImageModal = (imageUrl, product) => {
    setSelectedImage(imageUrl);
    setSelectedProduct(product);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedProduct(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 antialiased py-8">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 mb-8 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <Package className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                  Product List
                </h1>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <Warehouse className="w-4 h-4" />
                  Manage and monitor your premium store inventory
                </p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <Link
                to="/admin/products/add"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add New Product</span>
              </Link>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3 bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Loading inventory...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-center gap-2 text-sm font-medium mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden">
                  {products.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3">
                      <Package className="w-16 h-16 text-slate-300" />
                      <p className="text-lg font-medium text-slate-600">No products found</p>
                      <p className="text-sm text-slate-400">Click the button on the right to add your first item.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <Hash className="w-3.5 h-3.5 text-slate-400" />
                                #
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                Product
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                Category
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                Price
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                                Stock
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <Circle className="w-3.5 h-3.5 text-slate-400" />
                                Status
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-left">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                                Sales
                              </div>
                            </th>
                            <th className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <Edit className="w-3.5 h-3.5 text-slate-400" />
                                Actions
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.map((product, index) => {
                            const productId = product.id || product._id;
                            const status = getStatus(product.stock);
                            const sales = Math.floor(Math.random() * 900) + 10;
                            
                            return (
                              <tr key={productId} className="hover:bg-blue-50/20 transition-colors duration-150">
                                <td className="py-3.5 px-4 text-sm font-medium text-slate-400">
                                  {index + 1}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-3">
                                    {product.imageURL ? (
                                      <div 
                                        className="relative cursor-pointer group/image"
                                        onClick={() => openImageModal(product.imageURL, product)}
                                      >
                                        <img
                                          src={product.imageURL}
                                          alt={product.name}
                                          className="w-10 h-10 rounded-lg object-cover border border-slate-100 transition-all duration-200 group-hover/image:border-blue-400 group-hover/image:shadow-lg"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='20'%3E📷%3C/text%3E%3C/svg%3E";
                                          }}
                                          loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                                          <ZoomIn className="w-4 h-4 text-white" />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-100 flex items-center justify-center text-xl">
                                        📷
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-sm font-semibold text-slate-800">
                                        {product.name}
                                      </div>
                                      <div className="text-xs text-slate-400 truncate max-w-[150px]">
                                        {product.description || "No description"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    <Tag className="w-3 h-3" />
                                    {product.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="text-sm font-bold text-slate-800">
                                    ${Number(product.price).toLocaleString()}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="text-sm font-semibold text-slate-700">
                                    {product.stock}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                    {status.label}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="text-sm font-medium text-slate-700">
                                    {sales.toLocaleString()} sold
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Link
                                      to={`/admin/products/update/${productId}`}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() => deleteProduct(productId)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Package className="w-4 h-4 text-blue-500" />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 text-sm">Total Items</span>
                      <span className="font-bold text-slate-800 text-lg">{products.length}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 text-sm">Categories</span>
                      <span className="font-bold text-slate-800 text-lg">
                        {new Set(products.map((p) => p.category)).size}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Low Stock</span>
                      <span className="font-bold text-amber-600 text-lg">
                        {products.filter((p) => p.stock < 10).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(
                      products.reduce((acc, p) => {
                        acc[p.category] = (acc[p.category] || 0) + 1;
                        return acc;
                      }, {})
                    )
                      .slice(0, 5)
                      .map(([category, count]) => (
                        <div key={category} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-xl">
                          <span className="text-slate-600 font-medium">{category}</span>
                          <span className="bg-white px-3 py-1 rounded-lg text-xs font-bold text-blue-600 border border-blue-100">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-600">New product added</span>
                      <span className="text-xs text-slate-400 ml-auto">2 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-slate-600">Stock updated</span>
                      <span className="text-xs text-slate-400 ml-auto">1 hour ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      <span className="text-slate-600">Low stock alert</span>
                      <span className="text-xs text-slate-400 ml-auto">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeImageModal}
        >
          <div 
            className="relative w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-6 right-6 text-white/60 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2.5 transition-all duration-200 z-20 backdrop-blur-sm border border-white/10"
            >
              <X className="w-7 h-7" />
            </button>

            {selectedProduct && (
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-black/50 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                  <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                  <p className="text-sm text-white/50 mt-0.5">{selectedProduct.category}</p>
                </div>
              </div>
            )}

            <div className="relative w-full h-full flex items-center justify-center p-6 md:p-10">
              <img
                src={selectedImage}
                alt={selectedProduct?.name || "Product image"}
                className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                style={{ 
                  imageRendering: "auto",
                  objectFit: "contain"
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-size='28'%3EImage not available%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {selectedProduct && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12 pb-6 px-6 md:px-10">
                <div className="max-w-6xl mx-auto">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Description</p>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-3xl">
                      {selectedProduct.description || "No description available for this product."}
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      ${Number(selectedProduct.price).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-xs md:text-sm">
                        <Package className="w-3.5 h-3.5" />
                        {selectedProduct.category}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs md:text-sm">
                        <Circle className="w-2.5 h-2.5 fill-emerald-300" />
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-white/15 text-[11px] animate-pulse tracking-wider font-light">
              Click anywhere to close ✕
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        .animate-pulse {
          animation: pulse 2.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ProductList;