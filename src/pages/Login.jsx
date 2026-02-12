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
                        bg-[#ebe9e7] rounded-xl
                        border border-[#8a7b70] shadow">

            <h2 className="text-xl font-semibold mb-5 text-center text-[#312525]">
                Login
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div>
                    <label className="block text-sm mb-1 text-[#594c41]">
                        Email / Username / Mobile
                    </label>
                    <input
                        type="text"
                        name="identifier"
                        value={form.identifier}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded
                                   bg-[#ddd8d5]
                                   text-[#312525]
                                   border border-[#8a7b70]
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-[#8a7b70]"
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-[#594c41]">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded
                                   bg-[#ddd8d5]
                                   text-[#312525]
                                   border border-[#8a7b70]
                                   focus:outline-none
                                   focus:ring-2
                                   focus:ring-[#8a7b70]"
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 py-2 rounded-lg
                               bg-[#594c41]
                               text-[#ebe9e7]
                               font-medium
                               hover:bg-[#312525]
                               transition
                               disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
}

export default Login;