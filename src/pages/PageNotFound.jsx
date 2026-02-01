import React from 'react'
import { Link } from 'react-router-dom'
import Home from './Home'

const PageNotFound = () => {
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <h2>404 - Page not found ⛔</h2>
            <Link to="/" className='bg-blue-400 px-4 py-2 mt-2 rounded-sm hover:bg-blue-800 hover:text-white'>Back to Home</Link>
        </div>
    )
}

export default PageNotFound
