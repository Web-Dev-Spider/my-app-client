import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        console.log(e.target.value)
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, loginData)
            if (res.data.success) {

                navigate('/home')
            }
            else {
                alert(res.data.message)
            }
            console.log(res.data)

        } catch (error) {
            console.log(error)
        }
        // console.log(loginData)
    }
    return (
        <div className='w-1/3 bg-amber-500 h-auto mx-auto mt-5 p-5'>
            <form onSubmit={handleLogin} className='flex flex-col gap-2'>
                <div>

                    <label htmlFor="name">Email</label>
                    <input type="text" className='bg-amber-200' name="email" value={loginData.email} onChange={handleChange} />
                </div>
                <div>

                    <label htmlFor="name">Password</label>
                    <input type="password" className='bg-amber-200' name='password' value={loginData.password} onChange={handleChange} />
                </div>

                <button className='bg-amber-950 text-white w-1/2 mx-auto' type='submit'>Login</button>
            </form>
        </div>
    )
}

export default Login
