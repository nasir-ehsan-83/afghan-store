import { 
  useEffect, 
  useState 
} from "react";
import { 
  useParams, 
  Link 
} from "react-router";
import { 
  Package,
  Layers, 
  Star, 
  ShoppingCart,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Truck,
  Shield,
  RefreshCw
} from "lucide-react";
import { api } from "../api/axios.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-slate-500">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-600">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            
            {/* Product Image */}
            <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-8">
              {product.imageURL ? (
                <img
                  src={product.imageURL}
                  alt={product.name}
                  className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center bg-slate-100 rounded-xl">
                  <Package className="w-20 h-20 text-slate-300" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    <Layers className="w-3 h-3" />
                    {product.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    <Star className="w-3 h-3 fill-emerald-500" />
                    4.8 (124 reviews)
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-800">
                  {product.name}
                </h1>
              </div>

              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {product.description || "No description available for this product."}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-slate-800">
                  ${Number(product.price).toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 line-through">
                  ${(Number(product.price) * 1.2).toFixed(2)}
                </div>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Save 20%
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    Stock: <span className="font-bold text-slate-800">{product.stock}</span>
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "bg-red-50 text-red-700"
                }`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">30 Days Return</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">Premium Quality</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]"
                    : "bg-slate-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;