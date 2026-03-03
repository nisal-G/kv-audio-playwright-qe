import { Link, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaHome, FaPhone, FaImages, FaBox, FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function MobileNavPannel(props) {

    const isOpen = props.isOpen;
    const setOpen = props.setOpen;
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");
            setIsAuthenticated(!!token);
            setUserEmail(email || "");
        };

        // Check on mount and when panel opens
        checkAuth();

        // Listen for storage changes
        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, [isOpen]);

    // Extract first name from email (before @)
    const getUserDisplayName = () => {
        if (!userEmail) return "";
        const name = userEmail.split("@")[0];
        // Capitalize first letter and replace dots/underscores with spaces
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, " ");
    };

    const navLinks = [
        { to: "/home", label: "Home", icon: <FaHome /> },
        { to: "/about", label: "About Us", icon: <FaInfoCircle /> },
        { to: "/contact", label: "Contact", icon: <FaPhone /> },
        { to: "/items", label: "Items", icon: <FaBox /> },
        { to: "/booking", label: "Cart", icon: <FaShoppingCart /> }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 bg-black/90 backdrop-blur-2xl transition-all duration-400 z-40 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setOpen(false)}
            />

            {/* Navigation Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-[60] transform transition-all duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header Section */}
                <div className="relative flex items-center justify-between px-6 py-5 bg-white border-b-2 border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="relative">
                            <img
                                src="/KV_Audio_Logo.png"
                                alt="KV Audio"
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                            />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight leading-tight">KV Audio</h2>
                            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-0.5">Premium Equipment</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
                        aria-label="Close menu"
                    >
                        <IoClose size={22} className="stroke-[0.5]" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col px-4 py-6 gap-1.5 bg-white">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive(link.to)
                                ? 'bg-gradient-to-r from-accent to-accent/95 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                }`}
                        >
                            <span className={`text-[19px] transition-all duration-200 ${isActive(link.to)
                                ? 'text-white'
                                : 'text-gray-600 group-hover:text-accent'
                                }`}>
                                {link.icon}
                            </span>

                            <span className={`text-[15px] font-medium tracking-tight ${isActive(link.to)
                                ? 'text-white'
                                : 'text-gray-900'
                                }`}>
                                {link.label}
                            </span>

                            {/* Active indicator */}
                            {isActive(link.to) && (
                                <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Auth Section */}
                <div className="px-4 pb-6 bg-white">
                    {isAuthenticated ? (
                        // User Profile Card with Logout (if logged in)
                        <div className="relative flex flex-col gap-4 px-4 py-4 bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-gray-200 rounded-2xl shadow-sm">
                            {/* User Info Section */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-lg">
                                        {getUserDisplayName().charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 font-semibold text-sm truncate">
                                        {getUserDisplayName()}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">
                                        {userEmail}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-200"></div>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("email");
                                    window.location.href = "/login";
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-700 hover:text-red-600 bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 rounded-lg transition-all duration-200 active:scale-95 group shadow-sm"
                            >
                                <IoLogOutOutline className="text-lg group-hover:rotate-6 transition-transform duration-200" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    ) : (
                        // Login Button (if not logged in)
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="relative flex items-center justify-center gap-2.5 px-4 py-3.5 text-white bg-gradient-to-r from-accent to-accent/95 hover:from-accent/95 hover:to-accent rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group overflow-hidden"
                        >
                            {/* Subtle shine effect */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>

                            <svg className="w-[18px] h-[18px] relative z-10 group-hover:scale-105 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-[15px] font-semibold relative z-10 tracking-tight">Login</span>
                        </Link>
                    )}
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 w-full px-4 py-5 border-t-2 border-gray-200 bg-gradient-to-b from-white to-slate-50">
                    <div className="text-center space-y-1">
                        <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                            PROFESSIONAL AUDIO EQUIPMENT
                        </p>
                        <p className="text-[10px] text-gray-400">
                            © 2026 KV Audio. All rights reserved.
                        </p>
                    </div>

                    {/* Decorative indicator */}
                    <div className="flex justify-center gap-1 mt-3">
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        <div className="w-1 h-1 rounded-full bg-accent"></div>
                    </div>
                </div>
            </div>
        </>
    )
}


