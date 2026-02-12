import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `font-medium transition ${isActive
            ? "text-[#312525]"
            : "text-[#594c41] hover:text-[#312525]"
        }`;

    return (
        <nav className="bg-[#ebe9e7] shadow-md border-b border-[#8a7b70]">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                <h1 className="text-2xl font-bold text-[#312525] hover:text-[#594c41]">
                    MyApp
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6">
                    <NavLink to="/" className={linkClass}>Home</NavLink>
                    <NavLink to="/about" className={linkClass}>About</NavLink>
                    <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                    <NavLink to="/kyc" className={linkClass}>Create KYKC</NavLink>
                </div>

                {/* Right side */}
                <div className="flex gap-3 items-center">

                    {isAuthenticated ? (
                        <>
                            <span className="text-[#594c41]">
                                Hello {user?.role}
                            </span>

                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-lg
                                           border border-[#8a7b70]
                                           text-[#312525]
                                           hover:bg-[#ddd8d5]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="px-4 py-2 rounded-lg
                                           border border-[#8a7b70]
                                           text-[#312525]
                                           hover:bg-[#ddd8d5]"
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="px-4 py-2 rounded-lg
                                           bg-[#594c41]
                                           text-[#ebe9e7]
                                           hover:bg-[#312525]"
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
                        className="text-[#312525] hover:text-[#594c41]"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#ddd8d5]
                                px-4 pt-2 pb-4 space-y-2
                                border-t border-[#8a7b70]">

                    <NavLink
                        to="/"
                        className="block py-2 font-medium text-[#594c41] hover:text-[#312525]"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/about"
                        className="block py-2 font-medium text-[#594c41] hover:text-[#312525]"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        About
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className="block py-2 font-medium text-[#594c41] hover:text-[#312525]"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/kyc"
                        className="block py-2 font-medium text-[#594c41] hover:text-[#312525]"
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