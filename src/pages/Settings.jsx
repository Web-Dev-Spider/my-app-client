import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../axios/axiosInstance';
import { FaCog, FaPalette, FaUser, FaBell, FaLock, FaChevronRight } from 'react-icons/fa';

const UserManagementForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const roles = [
        "MANAGER",
        "SHOWROOM-STAFF",
        "DELIVERY-BOY-DRIVER",
        "DELIVERY-BOY",
        "MECHANIC",
        "GODOWN-KEEPER",
        "TRUCK-DRIVER"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.post('/admin/create-user', formData);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'User created successfully' });
                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    username: '',
                    password: '',
                    role: ''
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating user' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-theme-secondary rounded-xl border border-theme-color space-y-4" autoComplete="off">
            {message.text && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        required
                        autoComplete="new-name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        autoComplete="new-email"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Mobile</label>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        required
                        autoComplete="new-mobile"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        required
                        autoComplete="new-username"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                        required
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                    >
                        <option value="" disabled>Select Role</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${loading ? 'bg-theme-secondary cursor-not-allowed' : 'bg-theme-accent hover:bg-theme-accent/90'}`}
                >
                    {loading ? 'Creating...' : 'Create User'}
                </button>
            </div>
        </form>
    );
};

// ... existing Settings component ...

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('appearance');
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

    const themes = [
        { id: 'earth', name: 'Earth', color: '#ebe9e7', description: 'Natural and grounded' },
        { id: 'dark', name: 'Dark', color: '#121212', description: 'Easy on the eyes' },
        { id: 'light', name: 'Light', color: '#ffffff', description: 'Clean and crisp' },
        { id: 'slate', name: 'Slate', color: '#4a5162ff', description: 'Professional and cool' },
    ];

    const tabs = [
        { id: 'general', label: 'General', icon: FaCog },
        { id: 'appearance', label: 'Appearance', icon: FaPalette },
        { id: 'account', label: 'Account', icon: FaUser },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'security', label: 'Security', icon: FaLock },
        ...(user?.role === 'ADMIN' ? [{ id: 'users', label: 'Manage Users', icon: FaUser }] : []),
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'appearance':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Theme Preferences</h3>
                            <p className="text-sm text-theme-secondary">Customize the look and feel of your application.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group ${theme === t.id
                                        ? 'border-theme-accent bg-theme-tertiary shadow-md'
                                        : 'border-theme-color hover:border-theme-accent/50 hover:bg-theme-tertiary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-full border-2 border-theme-color shadow-sm flex-shrink-0 transition-transform duration-300 ${theme === t.id ? 'scale-110' : 'group-hover:scale-105'}`}
                                            style={{ backgroundColor: t.color }}
                                        />
                                        <div>
                                            <span className="block font-semibold text-theme-primary">{t.name}</span>
                                            <span className="text-xs text-theme-secondary">{t.description}</span>
                                        </div>
                                        {theme === t.id && (
                                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-theme-accent shadow-sm animate-pulse" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-theme-tertiary rounded-xl border border-theme-color">
                            <h4 className="font-semibold text-theme-primary mb-2">Preview</h4>
                            <div className="bg-theme-secondary p-4 rounded-lg border border-theme-color shadow-sm">
                                <div className="h-4 w-1/3 bg-theme-primary/20 rounded mb-3"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-theme-primary/10 rounded"></div>
                                    <div className="h-3 w-5/6 bg-theme-primary/10 rounded"></div>
                                    <div className="h-3 w-4/6 bg-theme-primary/10 rounded"></div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <div className="h-8 w-20 bg-theme-accent rounded"></div>
                                    <div className="h-8 w-20 bg-theme-primary/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'general':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">General Settings</h3>
                            <p className="text-sm text-theme-secondary">Manage your general application preferences.</p>
                        </div>
                        <div className="p-6 bg-theme-secondary rounded-xl border border-theme-color text-center py-12">
                            <FaCog className="mx-auto text-4xl text-theme-secondary mb-3 opacity-50" />
                            <p className="text-theme-secondary">General settings content coming soon.</p>
                        </div>
                    </div>
                );
            case 'account':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Account Settings</h3>
                            <p className="text-sm text-theme-secondary">Update your personal information.</p>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="p-6 bg-theme-secondary rounded-xl border border-theme-color space-y-4">
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
                                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
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
                                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
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
                                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
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
                                        className="w-full px-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50"
                                        placeholder="Mobile Number"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg font-medium text-white transition-colors duration-200 ${loading ? 'bg-theme-secondary cursor-not-allowed' : 'bg-theme-accent hover:bg-theme-accent/90'}`}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'users':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Manage Users</h3>
                            <p className="text-sm text-theme-secondary">Create and manage staff accounts.</p>
                        </div>
                        <UserManagementForm />
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-64 text-theme-secondary">
                        <p>Select a category to view settings</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-theme-primary text-theme-primary transition-colors duration-300 pt-8 pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif text-theme-primary">Settings</h1>
                    <p className="text-theme-secondary mt-1">Manage your account preferences and application settings.</p>
                </div>

                <div className="bg-theme-secondary rounded-2xl shadow-lg border border-theme-color overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-theme-tertiary/30 border-r border-theme-color flex-shrink-0">
                        <nav className="p-4 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-theme-primary text-theme-primary shadow-sm ring-1 ring-theme-color/50'
                                            : 'text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`text-lg ${isActive ? 'text-theme-accent' : 'text-theme-secondary'}`} />
                                            <span>{tab.label}</span>
                                        </div>
                                        {isActive && <FaChevronRight className="text-xs text-theme-accent" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 md:p-10 bg-theme-secondary overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
