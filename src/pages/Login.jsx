import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
                navigate(data.redirectTo || "/");
            } else {
                setError(data.message || "Login failed");
            }

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Unable to login. Please try again.";

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-12 p-6
                        bg-theme-secondary rounded-xl
                        border border-theme-color shadow-sm transition-colors duration-300">

            <h2 className="text-xl font-semibold mb-5 text-center text-theme-primary">
                Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <label className="block text-sm mb-1 text-theme-secondary">
                        Email / Username / Mobile
                    </label>
                    <input
                        type="text"
                        name="identifier"
                        value={form.identifier}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-theme-color"
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-theme-secondary">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded
                                   bg-theme-input
                                   text-theme-primary
                                   border border-theme-color
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-theme-color"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 py-2 rounded-lg
                               bg-theme-accent
                               text-theme-primary
                               font-medium
                               hover:opacity-90
                               transition
                               disabled:opacity-60"
                    style={{ color: 'var(--bg-primary)' }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
}

export default Login;