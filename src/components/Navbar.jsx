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
            ? "text-theme-primary border-b-2 border-theme-accent"
            : "text-theme-secondary hover:text-theme-primary"
        }`;

    const handleLogout = () => {
        setIsProfileOpen(false);
        logout();
    };

    return (
        <nav className="bg-theme-primary shadow-sm border-b border-theme-color sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <NavLink to="/" className="text-2xl font-serif font-bold text-theme-primary hover:text-theme-secondary tracking-tight transition-transform duration-200 hover:scale-105">
                            D-Friend
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <NavLink to="/" className={linkClass}>Home</NavLink>
                        <NavLink to="/about" className={linkClass}>About</NavLink>
                        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>

                        {/* Documents Dropdown */}
                        <div className="relative group">
                            <button
                                className="px-3 py-2 rounded-md font-medium text-sm tracking-wide text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary hover:shadow-sm flex items-center space-x-1 focus:outline-none transition-all duration-200"
                            >
                                <span>Documents</span>
                                <FaChevronDown size={10} className="transform group-hover:rotate-180 transition-transform duration-200" />
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-theme-secondary rounded-md shadow-lg py-1 border border-theme-color ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
                                <NavLink
                                    to="/kyc"
                                    className="block px-4 py-2 text-sm text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
                                >
                                    Create KYC
                                </NavLink>
                                <NavLink
                                    to="/sv-loss"
                                    className="block px-4 py-2 text-sm text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
                                >
                                    SV Loss
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Auth / Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-theme-primary hover:text-theme-secondary focus:outline-none transition-colors px-2 py-1 rounded-md hover:bg-theme-tertiary"
                                >
                                    <FaUserCircle size={28} className="text-theme-accent" />
                                    <span className="font-medium text-sm">{user?.role || 'User'}</span>
                                    <FaChevronDown size={12} className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-theme-secondary rounded-md shadow-lg py-1 border border-theme-color ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="px-4 py-2 border-b border-theme-color">
                                            <p className="text-xs text-theme-secondary">Signed in as</p>
                                            <p className="text-sm font-semibold text-theme-primary truncate">{user?.email || user?.role}</p>
                                        </div>
                                        <NavLink
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Your Profile
                                        </NavLink>
                                        <NavLink
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Settings
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
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
                                    className="text-theme-secondary hover:text-theme-primary font-medium text-sm transition-colors px-3 py-2 rounded-md hover:bg-theme-tertiary"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="px-4 py-2 rounded-md bg-theme-accent text-theme-primary text-sm font-medium hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                                    style={{ color: 'var(--bg-primary)' }} // Ensure text contrast
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
                            className="text-theme-primary hover:text-theme-secondary focus:outline-none p-2 rounded-md hover:bg-theme-tertiary transition-colors"
                        >
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-theme-secondary border-b border-theme-color transition-colors duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>

                        {/* Mobile Documents Section */}
                        <div className="px-3 py-2">
                            <span className="block text-sm font-semibold text-theme-secondary mb-2 uppercase tracking-wider">Documents</span>
                            <NavLink
                                to="/kyc"
                                className="block pl-4 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary border-l-2 border-theme-color hover:border-theme-accent transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Create KYC
                            </NavLink>
                            <NavLink
                                to="/sv-loss"
                                className="block pl-4 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary border-l-2 border-theme-color hover:border-theme-accent transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                SV Loss
                            </NavLink>
                        </div>

                        <NavLink
                            to="/settings"
                            className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Settings
                        </NavLink>
                    </div>

                    {/* Mobile Auth Section */}
                    <div className="pt-4 pb-4 border-t border-theme-color">
                        {isAuthenticated ? (
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <FaUserCircle size={30} className="text-theme-accent" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-theme-primary">{user?.role}</div>
                                    <div className="text-sm font-medium text-theme-secondary">{user?.email}</div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="ml-auto bg-theme-tertiary flex-shrink-0 p-1 rounded-full text-theme-secondary hover:text-theme-primary focus:outline-none transition-colors"
                                >
                                    <span className="px-3 py-1 text-xs font-semibold">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-1 px-2">
                                <NavLink
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary transition-colors"
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