import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../api/axios.js";
import { 
  Package, 
  FileText, 
  DollarSign, 
  Layers, 
  Image as ImageIcon, 
  Layers3, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

const AddProduct = () => {
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
  const navigate = useNavigate();

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

  const handleChanges = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form);
      setIsError(false);
      setMsg("Product added successfully");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      setIsError(true);
      setMsg(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-slate-50 px-4 antialiased py-12">
      {/* افزایش حداکثر عرض به max-w-3xl برای ایجاد فضای گرید دو ستونه */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 h-fit">
        
        {/* هدر افقی و مینی‌مال فرم با تراز دکمه بازگشت در سمت چپ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-200/60">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add New Product</h1>
            <p className="text-sm text-slate-500 mt-1.5">List a new premium item in your inventory</p>
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

        {msg && (
          <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border animate-fade-in ${
            isError ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
          }`}>
            {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ساختار گرید دو ستونه (جدولی منظم) برای تراز شدن فیلدها کنار هم */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {Object.keys(form).map((key) => {
              // فیلد توضیحات و لینک عکس به صورت تمام‌عرض (Full Row) نمایش داده می‌شوند
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

          {/* دکمه ثبت نهایی زیر بخش گرید */}
          <div className="pt-2 border-t border-slate-100 mt-6 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto min-w-[160px] bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddProduct;
