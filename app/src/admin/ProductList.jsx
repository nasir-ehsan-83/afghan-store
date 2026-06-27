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
  Loader2
} from "lucide-react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting product");
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="flex justify-center min-h-screen bg-slate-50 px-4 antialiased py-12">
      <div className="w-full max-w-5xl">
        
        {/* هدر دو ستونه اصلاح‌شده - عنوان در سمت چپ و دکمه در سمت راست دسکتاپ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200/60">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Product List</h1>
            <p className="text-sm text-slate-500 mt-2">Manage and monitor your premium store inventory</p>
          </div>

          <div className="mt-4 sm:mt-0">
            <Link 
              to="/admin/products/add"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* وضعیت بارگذاری دیتای انبار */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3 bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Loading inventory...</span>
          </div>
        )}

        {/* لایه مدیریت خطاهای سرور */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-medium mb-6 animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* جدول فلت، مینیمال و شیک */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
            {products.length === 0 ? (
              <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
                <Package className="w-12 h-12 text-slate-300" />
                <p className="text-base font-medium text-slate-600">No products found</p>
                <p className="text-sm text-slate-400">Click the button on the right to add your first item.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                      <th className="py-4 px-6">Product Info</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Stock</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/60 transition-colors duration-150">
                        
                        {/* اطلاعات کالا به همراه تایل پیش‌نمایش تصویر کالا */}
                        <td className="py-4 px-6 flex items-center gap-4">
                          <img 
                            src={product.imageURL} 
                            alt={product.name} 
                            className="w-11 h-11 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                            onError={(e) => { e.target.src = "https://placehold.co"; }}
                          />
                          <div>
                            <div className="text-slate-800 font-bold text-base">{product.name}</div>
                            <div className="text-xs text-slate-400 max-w-[220px] truncate mt-0.5">{product.description || "No description provided"}</div>
                          </div>
                        </td>
                        
                        {/* فیلد دسته‌بندی کالا با بج اختصاصی */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-600">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            {product.category}
                          </span>
                        </td>
                        
                        {/* نمایش عددی قیمت کالا */}
                        <td className="py-4 px-6 text-slate-800 font-extrabold text-base">
                          <span className="inline-flex items-center">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400 -mr-0.5" />
                            {Number(product.price).toLocaleString()}
                          </span>
                        </td>
                        
                        {/* برچسب وضعیت موجودی انبار */}
                        <td className="py-4 px-6">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            product.stock === 0 
                              ? "text-red-700 bg-red-50 border border-red-100" 
                              : "text-slate-600 bg-slate-50 border border-slate-100"
                          }`}>
                            {product.stock === 0 ? "Out of stock" : `${product.stock} Units`}
                          </span>
                        </td>
                        
                        {/* اکشن‌های عملیاتی جدول */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/products/update/${product.id}`}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl transition-all duration-150"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all duration-150"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductList;
