import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaBox,
    FaTruck,
    FaUsers,
    FaFileAlt,
    FaCog
} from "react-icons/fa";

function Sidebar({ collapsed }) {

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
            ? "bg-theme-accent text-white"
            : "text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary"
        }`;

    return (

        <div className={`
            ${collapsed ? "w-16" : "w-64"}
            bg-theme-primary
            border-r border-theme-color
            transition-all duration-300
        `}>

            {/* Logo */}

            <div className="p-4 border-b border-theme-color">

                <h1 className="text-theme-primary font-bold text-lg">

                    {collapsed ? "D" : "D-Friend ERP"}

                </h1>

            </div>

            {/* Menu */}

            <nav className="p-3 space-y-2">

                <NavLink to="/" className={linkClass}>
                    <FaHome />
                    {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink to="/customers" className={linkClass}>
                    <FaUsers />
                    {!collapsed && "Customers"}
                </NavLink>

                <NavLink to="/inventory/dashboard" className={linkClass}>
                    <FaBox />
                    {!collapsed && "Inventory"}
                </NavLink>

                <NavLink to="/deliveries/open" className={linkClass}>
                    <FaTruck />
                    {!collapsed && "Deliveries"}
                </NavLink>

                <NavLink to="/documents" className={linkClass}>
                    <FaFileAlt />
                    {!collapsed && "Documents"}
                </NavLink>

                <NavLink to="/settings" className={linkClass}>
                    <FaCog />
                    {!collapsed && "Settings"}
                </NavLink>

            </nav>

        </div>
    );
}

export default Sidebar;