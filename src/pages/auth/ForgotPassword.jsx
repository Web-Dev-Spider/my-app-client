import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../axios/axiosInstance";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await api.post("/auth/forgot-password", { email });
            if (res.data.success) {
                setMessage(res.data.message);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-20 p-8 bg-theme-secondary rounded-xl border border-theme-color shadow-sm animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-theme-primary">Forgot Password</h2>
                <p className="text-sm text-theme-secondary mt-1">Enter your email to reset password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {message && <div className="p-3 bg-green-100 text-green-700 text-sm rounded">{message}</div>}
                {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-theme-accent text-white font-bold shadow-md hover:opacity-95 transition-all text-sm"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="text-xs text-theme-secondary hover:text-theme-primary transition-colors">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

export default ForgotPassword;
