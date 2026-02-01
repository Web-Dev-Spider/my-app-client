import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/axiosInstance";

function Login() {
    const navigate = useNavigate();

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
            const res = await api.post("/auth/login", {
                identifier: form.identifier,
                password: form.password
            });

            const data = res.data;

            if (data.success) {
                // backend already set cookie
                navigate(data.redirectTo || "/home");
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
        <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-amber-500 rounded">

            <h2 className="text-xl font-semibold mb-4 text-center">
                Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                <div>
                    <label className="block text-sm mb-1">
                        Email / Username / Mobile
                    </label>
                    <input
                        type="text"
                        name="identifier"
                        value={form.identifier}
                        onChange={handleChange}
                        className="w-full px-2 py-1 rounded bg-amber-200"
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-2 py-1 rounded bg-amber-200"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <p className="text-red-700 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-950 text-white py-1 rounded mt-2 disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
}

export default Login;
