import { useState, useEffect } from "react";
import { Link } from "react-router";
import { api } from "../api/axios.js";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSchearch] = useState("");
    const [category, setCategory] = useState("");

    const loadProducts = async () => {
        const res = await api.get(`/products?search=${search}&category=${category}`);
        setProducts(res.data);
    };

    useEffect(() => {
        loadProducts();
    }, [search, category]);

    return (
        <div className = "p-6">
            <div className = "mb-4 flex gap-3">
                <input 
                    type = "text"
                    placeholder = "search product..."
                    vlaue = { search }
                    onChange = { (e) => setSchearch(e.target.value) }
                    className = "border px-3 py-2 rounded w-1/2"
                />

                <select 
                    value = { category }
                    onChange = { (e) => setCategory(e.target.value) }
                    className = "border px-4 py-2 rounded"
                >
                    <option value = "">All Categories</option>
                    <option value = "Desktop">Desktop</option>
                    <option value = "Laptop">Laptop</option>
                    <option value = "Mobile">Mobile</option>
                    <option value = "Tablet">Tablet</option>
                    <option value = "TV">TV</option>
                </select>
            </div>
            <div className = "grid grid-cols-2 md:grid-cols4 gap-5">
                {
                    products.map((product) => (
                        <Link
                            key = { product._id }
                            to = { `/products/${product._id}`}
                            className = "border p-3 rounded shadow hover:shadow-lg transition"
                        >
                            <img 
                                src = { product.imageURL}
                                alt = { product.name }
                                className = "w-full h-40 object-contain bg-white rounded"
                            />
                            <h2 classname = "mt-2 font-semibolde text-lg">{ product.name }</h2>
                            <p className = "text-gray-600">${ product.price}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    );
};

export default Home;