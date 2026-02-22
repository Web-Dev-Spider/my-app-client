import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";

function Topbar({ collapsed, setCollapsed }) {

    return (

        <header className="
            bg-theme-primary
            border-b border-theme-color
            px-4 py-3
            flex
            justify-between
            items-center
        ">

            {/* Left */}

            <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-theme-primary"
            >

                <FaBars size={20} />

            </button>

            {/* Right */}

            <div className="flex items-center gap-3">

                <FaUserCircle
                    size={28}
                    className="text-theme-accent"
                />

                <span className="text-theme-primary">

                    Admin

                </span>

            </div>

        </header>

    );
}

export default Topbar;