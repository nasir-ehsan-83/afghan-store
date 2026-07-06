import { 
  useState, 
  useEffect 
} from "react";
import { 
  useParams, 
  useNavigate 
} from "react-router";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { api } from "../api/axios.js";

const Cart = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    if (!userId) {
      setError("User ID is missing from URL.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to view your cart.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/carts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data) {
        if (res.data.cart) {
          setCart(res.data.cart);
        } else {
          setCart(res.data);
        }
      }
    } catch (err) {
      console.error("Error loading cart", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const removeItem = async (productId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await api.delete("/carts/item/remove", {
        data: { userId, productId },
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error removing item", err);
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      await api.patch(
        "/carts/item/update",
        { userId, productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity", err);
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] antialiased">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium mt-4">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 antialiased mt-12">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center gap-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 shrink-0" />
          <h3 className="font-bold text-lg text-slate-800">Something went wrong</h3>
          <p className="text-sm font-medium text-slate-600 mb-2">{error}</p>
          <button
            onClick={loadCart}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 antialiased min-h-screen bg-slate-50/30">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-6 sm:mb-8">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center max-w-md mx-auto mt-8 sm:mt-12">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => {
              if (!item.productId) return null;
              return (
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 gap-3 sm:gap-4"
                  key={item.productId._id || item.productId.id}
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <img
                      src={item.productId.imageURL}
                      alt={item.productId.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                        {item.productId.name}
                      </h2>
                      <p className="text-sm font-semibold text-blue-600 mt-0.5 sm:mt-1">
                        ${(item.productId.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 flex-shrink-0">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId._id || item.productId.id,
                            item.quantity - 1
                          )
                        }
                        className="p-1.5 hover:bg-white hover:text-blue-600 text-slate-500 rounded-lg transition-all active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId._id || item.productId.id,
                            item.quantity + 1
                          )
                        }
                        className="p-1.5 hover:bg-white hover:text-blue-600 text-slate-500 rounded-lg transition-all active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="font-bold text-slate-800 text-sm sm:text-base min-w-[60px] sm:min-w-[80px] text-right">
                      ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        removeItem(item.productId._id || item.productId.id)
                      }
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 flex-shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 sm:space-y-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 sm:pb-3">
              Order Summary
            </h2>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="text-slate-700">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-2 sm:pt-3 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-extrabold text-lg sm:text-xl text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] text-sm sm:text-base"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;