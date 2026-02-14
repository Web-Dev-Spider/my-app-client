import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../axios/axiosInstance';
import { FaUsers, FaUserTag, FaEnvelope, FaPhone, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 space-y-6 min-h-screen bg-theme-primary text-theme-primary animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-serif">Dashboard</h1>
                    <p className="text-theme-secondary mt-1">Welcome back, {user?.name}</p>
                </div>
            </div>

            {user?.role === 'ADMIN' && (
                <div className="bg-theme-secondary rounded-xl border border-theme-color shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-theme-color flex flex-col md:flex-row justify-between gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <FaUsers className="text-theme-accent text-xl" />
                            <h2 className="text-xl font-bold">Team Members</h2>
                            <span className="bg-theme-tertiary text-theme-secondary text-xs px-2 py-1 rounded-full">{users.length} Users</span>
                        </div>

                        <div className="relative w-full md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-secondary" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-theme-tertiary/50 text-theme-secondary text-sm uppercase tracking-wider">
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Contact</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-theme-color">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-theme-tertiary/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent font-bold">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-theme-primary">{u.name}</p>
                                                        <p className="text-xs text-theme-secondary">@{u.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                    <FaUserTag className="text-[10px]" />
                                                    {u.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-theme-secondary">
                                                        <FaEnvelope className="text-xs" />
                                                        {u.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-theme-secondary">
                                                        <FaPhone className="text-xs" />
                                                        {u.mobile}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {u.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-theme-secondary">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-theme-secondary">
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {user?.role !== 'ADMIN' && (
                <div className="text-center py-20 bg-theme-secondary rounded-xl border border-theme-color">
                    <h2 className="text-2xl font-bold text-theme-primary">Welcome to Dashboard</h2>
                    <p className="text-theme-secondary mt-2">You are logged in as {user?.role}</p>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
