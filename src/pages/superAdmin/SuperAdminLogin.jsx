import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from '../../axios/axiosInstance';
import { FaUserShield, FaLock } from 'react-icons/fa';

function SuperAdminLogin() {
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser, setAgency } = useAuth();
    const [form, setForm] = useState({
        identifier: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Using API instance directly as requested
            const res = await api.post("/auth/login", {
                identifier: form.identifier,
                password: form.password
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                const userData = res.data.user;
                if (userData?.role === 'SUPER_ADMIN') {
                    // Manually update Auth Context state
                    localStorage.setItem("hasSession", "true");
                    setIsAuthenticated(true);
                    setUser(userData);
                    setAgency(res.data.agency);

                    navigate("/super-admin/dashboard");
                } else {
                    setError("Access Denied: Not a Super Admin account.");
                    // Ensure we don't leave a partial session
                    localStorage.removeItem("hasSession");
                    setIsAuthenticated(false);
                }
            } else {
                setError(res.data.message || "Login failed");
            }

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Access verification failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-theme-primary flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-theme-secondary rounded-2xl border border-theme-color shadow-xl overflow-hidden animate-fadeIn">

                {/* Header Section */}
                <div className="bg-theme-secondary p-8 text-center border-b border-theme-color relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
                    <div className="bg-theme-tertiary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-theme-accent shadow-inner">
                        <FaUserShield className="text-3xl text-theme-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-theme-primary tracking-tight">Super Admin Portal</h2>
                    <p className="text-sm text-theme-secondary mt-2">Restricted Access only.</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Email or Mobile</label>
                            <input
                                type="text"
                                name="identifier"
                                value={form.identifier}
                                onChange={handleChange}
                                placeholder="Enter admin email or mobile"
                                className="w-full px-4 py-3 rounded-xl bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all placeholder-theme-secondary/50"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Secure Key</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter secure password"
                                    className="w-full px-4 py-3 pl-10 rounded-xl bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all placeholder-theme-secondary/50"
                                    required
                                />
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-sm" />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg text-center font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-theme-accent text-theme-primary font-bold shadow-lg hover:shadow-xl hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                            style={{ color: 'var(--bg-primary)' }}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "Access Dashboard"
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-theme-tertiary/30 p-4 text-center border-t border-theme-color">
                    <p className="text-xs text-theme-secondary">
                        Unauthorized access is strictly prohibited and monitored.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminLogin;
