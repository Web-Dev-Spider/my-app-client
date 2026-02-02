import React from 'react'
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

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
            </div>
        </nav>
    );
}

export default Navbar;
