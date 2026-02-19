import React from 'react'
import { useAuth } from '../context/AuthContext'

function Home() {

    const { isAuthenticated, user } = useAuth()
    // console.log(user)

    return (
        <div className="p-10 text-center">
            <h2 className='text-gray-700 text-3xl my-4'>{isAuthenticated ? `Welcome, ${user?.name}!` : 'back'}</h2>
            <h2 className='text-gray-700 text-2xl my-4'>You are logged in as {user?.role}</h2>
            <p className="text-gray-600 text-4xl">Let's try to simplify things</p>
        </div>
    )
}

export default Home
