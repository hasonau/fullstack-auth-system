import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { assets } from '../assets/assets.js';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, userData, setUserData, setIsLoggedIn, backendURI } = React.useContext(AppContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownTimer, setDropdownTimer] = useState(null);

    const handleLogout = async () => {
        const { data } = await axios.post(`${backendURI}/api/v1/auth/logout`, {}, { withCredentials: true });
        data.success && (setUserData(null), setIsLoggedIn(false), setShowDropdown(false));
        navigate('/');
    };
    const handleVerifyEmail = async () => {
        try {
            const { data } = await axios.post(`${backendURI}/api/v1/auth/send-verify-otp`, {}, { withCredentials: true });
            if (data.success) {
                // Handle successful email verification
                navigate('/email-verify');
                toast.success(data.message);
            }
            else {
                toast.error("error in else of success" + data.message);
            }
        } catch (error) {
            toast.error("error in catch " + error.message);
        }
    };

    const handleMouseEnter = () => {
        if (dropdownTimer) {
            clearTimeout(dropdownTimer);
            setDropdownTimer(null);
        }
        setShowDropdown(true);
    };

    const handleMouseLeave = () => {
        const timer = setTimeout(() => {
            setShowDropdown(false);
        }, 200); // 200ms delay before hiding
        setDropdownTimer(timer);
    };

    // Loading state
    if (isLoggedIn === undefined) {
        return (
            <header className="fixed top-4 left-0 right-0 z-50 w-full flex justify-center">
                <div className="flex items-center justify-between w-full max-w-md border border-border bg-background text-foreground rounded-full p-2 px-4 shadow-sm">
                    <a href="#" className="flex items-center space-x-2 text-sm font-medium hover:text-foreground/80 transition-colors">
                        <img
                            onClick={() => navigate("/")}
                            src={assets.logo}
                            alt="Logo"
                            className="h-10 w-16 cursor-pointer"
                        />
                    </a>
                    <div className="h-6 w-px bg-border"></div>
                    <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-4 left-0 right-0 z-50 w-full flex justify-center">
            <div className="flex items-center justify-between w-full max-w-md border border-border bg-background text-foreground rounded-full p-2 px-4 shadow-sm">

                {/* Logo */}
                <a
                    href="#"
                    className="flex items-center space-x-2 text-sm font-medium hover:text-foreground/80 transition-colors"
                >
                    <img
                        onClick={() => navigate("/")}
                        src={assets.logo}
                        alt="Logo"
                        className="h-10 w-16 cursor-pointer"
                    />
                </a>

                <div className="h-6 w-px bg-border"></div>

                {/* User / Sign up */}
                {isLoggedIn && userData ? (
                    <div className="relative">
                        {/* Avatar */}
                        <div
                            className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:bg-primary/90 transition-colors"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {userData.name?.charAt(0).toUpperCase()}
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (
                            <div
                                className="absolute right-0 top-10 bg-background border border-border rounded-lg shadow-lg py-2 w-48 z-60"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {!userData.isAccountVerified && (
                                    <button
                                        onClick={handleVerifyEmail}
                                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary hover:text-secondary-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none transition-colors flex items-center space-x-2 rounded-md cursor-pointer"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                        </svg>
                                        <span>Verify Email</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive/90 focus:text-destructive-foreground focus:outline-none transition-colors flex items-center space-x-2 rounded-md cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                                            clipRule="evenodd"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-full hover:bg-primary/90 transition-colors flex items-center space-x-1 whitespace-nowrap cursor-pointer"
                    >
                        <span>Sign up</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 ml-1"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 10a.75.75 0 0 1 .75-.75h10.641L10.23 5.47a.75.75 0 0 1 1.04-1.04l5.25 5.25a.75.75 0 0 1 0 1.04l-5.25 5.25a.75.75 0 1 1-1.04-1.04l4.16-4.16H3.75A.75.75 0 0 1 3 10Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;