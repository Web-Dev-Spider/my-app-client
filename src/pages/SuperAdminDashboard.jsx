import React, { useState, useEffect } from "react";
import { FaUserShield, FaUsers, FaChartLine, FaGasPump, FaBuilding, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import api from '../axios/axiosInstance';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AgencyManagement from '../components/AgencyManagement';

const SuperAdminDashboard = () => {
    const { theme } = useTheme();
    const { user, setIsAuthenticated, setUser, setAgency } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        distributors: {
            IOCL: 0,
            HPCL: 0,
            BPCL: 0
        }
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            if (statsRes.data.success) {
                setStats({
                    totalUsers: statsRes.data.totalUsers,
                    activeUsers: statsRes.data.activeUsers,
                    distributors: statsRes.data.distributors
                });
            }
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, colorClass, subText }) => (
        <div className="bg-theme-secondary p-6 rounded-xl shadow-sm border border-theme-color hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-theme-secondary text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
                    <p className="text-3xl font-bold text-theme-primary mb-2 number-animation">{value}</p>
                    {subText && <p className="text-xs text-theme-secondary opacity-70">{subText}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon className={`text-2xl ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem("hasSession");
            setIsAuthenticated(false);
            setUser(null);
            setAgency(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear local state even if API fails
            localStorage.removeItem("hasSession");
            setIsAuthenticated(false);
            setUser(null);
            setAgency(null);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-theme-primary p-6 md:p-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-theme-primary">Super Admin Dashboard</h1>
                        <p className="text-theme-secondary mt-1">Overview of system performance and distributor statistics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-theme-accent/10 border border-theme-accent text-theme-accent rounded-full text-xs font-semibold">
                            Live Updates
                        </span>
                        <div className="text-right border-r border-theme-color pr-3 mr-1">
                            <p className="text-sm font-medium text-theme-primary">Welcome, {user?.name || 'Admin'}</p>
                            <p className="text-xs text-theme-secondary">{user?.role || 'System Administrator'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-theme-secondary border border-theme-color text-theme-secondary hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all duration-200 group relative"
                            title="Sign Out"
                        >
                            <FaSignOutAlt className="text-lg" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-theme-color border-t-theme-accent"></div>
                    </div>
                ) : (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Registered Users"
                                value={stats.totalUsers}
                                icon={FaUsers}
                                colorClass="bg-blue-500 text-blue-500"
                                subText="+12% from last month"
                            />
                            <StatCard
                                title="Active Users"
                                value={stats.activeUsers}
                                icon={FaChartLine}
                                colorClass="bg-green-500 text-green-500"
                                subText="58% engagement rate"
                            />
                            <StatCard
                                title="Total Distributors"
                                value={stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL}
                                icon={FaGasPump}
                                colorClass="bg-orange-500 text-orange-500"
                            />
                            <StatCard
                                title="Pending Approvals"
                                value={12}
                                icon={FaUserShield}
                                colorClass="bg-red-500 text-red-500"
                                subText="Requires attention"
                            />
                        </div>

                        {/* Agency Management Section */}
                        <AgencyManagement />

                        {/* Distributor Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-theme-secondary rounded-xl border border-theme-color shadow-sm p-6">
                                <h3 className="text-lg font-bold text-theme-primary mb-6 flex items-center gap-2">
                                    <FaBuilding className="text-theme-accent" />
                                    Distributor Distribution
                                </h3>
                                <div className="space-y-6">
                                    {/* IOCL */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-theme-primary">IOCL</span>
                                            <span className="text-theme-secondary">{stats.distributors.IOCL} Distributors</span>
                                        </div>
                                        <div className="w-full bg-theme-tertiary rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${stats.totalUsers > 0 ? (stats.distributors.IOCL / (stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL || 1)) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* HPCL */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-theme-primary">HPCL</span>
                                            <span className="text-theme-secondary">{stats.distributors.HPCL} Distributors</span>
                                        </div>
                                        <div className="w-full bg-theme-tertiary rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${stats.totalUsers > 0 ? (stats.distributors.HPCL / (stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL || 1)) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* BPCL */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-medium text-theme-primary">BPCL</span>
                                            <span className="text-theme-secondary">{stats.distributors.BPCL} Distributors</span>
                                        </div>
                                        <div className="w-full bg-theme-tertiary rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${stats.totalUsers > 0 ? (stats.distributors.BPCL / (stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL || 1)) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-theme-color grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 rounded-lg bg-theme-tertiary/30">
                                        <p className="text-xs text-theme-secondary uppercase">Market Share (IOCL)</p>
                                        <p className="text-xl font-bold text-orange-500 mt-1">
                                            {Math.round((stats.distributors.IOCL / (stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL || 1)) * 100)}%
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-theme-tertiary/30">
                                        <p className="text-xs text-theme-secondary uppercase">Market Share (HPCL)</p>
                                        <p className="text-xl font-bold text-blue-600 mt-1">
                                            {Math.round((stats.distributors.HPCL / (stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL || 1)) * 100)}%
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-theme-tertiary/30">
                                        <p className="text-xs text-theme-secondary uppercase">Market Share (BPCL)</p>
                                        <p className="text-xl font-bold text-yellow-500 mt-1">
                                            {Math.round((stats.distributors.BPCL / (stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL || 1)) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity / Quick Actions Placeholder */}
                            <div className="bg-theme-secondary rounded-xl border border-theme-color shadow-sm p-6 flex flex-col">
                                <h3 className="text-lg font-bold text-theme-primary mb-4">Quick Actions</h3>
                                <div className="space-y-3 flex-1">
                                    <button className="w-full p-3 rounded-lg border border-theme-color hover:bg-theme-tertiary text-left flex items-center justify-between group transition-colors">
                                        <span className="text-sm font-medium text-theme-primary">Generate Monthly Report</span>
                                        <FaChartLine className="text-theme-secondary group-hover:text-theme-accent" />
                                    </button>
                                    <button className="w-full p-3 rounded-lg border border-theme-color hover:bg-theme-tertiary text-left flex items-center justify-between group transition-colors">
                                        <span className="text-sm font-medium text-theme-primary">Manage Users</span>
                                        <FaUsers className="text-theme-secondary group-hover:text-theme-accent" />
                                    </button>
                                    <button className="w-full p-3 rounded-lg border border-theme-color hover:bg-theme-tertiary text-left flex items-center justify-between group transition-colors">
                                        <span className="text-sm font-medium text-theme-primary">System Settings</span>
                                        <FaUserShield className="text-theme-secondary group-hover:text-theme-accent" />
                                    </button>
                                </div>
                                <div className="mt-6 p-4 bg-theme-accent/5 rounded-lg border border-theme-accent/20">
                                    <p className="text-xs text-theme-secondary">
                                        <strong className="block text-theme-primary mb-1">System Status:</strong>
                                        All systems operational. Last backup: 2 hours ago.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
