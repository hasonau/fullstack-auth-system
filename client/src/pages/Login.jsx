import React, { useContext, useState } from "react";
import { AppContext } from '../context/AppContext.jsx'
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Auth() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === "/login";
    const { backendURI, setIsLoggedIn, setUserData, getUserData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.defaults.withCredentials = true;
        try {
            if (isLogin) {
                const { data } = await axios.post(`${backendURI}/api/v1/auth/login`, {
                    email: formData.email,
                    password: formData.password,
                });
                if (data.success) {
                    setIsLoggedIn(true);
                    setUserData(data.data.user); // directly set user data
                    navigate("/"); // now Home will immediately see correct data
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendURI}/api/v1/auth/register`, {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                });
                if (data.success) {
                    setIsLoggedIn(true);
                    setUserData(data.data.user); // directly set user data
                    navigate("/"); // Home sees correct data
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error("Auth error (full):", error);
            if (error.response) {
                toast.error(error.response.data?.message || "Server error");
            } else if (error.request) {
                toast.error("No response from server. Please check backend.");
            } else {
                toast.error("Something went wrong on client side. Check console.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    const toggleMode = () => {
        navigate(isLogin ? "/signup" : "/login");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Auth card */}
            <div className="relative z-10 bg-card text-card-foreground rounded-2xl shadow-lg max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                {/* Image Side */}
                <div className="hidden md:block">
                    <img
                        src={
                            isLogin
                                ? "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
                                : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                        }
                        alt="Auth illustration"
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Form Side */}
                <div className="p-8 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                        {isLogin ? "Get Started" : "Sign Up"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="relative mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2 text-foreground"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your full name"
                                    className="w-full px-4 py-3 border border-border rounded-xl bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                                />
                            </div>
                        )}

                        <div className="relative mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-2 text-foreground"
                            >
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-3 border border-border rounded-xl bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                            />
                        </div>

                        <div className="relative mb-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-2 text-foreground"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-border rounded-xl bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                            />
                        </div>

                        {/* Forgot password link only in login */}
                        {isLogin && (
                            <div className="text-right mb-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/reset-password")}
                                    className="text-sm text-primary hover:text-primary/80 font-medium cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isLogin ? "Logging in..." : "Signing up..."}
                                </>
                            ) : (
                                isLogin ? "Login" : "Sign Up"
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={toggleMode}
                            className="text-primary hover:text-primary/80 font-medium cursor-pointer"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;