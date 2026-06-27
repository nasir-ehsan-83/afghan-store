import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { api } from "../api/axios.js";
import { 
  Package, 
  FileText, 
  DollarSign, 
  Layers, 
  Image as ImageIcon, 
  Layers3, 
  Edit, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft,
  Loader2
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams(); // اصلاح باگ: فراخوانی به صورت تابع ()
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageURL: "",
    description: ""
  });
  
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fieldLabels = {
    name: "Product Name",
    category: "Category",
    price: "Price (USD)",
    stock: "Stock Quantity",
    imageURL: "Image URL",
    description: "Product Description"
  };

  const icons = {
    name: <Package className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />,
    category: <Layers className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />,
    price: <DollarSign className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />,
    stock: <Layers3 className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />,
    imageURL: <ImageIcon className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />,
    description: <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
  };

  // لود کردن دیتای کالا به صورت مستقیم و بهینه از بک‌اَند
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const product = res.data;
        
        setForm({
          name: product.name || "",
          category: product.category || "",
          price: product.price || "",
          stock: product.stock !== undefined ? product.stock : "",
          imageURL: product.imageURL || "",
          description: product.description || ""
        });
        setError("");
      } catch (err) {
        setIsError(true);
        setMsg(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleChanges = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/products/${id}`, form);
      setIsError(false);
      setMsg("Product updated successfully!");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      setIsError(true);
      setMsg(err.response?.data?.message || "Failed to update product");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-50 px-4 antialiased py-12">
      {/* عرض بزرگ تعمیم‌یافته به صورت گرید منظم دو ستونه */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 h-fit">
        
        {/* هدر افقی با دکمه بازگشت مینی‌مال سمت راست */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200/60">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Edit Product</h1>
            <p className="text-sm text-slate-500 mt-1.5">Modify the specifications of this inventory item</p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/admin/products" 
              className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-blue-600 transition-all text-sm bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>

        {/* لایه وضعیت انتظار لود شدن دیتای قبلی */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Fetching product data from server...</span>
          </div>
        ) : (
          <>
            {msg && (
              <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border animate-fade-in ${
                isError ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}>
                {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{msg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* گرید بندی جدولی برای تراز فیلدها دقیقا مشابه با فرم ساخت */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {Object.keys(form).map((key) => {
                  const isFullWidth = key === "description" || key === "imageURL";
                  
                  return (
                    <div key={key} className={isFullWidth ? "sm:col-span-2" : "col-span-1"}>
                      <div className="relative flex items-center">
                        {icons[key]}
                        
                        {key === "description" ? (
                          <textarea
                            name={key}
                            placeholder={fieldLabels[key]}
                            value={form[key]}
                            onChange={handleChanges}
                            rows={4}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none font-medium"
                            required
                          />
                        ) : (
                          <input
                            name={key}
                            placeholder={fieldLabels[key]}
                            type={key === "price" || key === "stock" ? "number" : "text"}
                            value={form[key]}
                            onChange={handleChanges}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                            required={key !== "stock"}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* دکمه به‌روزرسانی هماهنگ با استایل آیکون مینی‌مال */}
              <div className="pt-2 border-t border-slate-100 mt-6 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-w-[160px] bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  <span>Update Product</span>
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default EditProduct;
