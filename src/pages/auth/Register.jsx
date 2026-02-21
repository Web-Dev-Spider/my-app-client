import React, { useState } from 'react'
import { FaBuilding, FaIdBadge, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import api from '../../axios/axiosInstance'

function Register() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false)
    const [registrationEmail, setRegistrationEmail] = useState("")
    const [registrationData, setRegistrationData] = useState({
        gasAgencyName: '',
        sapcode: '',
        email: '',
        password: '',
        company: ''
    })
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setRegistrationData({
            ...registrationData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError("");
        setLoading(true)

        try {
            const res = await api.post(`/auth/register`, registrationData)

            if (res.data.success) {
                setRegistrationSuccess(true)
                setRegistrationEmail(registrationData.email)
            } else {
                setError(res.data.message || "Registration failed")
            }
        } catch (error) {
            console.error("Registration error:", error);
            const msg = error.response?.data?.message || "An unexpected error occurred during registration.";
            setError(msg);
        } finally {
            setLoading(false)
        }
    }

    // Success state - show pending approval message
    if (registrationSuccess) {
        return (
            <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-theme-secondary rounded-xl border border-theme-color shadow-sm animate-fadeIn">
                <div className="text-center">
                    <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-theme-primary mb-2">Registration Successful!</h2>
                    <p className="text-sm text-theme-secondary mb-4">
                        Your agency registration has been received.
                    </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-theme-primary mb-3 font-semibold">Next Steps:</p>
                    <ul className="text-xs text-theme-secondary space-y-2">
                        <li>✓ Your registration is currently <span className="font-semibold text-yellow-600">pending admin approval</span></li>
                        <li>✓ We've sent a confirmation email to <span className="font-semibold text-theme-primary">{registrationEmail}</span></li>
                        <li>✓ You'll receive another email once your registration is approved</li>
                        <li>✓ After approval, you can log in with your email/username and password</li>
                    </ul>
                </div>

                <div className="bg-theme-input border border-theme-color rounded-lg p-4 mb-6">
                    <p className="text-xs text-theme-secondary mb-2 font-semibold">Registration Details:</p>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-theme-secondary">Email:</span>
                            <span className="text-theme-primary font-semibold">{registrationEmail}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-theme-secondary">Username:</span>
                            <span className="text-theme-primary font-semibold">admin_{registrationData.sapcode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-theme-secondary">Status:</span>
                            <span className="text-yellow-600 font-semibold">Pending Approval</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-theme-secondary text-center mb-4">
                    Check your email inbox and spam folder for our notifications.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="w-full py-2.5 rounded-lg bg-theme-accent text-theme-primary font-bold shadow-md hover:shadow-lg hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 text-sm"
                    style={{ color: 'var(--bg-primary)' }}
                >
                    Return to Home
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-lg mx-auto mt-10 p-6 bg-theme-secondary rounded-xl border border-theme-color shadow-sm animate-fadeIn">

            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-theme-primary">Register Agency</h2>
                <p className="text-xs text-theme-secondary mt-1">Create a new account</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">

                {/* Agency Name */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Agency Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            name='gasAgencyName'
                            value={registrationData.gasAgencyName}
                            onChange={handleChange}
                            placeholder="Enter agency name"
                            className="w-full px-4 py-2 pl-9 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50"
                            required
                        />
                        <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Company Select */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Company</label>
                        <div className="relative">
                            <select
                                name='company'
                                value={registrationData.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 pl-9 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50 appearance-none"
                                required
                            >
                                <option value="">Select</option>
                                <option value="IOCL">IOCL</option>
                                <option value="HPCL">HPCL</option>
                                <option value="BPCL">BPCL</option>
                            </select>
                            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-4 h-4 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* SAP Code */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">SAP Code</label>
                        <div className="relative">
                            <input
                                type="text"
                                name='sapcode'
                                value={registrationData.sapcode}
                                onChange={handleChange}
                                placeholder="SAP Code"
                                className="w-full px-4 py-2 pl-9 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50"
                                required
                            />
                            <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Email</label>
                        <div className="relative">
                            <input
                                type="email"
                                name='email'
                                value={registrationData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-2 pl-9 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50"
                                required
                            />
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                name='password'
                                value={registrationData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-2 pl-9 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50"
                                required
                            />
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-2 rounded-lg text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-theme-accent text-theme-primary font-bold shadow-md hover:shadow-lg hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm mt-3"
                    style={{ color: 'var(--bg-primary)' }}
                >
                    {loading ? (
                        <>
                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-xs text-theme-secondary" onClick={() => navigate('/login')}>
                    Already have an account? <span className="text-theme-primary font-semibold hover:underline cursor-pointer">Login here</span>.
                </p>
            </div>
        </div>
    )
}

export default Register