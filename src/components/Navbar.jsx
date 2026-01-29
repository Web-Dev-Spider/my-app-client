import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-orange-600">MyApp</h1>


                <div className="hidden md:flex gap-6">
                    <Link to="/" className="hover:text-orange-600">Home</Link>
                    <Link to="/about" className="hover:text-orange-600">About</Link>
                    <Link to="/dashboard" className="hover:text-orange-600">Dashboard</Link>
                </div>


                <div className="flex gap-3">
                    <Link to="/login" className="px-4 py-2 border border-orange-600 text-orange-600 rounded-lg">Login</Link>
                    <Link to="/register" className="px-4 py-2 bg-orange-600 text-white rounded-lg">Register</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
