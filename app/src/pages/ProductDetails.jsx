import { 
  useState, 
  useEffect 
} from "react";
import { 
  useParams, 
  Link 
} from "react-router";
import {
  ArrowLeft,
  ShoppingCart,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  Star,
  Package
} from "lucide-react";
import { api } from "../api/axios.js";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  //const [isWishlist, setIsWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  //const [relatedProducts, setRelatedProducts] = useState([]);

  const loadProductAndRelated = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/products/");
      const allProducts = res.data;

      const p = allProducts.find(
        (item) => String(item.id) === String(id) || String(item._id) === String(id)
      );

      if (!p) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      setProduct(p);
      setCurrentImageIndex(0);

      const related = allProducts.filter(
        (item) =>
          item.category === p.category &&
          String(item._id) !== String(p._id) &&
          String(item.id) !== String(p.id)
      );
      setRelatedProducts(related.slice(0, 4));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load product");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductAndRelated();
  }, [id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeImageModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const getStatus = (stock) => {
    if (stock === 0) {
      return { label: "Out of Stock", color: "text-red-600 bg-red-50 border-red-200" };
    }
    if (stock < 10) {
      return { label: "Low Stock", color: "text-amber-600 bg-amber-50 border-amber-200" };
    }
    return { label: "In Stock", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  };

  const handleQuantityChange = (action) => {
    if (action === 'increment' && quantity < (product?.stock || 10)) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      setAddedToCart(true);
      const res = await api.post("/carts/add", {
        userId,
        productId: product._id || product.id,
        quantity
      });

      if (res.data && res.data.items) {
        const totalItems = res.data.items.reduce(
          (sum, item) => sum + item.quantity, 0
        );
        localStorage.setItem("CartCount", totalItems);
      }

      window.dispatchEvent(new Event("cartUpdated"));
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert(err.response?.data?.message || "Something went wrong while adding to cart");
      setAddedToCart(false);
    }
  };

  const openImageModal = () => {
    setIsZoomed(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageModal = () => {
    setIsZoomed(false);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-3 sm:px-4 antialiased">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3 sm:gap-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600" />
          <p className="text-xs sm:text-sm font-medium text-slate-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-3 sm:px-4 antialiased py-4 sm:py-8">
        <div className="w-full max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 sm:mb-6 transition-colors text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <div className="bg-red-50 text-red-700 p-4 sm:p-6 rounded-2xl border border-red-100 flex items-center gap-3 text-sm sm:text-base">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const status = getStatus(product.stock);
  const images = product.images && product.images.length > 0 ? product.images : [product.imageURL];

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-3 sm:px-4 antialiased py-4 sm:py-8">
      <div className="w-full max-w-7xl">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-slate-500 hover:text-slate-700 transition-colors group text-sm sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Back to Products</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden mb-8 sm:mb-12 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="bg-slate-50/50 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div className="relative">
                <div
                  className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-inner border border-slate-200/50 group cursor-zoom-in"
                  onClick={openImageModal}
                >
                  <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                      <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" /> Click to zoom
                    </div>
                  </div>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl shadow-md border border-slate-200 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl shadow-md border border-slate-200 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 overflow-x-auto pb-2 justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl border-2 p-1.5 sm:p-2 bg-white transition-all flex-shrink-0 ${
                        currentImageIndex === idx
                          ? "border-blue-600 shadow-md shadow-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span
                    className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border ${status.color}`}
                  >
                    {status.label}
                  </span>
                  <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3 sm:mb-4">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-bold border border-amber-100">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
                    <span>{product.rating || "4.5"}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium">|</span>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    {product.stock} items available
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 sm:mb-8">
                  {product.description}
                </p>

                <div className="border-t border-slate-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
                  <div className="flex items-end gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-base sm:text-lg text-slate-400 line-through">
                        ${product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>

                {product.stock > 0 && (
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-1 bg-slate-50 rounded-xl border border-slate-200 p-1">
                      <button
                        onClick={() => handleQuantityChange('decrement')}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <span className="w-8 sm:w-12 text-center font-semibold text-slate-800 text-sm sm:text-base">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange('increment')}
                        className="p-1.5 sm:p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {product.stock > 0 && (
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 active:scale-[0.99] ${
                      addedToCart
                        ? "bg-emerald-600 text-white shadow-emerald-100"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 hover:shadow-blue-200"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeImageModal}
                className="absolute -top-10 sm:-top-14 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-xl sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;