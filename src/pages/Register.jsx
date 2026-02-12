import React, { useState } from 'react'
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
        setLoading(true)

        const res = await api.post(`/auth/register`, registrationData)

        setLoading(false)

        if (res.data.success) {
            navigate('/dashboard')
        } else {
            alert(res.data.message)
        }
    }

    return (
        <div className="text-center">

            <div className="flex justify-center items-center py-10">

                <div
                    className="p-8 rounded-xl shadow w-80 sm:w-96
                               bg-theme-secondary
                               border border-theme-color transition-colors duration-300"
                >

                    <h2 className="text-xl font-bold mb-5 text-theme-primary">
                        Register
                    </h2>

                    <input
                        className="w-full mb-3 p-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none focus:ring-2 focus:ring-theme-color"
                        name='gasAgencyName'
                        placeholder="Gas agency Name"
                        onChange={handleChange}
                        value={registrationData.gasAgencyName}
                    />

                    <select
                        className="w-full mb-3 p-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none focus:ring-2 focus:ring-theme-color"
                        name='company'
                        onChange={handleChange}
                        value={registrationData.company}
                    >
                        <option value="">Select Company</option>
                        <option value="IOCL">IOCL</option>
                        <option value="HPCL">HPCL</option>
                        <option value="BPCL">BPCL</option>
                    </select>

                    <input
                        className="w-full mb-3 p-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none focus:ring-2 focus:ring-theme-color"
                        name='sapcode'
                        placeholder="SAP Code"
                        onChange={handleChange}
                        value={registrationData.sapcode}
                    />

                    <input
                        className="w-full mb-3 p-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none focus:ring-2 focus:ring-theme-color"
                        name='email'
                        placeholder="Email"
                        onChange={handleChange}
                        value={registrationData.email}
                    />

                    <input
                        className="w-full mb-4 p-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none focus:ring-2 focus:ring-theme-color"
                        name='password'
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={registrationData.password}
                    />

                    <button
                        onClick={handleRegister}
                        className="w-full py-2 rounded-lg
                                   bg-theme-accent
                                   font-medium
                                   hover:opacity-90
                                   transition"
                        style={{ color: 'var(--bg-primary)' }}
                    >
                        Create Account
                    </button>

                </div>
            </div>

            {loading && (
                <div className="flex mx-auto w-fit items-center gap-2 text-theme-secondary">
                    Creating the admin user for your agency… please wait
                    <FaC className="animate-spin text-theme-primary" />
                </div>
            )}
        </div>
    )
}

export default Register