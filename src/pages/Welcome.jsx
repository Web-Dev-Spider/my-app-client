import React from 'react'
import { useAuth } from '../context/AuthContext'

function Welcome() {
    const { isAuthenticated, user, agency } = useAuth()
    // console.log("agency : ", agency)
    return (
        <div>
            <h3 className='text-4xl text-red-500'>Agency: {agency?.name}</h3>
            <h1 className='text-9xl text-green-600'>Welcome {isAuthenticated ? <span className='text-amber-300'>  {user?.role}</span> : <span >Guest</span>}</h1>
        </div>
    )
}

export default Welcome
