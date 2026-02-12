import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-slate-200 shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 hover:text-orange-600">
                    MyApp
                </h1>

                <div className="hidden md:flex gap-6">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/kyc">Create KYKC</NavLink>
                </div>

                <div className="flex gap-3 items-center">
                    {isAuthenticated ? (
                        <>
                            <span>Hello {user?.role}</span>
                            <button
                                onClick={logout}
                                className="px-4 py-2 border border-gray-800 text-gray-900 rounded-lg"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="px-4 py-2 border border-gray-800 text-gray-900 rounded-lg"
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-800 hover:text-orange-600 focus:outline-none"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-200 px-4 pt-2 pb-4 space-y-2 border-t border-gray-300 shadow-lg">
                    <NavLink
                        to="/"
                        className="block py-2 text-gray-800 hover:text-orange-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className="block py-2 text-gray-800 hover:text-orange-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className="block py-2 text-gray-800 hover:text-orange-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/kyc"
                        className="block py-2 text-gray-800 hover:text-orange-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Create KYKC
                    </NavLink>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
