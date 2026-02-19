import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axios/axiosInstance";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await api.post("/auth/reset-password", {
                resetToken: token,
                password
            });

            if (res.data.success) {
                setMessage("Password reset successful. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
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
                <h2 className="text-2xl font-bold text-theme-primary">Reset Password</h2>
                <p className="text-sm text-theme-secondary mt-1">Enter your new password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {message && <div className="p-3 bg-green-100 text-green-700 text-sm rounded">{message}</div>}
                {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        placeholder="New password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        placeholder="Confirm password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg bg-theme-accent text-white font-bold shadow-md hover:opacity-95 transition-all text-sm"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
