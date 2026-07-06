import { 
  Link, 
  useNavigate 
} from "react-router";
import { 
  useState, 
  useEffect 
} from "react";
import { 
  ShoppingCartIcon, 
  LogOut, 
  LogIn, 
  UserPlus, 
  User, 
  ShieldCheck, 
  Menu, 
  X 
} from "lucide-react";
import { api } from "../api/axios.js";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [auth, setAuth] = useState({
    isLoggedIn: !!localStorage.getItem("accessToken"),
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    userRole: localStorage.getItem("userRole"),
  });

  const updateAuthStatus = () => {
    setAuth({
      isLoggedIn: !!localStorage.getItem("accessToken"),
      userId: localStorage.getItem("userId"),
      userName: localStorage.getItem("userName"),
      userRole: localStorage.getItem("userRole"),
    });
  };

  useEffect(() => {
    const loadCart = async () => {
      if (!auth.isLoggedIn || !auth.userId) {
        return setCartCount(0);
      }
      try {
        const res = await api.get(`/carts/${auth.userId}`);
        const total = res.data.items ? res.data.items.reduce(
          (sum, item) => sum + item.quantity, 0
        ) : 0;
        setCartCount(total);
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("authChanged", updateAuthStatus);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("authChanged", updateAuthStatus);
    };
  }, [auth.isLoggedIn, auth.userId]);

  const handleCartClick = () => {
    setIsOpen(false);
    if (!auth.isLoggedIn || !auth.userId) {
      alert("Please log in first to view your shopping cart.");
    } else {
      navigate(`/carts/${auth.userId}`);
    }
  };

  const logout = () => {
    setIsOpen(false);
    localStorage.clear();
    setCartCount(0);
    updateAuthStatus();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-md shadow-slate-100/50 px-6 py-4 sticky top-0 z-50 antialiased">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="font-extrabold text-2xl text-slate-800 tracking-tight hover:text-blue-600 transition-colors duration-200"
        >
          Afghan<span className="text-blue-600"> store</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <button
            onClick={handleCartClick}
            className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 rounded-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {!auth.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Signup
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{auth.userName || "User"}</span>
                </div>

                <span className="h-4 w-px bg-slate-200"></span>

                <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-xs font-semibold text-blue-700 capitalize">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>{auth.userRole || "customer"}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 flex items-center gap-1.5 active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 border border-slate-200 rounded-xl transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-100 flex flex-col gap-4 animate-fade-in">
          <button
            onClick={handleCartClick}
            className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 rounded-xl transition-all flex items-center justify-between px-4"
          >
            <div className="flex items-center gap-2 font-semibold text-sm">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Shopping Cart</span>
            </div>
            {cartCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {!auth.isLoggedIn ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm font-semibold bg-blue-600 text-white py-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Signup
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm px-4">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{auth.userName || "User"}</span>
                </div>
                <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md text-xs font-bold text-blue-700 capitalize">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>{auth.userRole || "customer"}</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-600 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;