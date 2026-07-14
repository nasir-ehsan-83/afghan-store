import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Truck
} from "lucide-react";
import { api } from "../api/axios.js";

const Checkout = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);


  const [formData, setFormData] = useState({
    shippingAddress: {
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: ""
    },
    paymentMethod: "credit_card"
  });

  const [formErrors, setFormErrors] = useState({});

  const loadCart = async () => {
    if (!userId) {
      setError("User ID is missing from URL.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to checkout.");
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
          "Failed to load cart data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("shipping_")) {
      const field = name.replace("shipping_", "");
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));

      if (formErrors[`shipping_${field}`]) {
        setFormErrors(prev => ({
          ...prev,
          [`shipping_${field}`]: ""
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const { shippingAddress } = formData;

    if (!shippingAddress.fullName?.trim()) {
      errors.shipping_fullName = "Full name is required";
    }
    if (!shippingAddress.street?.trim()) {
      errors.shipping_street = "Street address is required";
    }
    if (!shippingAddress.city?.trim()) {
      errors.shipping_city = "City is required";
    }
    if (!shippingAddress.state?.trim()) {
      errors.shipping_state = "State/Province is required";
    }
    if (!shippingAddress.zipCode?.trim()) {
      errors.shipping_zipCode = "ZIP/Postal code is required";
    }
    if (!shippingAddress.country?.trim()) {
      errors.shipping_country = "Country is required";
    }
    if (!shippingAddress.phone?.trim()) {
      errors.shipping_phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(shippingAddress.phone.trim())) {
      errors.shipping_phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to place an order.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const orderData = {
        userId,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        items: cart.items,
        totalAmount: total
      };

      const res = await api.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderSuccess(true);
      setOrderId(res.data.order?._id || res.data._id || "N/A");

      // Clear cart after successful order
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error placing order", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] antialiased">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium mt-4">Preparing checkout...</p>
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

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 antialiased mt-12">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-green-100 shadow-xl shadow-green-100/30 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Order Confirmed!</h2>
          <p className="text-sm text-slate-600 mb-1">Thank you for your purchase.</p>
          <p className="text-xs text-slate-500 mb-6">
            Order ID: <span className="font-mono font-semibold text-slate-700">{orderId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate(`/orders/${userId}`)}
              className="flex-1 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 transition-all duration-200"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-200 transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => {
    const price = item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 antialiased min-h-screen bg-slate-50/30">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-6 sm:mb-8">
          Checkout
        </h1>
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-center max-w-md mx-auto mt-8 sm:mt-12">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your cart is empty</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            You need to add items to your cart before checkout.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 antialiased min-h-screen bg-slate-50/30">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate(`/cart/${userId}`)}
          className="p-2 hover:bg-white rounded-xl text-slate-600 hover:text-blue-600 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="shipping_fullName"
                    value={formData.shippingAddress.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_fullName
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_fullName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_fullName}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="shipping_street"
                    value={formData.shippingAddress.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_street
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_street && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_street}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_city
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_city && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="shipping_state"
                    value={formData.shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_state
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_state && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    name="shipping_zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_zipCode
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_zipCode && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="shipping_country"
                    value={formData.shippingAddress.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_country
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_country && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_country}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="shipping_phone"
                    value={formData.shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                      formErrors.shipping_phone
                        ? "border-red-300 focus:ring-red-100 bg-red-50"
                        : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
                    }`}
                  />
                  {formErrors.shipping_phone && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {formErrors.shipping_phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === "credit_card"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-slate-800">Credit Card</span>
                    <p className="text-xs text-slate-500 mt-0.5">Pay with Visa, Mastercard, or Amex</p>
                  </div>
                  <div className="flex gap-1 text-slate-400">
                    <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">VISA</span>
                    <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">MC</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-slate-800">PayPal</span>
                    <p className="text-xs text-slate-500 mt-0.5">Pay securely with your PayPal account</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    PayPal
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-lg shadow-slate-100/80 sticky top-4 sm:top-8">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-4 sm:mb-6 tracking-tight border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4 sm:mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => {
                  if (!item.productId) return null;
                  return (
                    <div
                      key={item.productId._id || item.productId.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <img
                        src={item.productId.imageURL}
                        alt={item.productId.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {item.productId.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-slate-800 flex-shrink-0">
                        ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-slate-600">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span className="font-semibold text-slate-800">
                    ${(total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 sm:pt-4 flex justify-between text-base sm:text-lg font-extrabold text-slate-800 mb-4 sm:mb-6">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white font-bold py-2.5 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    Place Order
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;