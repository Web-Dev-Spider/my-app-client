import React from 'react'

import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout() {
    return (
        <div className='app-root'>
            <Navbar />
            <main className='page-body'>

                <Outlet />
            </main>
        </div>
    )
}

export default Layout

// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// function Layout({ children }) {

//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <div className="flex h-screen bg-theme-secondary">

//             {/* Sidebar */}
//             <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//             {/* Right Section */}
//             <div className="flex flex-col flex-1">

//                 {/* Topbar */}
//                 <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-auto p-6">

//                     {children}

//                 </main>

//             </div>

//         </div>
//     );
// }

// export default Layout;