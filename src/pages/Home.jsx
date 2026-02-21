import React from 'react'
import { useAuth } from '../context/AuthContext'

function Home() {

    const { user } = useAuth()
    // console.log(user)

    return (
        <div className="p-10 text-center">
            <h2 className="text-gray-700 text-3xl my-4">
                Welcome{user?.name && `, ${user.name}`} 👋
            </h2>

            <h2 className='text-gray-700 text-2xl my-4'>You are logged in as {user?.role}</h2>
            <p className="text-gray-600 text-4xl">Let's try to simplify things</p>

            <h3 className='text-green-700 font-bold text-2xl my-4 animate-pulse'>Only managing users </h3>
            <h3 className='text-green-700 font-bold text-2xl my-4 animate-pulse'>Kyc pdf creation are implemented.</h3>

            <div className='flex justify-center items-center '>

                <h4 className='text-red-700 bg-yellow-500 px-4 py-2 rounded-lg font-bold text-2xl my-4 animate-pulse'>All other features are on progress!!! </h4>
            </div>
        </div>
    )
}

export default Home
