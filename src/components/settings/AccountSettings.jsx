import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../axios/axiosInstance';

const AccountSettings = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        username: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
                username: user.username || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await api.put('/auth/update-profile', formData);
            if (res.data.success) {
                setUser(res.data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 animate-fadeIn">
            <div>
                <h3 className="text-xl font-bold text-theme-primary mb-1">Account Settings</h3>
                <p className="text-sm text-theme-secondary">Update your personal information.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-5 bg-theme-secondary rounded-xl border border-theme-color space-y-4">
                {message.text && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                            placeholder="Mobile Number"
                        />
                    </div>
                </div>

                <div className="pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-5 py-2 rounded-lg font-medium text-white text-sm transition-colors duration-200 ${loading ? 'bg-theme-secondary cursor-not-allowed' : 'bg-theme-accent hover:bg-theme-accent/90'}`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountSettings;
