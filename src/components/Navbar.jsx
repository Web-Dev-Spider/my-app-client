import React, { useState } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `font-medium text-sm tracking-wide transition-colors duration-200 ${isActive
            ? "text-[#312525] border-b-2 border-[#8a7b70]"
            : "text-[#594c41] hover:text-[#312525]"
        }`;

    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
    };

    return (
        <nav className="bg-[#ebe9e7] shadow-sm border-b border-[#8a7b70] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <NavLink to="/" className="text-2xl font-serif font-bold text-[#312525] hover:text-[#594c41] tracking-tight">
                            D-Friend
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink to="/" className={linkClass}>Home</NavLink>
                        <NavLink to="/about" className={linkClass}>About</NavLink>
                        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                        <NavLink to="/kyc" className={linkClass}>Create KYKC</NavLink>
                    </div>

                    {/* Right Side: Auth / Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-[#312525] hover:text-[#594c41] focus:outline-none transition-colors"
                                >
                                    <FaUserCircle size={28} className="text-[#8a7b70]" />
                                    <span className="font-medium text-sm">{user?.role || 'User'}</span>
                                    <FaChevronDown size={12} className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[#f5f4f3] rounded-md shadow-lg py-1 border border-[#d6d3d0] ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 border-b border-[#e0dedb]">
                                            <p className="text-xs text-[#8a7b70]">Signed in as</p>
                                            <p className="text-sm font-semibold text-[#312525] truncate">{user?.email || user?.role}</p>
                                        </div>
                                        <NavLink
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-[#594c41] hover:bg-[#e0dedb] hover:text-[#312525]"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Your Profile
                                        </NavLink>
                                        <NavLink
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-[#594c41] hover:bg-[#e0dedb] hover:text-[#312525]"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Settings
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-[#594c41] hover:bg-[#e0dedb] hover:text-[#312525]"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <NavLink
                                    to="/login"
                                    className="text-[#594c41] hover:text-[#312525] font-medium text-sm transition-colors"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="px-4 py-2 rounded-md bg-[#594c41] text-[#ebe9e7] text-sm font-medium hover:bg-[#312525] transition-colors shadow-sm"
                                >
                                    Register
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[#312525] hover:text-[#594c41] focus:outline-none p-2 rounded-md hover:bg-[#e0dedb] transition-colors"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#f5f4f3] border-b border-[#8a7b70]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-[#594c41] hover:text-[#312525] hover:bg-[#e0dedb]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-[#594c41] hover:text-[#312525] hover:bg-[#e0dedb]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium text-[#594c41] hover:text-[#312525] hover:bg-[#e0dedb]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/kyc"
                            className="block px-3 py-2 rounded-md text-base font-medium text-[#594c41] hover:text-[#312525] hover:bg-[#e0dedb]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Create KYKC
                        </NavLink>
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="pt-4 pb-4 border-t border-[#d6d3d0]">
                        {isAuthenticated ? (
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <FaUserCircle size={30} className="text-[#8a7b70]" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-[#312525]">{user?.role}</div>
                                    <div className="text-sm font-medium text-[#8a7b70]">{user?.email}</div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="ml-auto bg-[#e0dedb] flex-shrink-0 p-1 rounded-full text-[#594c41] hover:text-[#312525] focus:outline-none"
                                >
                                    <span className="px-3 py-1 text-xs font-semibold">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1 px-2">
                                <NavLink
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-[#594c41] hover:text-[#312525] hover:bg-[#e0dedb]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-[#594c41] hover:text-[#312525] hover:bg-[#e0dedb]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Register
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;