import React from 'react'
import { useAuth } from '../context/AuthContext'

function Home() {

    const { isAuthenticated, user } = useAuth()

    return (
        <div className="p-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Home Page {user?.username}</h2>
            <p>{isAuthenticated ? `Welcome, ${user?.username}!` : 'You are not logged in.'}</p>
            <p className="text-gray-600">React Router v6 with Tailwind CSS</p>
        </div>
    )
}

export default Home
