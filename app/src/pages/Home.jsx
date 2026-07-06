import { 
  useState, 
  useEffect 
} from "react";
import { Link } from "react-router";
import { api } from "../api/axios.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/products?search=${search}&category=${category}`);
      
      let productsData = [];
      if (res.data && res.data.products && Array.isArray(res.data.products)) {
        productsData = res.data.products;
      } else if (res.data && Array.isArray(res.data)) {
        productsData = res.data;
      } else {
        productsData = [];
      }
      
      setProducts(productsData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Products</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Discover our amazing collection</p>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white min-w-[140px] sm:min-w-[180px] text-sm sm:text-base"
        >
          <option value="">All Categories</option>
          <option value="Desktop">Desktop</option>
          <option value="Laptop">Laptop</option>
          <option value="Mobile">Mobile</option>
          <option value="Tablet">Tablet</option>
          <option value="TV">TV</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-500 mt-2 text-sm">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-red-200 mb-4 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-slate-400 text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 bg-white"
                >
                  <div className="aspect-square bg-slate-50 rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3">
                    <img
                      src={product.imageURL}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='20'%3E📷%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <h2 className="font-semibold text-slate-800 text-sm sm:text-base sm:text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                  </h2>
                  <p className="text-blue-600 font-bold text-base sm:text-xl mt-0.5 sm:mt-1">
                    ${Number(product.price).toLocaleString()}
                  </p>
                  {product.category && (
                    <span className="inline-block mt-1.5 sm:mt-2 text-[10px] sm:text-xs bg-slate-100 text-slate-600 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-400">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default Home;