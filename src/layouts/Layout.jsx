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
