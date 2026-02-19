import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaLock } from 'react-icons/fa';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
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
            const data = await login(form.identifier, form.password);

            if (data.success) {
                navigate(data.redirectTo || "/dashboard");
            } else {
                setError(data.message || "Login failed");
            }

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Unable to login. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-20 p-8 bg-theme-secondary rounded-xl border border-theme-color shadow-sm animate-fadeIn">

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-theme-primary">Login</h2>
                <p className="text-sm text-theme-secondary mt-1">Access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Email / Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="identifier"
                            value={form.identifier}
                            onChange={handleChange}
                            placeholder="username"
                            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50"
                            required
                            autoComplete="username"
                        />
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary pl-1">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="password"
                            className="w-full px-4 py-2.5 pl-10 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm placeholder-theme-secondary/50"
                            required
                            autoComplete="current-password"
                        />
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary text-xs" />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center font-medium animate-pulse">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-theme-accent text-theme-primary font-bold shadow-md hover:shadow-lg hover:opacity-95 transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    style={{ color: 'var(--bg-primary)' }}
                >
                    {loading ? (
                        <>
                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                            <span>Logging in...</span>
                        </>
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center space-y-3">
                <Link to="/forgot-password" className="text-xs text-theme-secondary hover:text-theme-primary transition-colors cursor-pointer block">
                    Forgot password?
                </Link>
                <div className="text-xs text-theme-secondary">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-theme-accent hover:underline ml-1">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;