import { useState } from "react";
import { api } from "../api/axios.js";

const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const [msg, setMsg] = useState("");

    const handleChanges = () => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/users", form);
            setMsg(response.data.message);
            
        } catch (error) {
            setMsg(error.response?.data?.message || "An error occured");
        }
    };

    return (
        <div className = "flex item-center justify-center min-h-screen bg-bray-100 px-4">
            <div className = "bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className = "text-2-xl font-bold mb-6 text-center"> Create Account </h2>
                {msg && (
                    <div className = "mb-4 text-center text-sm text-blue-600 font-medium">
                        {msg}
                    </div>
                )}

                <form onSubmit = {handleSubmit} className = "space-y-4">
                    // name field
                    <input 
                        name = "name"
                        placeholder = "name"
                        type = "text"
                        value = {form.name}
                        onChange = {handleChanges}
                        className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                        required
                    />
                    // username field
                    <input 
                        name = "username"
                        placeholder = "username"
                        type = "text"
                        value = {form.username}
                        onChange = {handleChanges}
                        className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                        required
                    />
                    // email field
                    <input 
                        name = "email"
                        placeholder = "email"
                        type = "email"
                        value = {form.email}
                        onChange = {handleChanges}
                        className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                        required
                    />
                    // password field
                    <input 
                        name = "password"
                        placeholder = "password"
                        type = "password"
                        value = {form.password}
                        onChange = {handleChanges}
                        className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                        required
                    />
                    <botton
                        type = "submit"
                        className = "w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Sign Up
                    </botton>
                </form>
            </div>
        </div>
    );
};
export default Signup;