import { useState } from "react";
import { 
  useNavigate, 
  Link 
} from "react-router";
import {
  User,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { api } from "../api/axios.js";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      if (res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userId", res.data.userPayload.id);
        localStorage.setItem("userName", res.data.userPayload.name);
        localStorage.setItem("userRole", res.data.userPayload.role);

        window.dispatchEvent(new Event("authChanged"));
      }

      setIsError(false);
      setMsg("Login successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setIsError(true);
      setMsg(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-3 sm:px-4 antialiased py-4 sm:py-0">
      <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-100 w-full max-w-md border border-slate-100 mx-2 sm:mx-0">
        <div className="mb-6 sm:mb-8 md:mb-10 text-center flex flex-col items-center">
          <div className="mb-4 sm:mb-5 md:mb-6 relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center">
            <svg
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 text-blue-600"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                d="M10 20 H25 L34 52 H80 C84 52, 86 54, 86 58 C86 62, 84 64, 80 64 H18 C14 64, 12 62, 12 58"
                stroke="currentColor"
                strokeWidth="6.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M30 26 H88 L80 52"
                stroke="currentColor"
                strokeWidth="6.5"
                fill="currentColor"
                fillOpacity="0.12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="34" cy="80" r="8" fill="currentColor" fillOpacity="0.5" />
              <circle cx="70" cy="80" r="8" fill="currentColor" fillOpacity="0.5" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Log In
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-2">
            Get started with your premium shopping experience
          </p>
        </div>

        {msg && (
          <div
            className={`mb-4 sm:mb-5 md:mb-6 p-2.5 sm:p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-medium border animate-fade-in ${
              isError
                ? "bg-red-50 text-red-700 border-red-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <div className="relative flex items-center">
              <User className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
              <input
                name="username"
                placeholder="Username"
                type="text"
                value={form.username}
                onChange={handleChanges}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
              <input
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChanges}
                className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            <div className="mt-1.5 sm:mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-[10px] sm:text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-1 sm:mt-2 bg-blue-600 text-white py-3 sm:py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Log In</span>
          </button>
        </form>

        <div className="mt-4 sm:mt-5 md:mt-6 text-center text-xs sm:text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;