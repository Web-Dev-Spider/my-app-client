import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()
    const handleLogin = () => {
        navigate('/login')
    }
    return (
        <div>
            <h2 className='text-6xl text-slate-500'>Home Page!!!!</h2>
            <button className='bg-amber-500 p-2' onClick={handleLogin}>Login</button>

        </div>
    )
}

export default Home
