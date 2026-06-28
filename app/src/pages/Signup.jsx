import { useState } from "react";
import { 
    Link, 
    useNavigate 
} from "react-router";
import { 
    User, 
    AtSign, 
    Lock, 
    AlertCircle, 
    CheckCircle2, 
    Eye, 
    EyeOff 
} from "lucide-react";
import { api } from "../api/axios.js";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [msg, setMsg] = useState("");
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleChanges = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.password !== form.confirmPassword) {
            setIsError(true);
            setMsg("Passwords do not match");
            return;
        }
        
        try {
            const response = await api.post("/users", {
                name: form.name,
                username: form.username,
                email: form.email,
                password: form.password,
                role: "ADMIN"
            });
            
            setIsError(false);
            setMsg(response.data.message || "Registration successful!");
            
            setTimeout(() => {
                navigate("/login");
            }, 1500);
            
        } catch (error) {
            setIsError(true);
            
            const serverErrors = error.response?.data?.errors;
            
            if (serverErrors && Array.isArray(serverErrors) && serverErrors.length > 0) {
                setMsg(`${serverErrors[0].field}: ${serverErrors[0].message}`);
            } else {
                setMsg(error.response?.data?.message || "An error occurred");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 antialiased">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-100 w-full max-w-md border border-slate-100">
                
                <div className="mb-10 text-center flex flex-col items-center">
                    <div className="mb-6 relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-36 h-36 text-blue-600" viewBox="0 0 100 100" fill="none" xmlns="http://w3.org">
                            <path d="M10 20 H25 L34 52 H80 C84 52, 86 54, 86 58 C86 62, 84 64, 80 64 H18 C14 64, 12 62, 12 58" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M30 26 H88 L80 52" stroke="currentColor" strokeWidth="6.5" fill="currentColor" fillOpacity="0.12" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="34" cy="80" r="8" fill="currentColor" fillOpacity="0.5"/>
                            <circle cx="70" cy="80" r="8" fill="currentColor" fillOpacity="0.5"/>
                        </svg>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-2">Get started with your premium shopping experience</p>
                </div>

                {msg && (
                    <div className={`mb-6 p-3 rounded-xl flex items-center gap-2 text-sm font-medium border animate-fade-in ${
                        isError ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                        {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        <span>{msg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative flex items-center">
                        <User className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            name="name"
                            placeholder="Full Name"
                            type="text"
                            value={form.name}
                            onChange={handleChanges}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                            required
                        />
                    </div>
                    
                    <div className="relative flex items-center">
                        <User className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            name="username"
                            placeholder="Username"
                            type="text"
                            value={form.username}
                            onChange={handleChanges}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                            required
                        />
                    </div>
                    
                    <div className="relative flex items-center">
                        <AtSign className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            name="email"
                            placeholder="Email Address"
                            type="email"
                            value={form.email}
                            onChange={handleChanges}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                            required
                        />
                    </div>
                    
                    <div className="relative flex items-center">
                        <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            name="password"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChanges}
                            className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="relative flex items-center">
                        <Lock className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input 
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChanges}
                            className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Sign Up</span>
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link 
                        to="/login" 
                        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;