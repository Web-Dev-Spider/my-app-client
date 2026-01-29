
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { VscLoading } from "react-icons/vsc";
import { FaC } from "react-icons/fa6";

import { useNavigate } from 'react-router-dom'
import api from '../axios/axiosInstance'
function Register() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [registrationData, setRegistrationData] = useState({
        gasAgencyName: '',
        sapcode: '',
        email: '',
        password: '',
        company: ''
    })

    const handleChange = (e) => {
        setRegistrationData({
            ...registrationData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        console.log("Registration data", registrationData)
        setLoading(true)
        const res = await api.post(`/auth/register`, registrationData)
        if (res.data.success) {

            navigate('/dashboard')
        } else {

            alert(res.data.message)
        }
    }

    return (
        <div className='text-center'>

            <div className="flex justify-center items-center h-[70vh]">
                <div className="bg-white p-8 rounded-xl shadow w-80">
                    <h2 className="text-xl font-bold mb-4">Register</h2>
                    <input className="w-full mb-3 p-2 border rounded" name='gasAgencyName' placeholder="Gas agency Name" onChange={handleChange} value={registrationData.gasAgencyName} />
                    <select className="w-full mb-3 p-2 border rounded" name='company' onChange={handleChange} value={registrationData.company}>
                        <option value="">Select Company</option>
                        <option value="IOCL">IOCL</option>
                        <option value="HPCL">HPCL</option>
                        <option value="BPCL">BPCL</option>
                    </select>
                    <input className="w-full mb-3 p-2 border rounded" name='sapcode' placeholder="sapcode" onChange={handleChange} value={registrationData.sapCode} />
                    <input className="w-full mb-3 p-2 border rounded" name='email' placeholder="Email" onChange={handleChange} value={registrationData.email} />
                    <input className="w-full mb-3 p-2 border rounded" name='password' type="password" placeholder="Password" onChange={handleChange} value={registrationData.password} />
                    <button className="w-full bg-orange-600 text-white py-2 rounded" onClick={handleRegister}>Create Account</button>
                </div>
            </div>
            {loading && <div className='flex mx-auto w-fit items-center gap-2'>Creating the admin user for your agency . . . . please wait !!! <FaC className='animate-spin' /></div>}
        </div>
    )
}

export default Register
