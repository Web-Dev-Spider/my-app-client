import React from 'react'
import { NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, role } = useAuth();
    return (
        <nav className="bg-slate-200 shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 hover:text-orange-600">MyApp</h1>


                <div className="hidden md:flex gap-6">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "text-gray-800 font-semibold bg-amber-400" : "text-gray-400")}>Home</NavLink>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? "text-orange-600" : "text-blue-400")}>About</NavLink>
                    <NavLink to="/dashboard" className="hover:text-orange-600">Dashboard</NavLink>
                </div>


                <div className="flex gap-3">
                    {isAuthenticated && (<><span>role: {role}</span><NavLink to="/logout" className="px-4 py-2 border border-gray-800-600 text-gray-900-600 rounded-lg">Logout</NavLink></>)}
                    {!isAuthenticated && (<><NavLink to="/login" className="px-4 py-2 border border-gray-800-600 text-gray-900-600 rounded-lg">Login</NavLink>
                        <NavLink to="/register" className="px-4 py-2 bg-gray-500 text-white rounded-lg">Register</NavLink></>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
