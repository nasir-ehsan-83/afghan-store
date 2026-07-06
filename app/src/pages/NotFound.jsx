import { Link } from "react-router";
import { 
  Home, 
  AlertCircle 
} from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 px-3 sm:px-4 py-4 sm:py-0">
      <div className="text-center max-w-xs sm:max-w-sm md:max-w-md">
        <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
          <div className="p-3 sm:p-4 bg-red-50 rounded-full">
            <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 mb-1 sm:mb-2">
          404
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-600 mb-2 sm:mb-3 md:mb-4">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-7 md:mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all duration-200 text-sm sm:text-base"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;