import React, { useState, useEffect } from "react";
import { FaUserShield, FaUsers, FaChartLine, FaGasPump, FaBuilding, FaSignOutAlt, FaBox, FaClock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import api from '../../axios/axiosInstance';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AgencyManagement from '../../components/AgencyManagement';

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
        },
        marketCounts: {
            IOCL: 1, // Default to 1 to avoid division by zero
            HPCL: 1,
            BPCL: 1
        }
    });
    const [loading, setLoading] = useState(true);
    const [agencies, setAgencies] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [filter, setFilter] = useState({ company: 'ALL', status: 'ALL' });

    const fetchData = async () => {
        try {
            const [statsRes, agenciesRes, pendingRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/agencies'),
                api.get('/admin/pending-registrations')
            ]);

            if (statsRes.data.success) {
                setStats({
                    totalUsers: statsRes.data.totalUsers,
                    activeUsers: statsRes.data.activeUsers,
                    distributors: statsRes.data.distributors,
                    marketCounts: statsRes.data.marketCounts || { IOCL: 1, HPCL: 1, BPCL: 1 }
                });
            }

            if (agenciesRes.data.success) {
                setAgencies(agenciesRes.data.agencies);
            }

            if (pendingRes.data.success) {
                setPendingCount(pendingRes.data.data.length);
            }
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Calculate dynamic stats from agencies
    const distributorStats = {
        total: agencies.length,
        companies: {
            IOCL: {
                total: agencies.filter(a => a.company === 'IOCL').length,
                active: agencies.filter(a => a.company === 'IOCL' && a.isActive).length,
                inactive: agencies.filter(a => a.company === 'IOCL' && !a.isActive).length
            },
            HPCL: {
                total: agencies.filter(a => a.company === 'HPCL').length,
                active: agencies.filter(a => a.company === 'HPCL' && a.isActive).length,
                inactive: agencies.filter(a => a.company === 'HPCL' && !a.isActive).length
            },
            BPCL: {
                total: agencies.filter(a => a.company === 'BPCL').length,
                active: agencies.filter(a => a.company === 'BPCL' && a.isActive).length,
                inactive: agencies.filter(a => a.company === 'BPCL' && !a.isActive).length
            }
        }
    };

    const handleFilter = (company, status) => {
        setFilter({ company, status });
    };

    const UserStatCard = ({ title, value, icon: Icon, colorClass, subText, details }) => (
        <div className={`bg-theme-secondary p-6 rounded-xl shadow-sm border border-theme-color hover:shadow-md transition-all duration-300 group`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-theme-secondary text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-theme-primary mb-2 number-animation">
                        {value}
                    </div>
                    {subText && <p className="text-xs text-theme-secondary opacity-70">{subText}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon className={`text-2xl ${colorClass.replace('bg-', 'text-')}`} />
                </div>
            </div>

            {details && (
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-theme-color">
                    <div className="text-center p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                        <p className="text-xs text-theme-secondary uppercase font-semibold">Active</p>
                        <p className="text-lg font-bold text-green-500">{details.active}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                        <p className="text-xs text-theme-secondary uppercase font-semibold">Inactive</p>
                        <p className="text-lg font-bold text-red-500">{details.inactive}</p>
                    </div>
                </div>
            )}
        </div>
    );

    const DistributorStatCard = () => (
        <div className="bg-theme-secondary p-6 rounded-xl shadow-sm border border-theme-color hover:shadow-md transition-all duration-300 col-span-1 md:col-span-2">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-orange-500 bg-opacity-10">
                        <FaGasPump className="text-2xl text-orange-500" />
                    </div>
                    <div>
                        <h3 className="text-theme-secondary text-sm font-medium uppercase tracking-wider">Total Distributors</h3>
                        <p
                            className={`text-2xl font-bold text-theme-primary cursor-pointer hover:text-theme-accent transition-colors ${filter.company === 'ALL' ? 'text-theme-accent' : ''}`}
                            onClick={() => handleFilter('ALL', 'ALL')}
                        >
                            {distributorStats.total}
                        </p>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-4 gap-2">
                {/* IOCL */}
                <div className="space-y-0">
                    <div
                        className={`flex justify-between items-center p-2 rounded cursor-pointer ${filter.company === 'IOCL' && filter.status === 'ALL' ? 'bg-orange-100 dark:bg-orange-900/20 ring-1 ring-orange-500' : 'hover:bg-theme-tertiary'}`}
                        onClick={() => handleFilter('IOCL', 'ALL')}
                    >
                        <span className="font-bold text-orange-600">IOCL</span>
                        <span className="font-bold">{distributorStats.companies.IOCL.total}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                        <div
                            className={`p-1 rounded cursor-pointer ${filter.company === 'IOCL' && filter.status === 'ACTIVE' ? 'bg-green-100 ring-1 ring-green-500' : 'bg-theme-tertiary/50 hover:bg-green-50'}`}
                            onClick={() => handleFilter('IOCL', 'ACTIVE')}
                        >
                            <span className="block text-green-600 font-bold">{distributorStats.companies.IOCL.active}</span>
                            <span className="text-[14px] text-theme-secondary">Active</span>
                        </div>
                        <div
                            className={`p-1 rounded cursor-pointer ${filter.company === 'IOCL' && filter.status === 'INACTIVE' ? 'bg-red-100 ring-1 ring-red-500' : 'bg-theme-tertiary/50 hover:bg-red-50'}`}
                            onClick={() => handleFilter('IOCL', 'INACTIVE')}
                        >
                            <span className="block text-red-500 font-bold">{distributorStats.companies.IOCL.inactive}</span>
                            <span className="text-[14px] text-theme-secondary">Inactive</span>
                        </div>
                    </div>
                </div>

                {/* HPCL */}
                <div className="space-y-2 border-l border-theme-color pl-4">
                    <div
                        className={`flex justify-between items-center p-2 rounded cursor-pointer ${filter.company === 'HPCL' && filter.status === 'ALL' ? 'bg-blue-100 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'hover:bg-theme-tertiary'}`}
                        onClick={() => handleFilter('HPCL', 'ALL')}
                    >
                        <span className="font-bold text-blue-600">HPCL</span>
                        <span className="font-bold">{distributorStats.companies.HPCL.total}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div
                            className={`p-1 rounded cursor-pointer ${filter.company === 'HPCL' && filter.status === 'ACTIVE' ? 'bg-green-100 ring-1 ring-green-500' : 'bg-theme-tertiary/50 hover:bg-green-50'}`}
                            onClick={() => handleFilter('HPCL', 'ACTIVE')}
                        >
                            <span className="block text-green-600 font-bold">{distributorStats.companies.HPCL.active}</span>
                            <span className="text-[14px] text-theme-secondary">Active</span>
                        </div>
                        <div
                            className={`p-1 rounded cursor-pointer ${filter.company === 'HPCL' && filter.status === 'INACTIVE' ? 'bg-red-100 ring-1 ring-red-500' : 'bg-theme-tertiary/50 hover:bg-red-50'}`}
                            onClick={() => handleFilter('HPCL', 'INACTIVE')}
                        >
                            <span className="block text-red-500 font-bold">{distributorStats.companies.HPCL.inactive}</span>
                            <span className="text-[14px] text-theme-secondary">Inactive</span>
                        </div>
                    </div>
                </div>

                {/* BPCL */}
                <div className="space-y-2 border-l border-theme-color pl-4">
                    <div
                        className={`flex justify-between items-center p-2 rounded cursor-pointer ${filter.company === 'BPCL' && filter.status === 'ALL' ? 'bg-yellow-100 dark:bg-yellow-900/20 ring-1 ring-yellow-500' : 'hover:bg-theme-tertiary'}`}
                        onClick={() => handleFilter('BPCL', 'ALL')}
                    >
                        <span className="font-bold text-yellow-600">BPCL</span>
                        <span className="font-bold">{distributorStats.companies.BPCL.total}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div
                            className={`p-1 rounded cursor-pointer ${filter.company === 'BPCL' && filter.status === 'ACTIVE' ? 'bg-green-100 ring-1 ring-green-500' : 'bg-theme-tertiary/50 hover:bg-green-50'}`}
                            onClick={() => handleFilter('BPCL', 'ACTIVE')}
                        >
                            <span className="block text-green-600 font-bold">{distributorStats.companies.BPCL.active}</span>
                            <span className="text-[14px] text-theme-secondary">Active</span>
                        </div>
                        <div
                            className={`p-1 rounded cursor-pointer ${filter.company === 'BPCL' && filter.status === 'INACTIVE' ? 'bg-red-100 ring-1 ring-red-500' : 'bg-theme-tertiary/50 hover:bg-red-50'}`}
                            onClick={() => handleFilter('BPCL', 'INACTIVE')}
                        >
                            <span className="block text-red-500 font-bold">{distributorStats.companies.BPCL.inactive}</span>
                            <span className="text-[14px] text-theme-secondary">Inactive</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            // Optimistic update
            setAgencies(prev => prev.map(agency =>
                agency._id === id ? { ...agency, isActive: !currentStatus } : agency
            ));

            const res = await api.put(`/admin/agency/${id}/status`, { isActive: !currentStatus });

            if (!res.data.success) {
                // Revert on failure
                setAgencies(prev => prev.map(agency =>
                    agency._id === id ? { ...agency, isActive: currentStatus } : agency
                ));
            }
        } catch (err) {
            console.error(err);
            // Revert
            setAgencies(prev => prev.map(agency =>
                agency._id === id ? { ...agency, isActive: currentStatus } : agency
            ));
        }
    };

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
                            <UserStatCard
                                title="Total Registered Users"
                                value={stats.totalUsers}
                                icon={FaUsers}
                                colorClass="bg-blue-500 text-blue-500"
                                details={{
                                    active: stats.activeUsers,
                                    inactive: stats.totalUsers - stats.activeUsers
                                }}
                            />

                            <UserStatCard
                                title="Active Users Rate"
                                value={`${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%`}
                                icon={FaChartLine}
                                colorClass="bg-green-500 text-green-500"
                                subText="Engagement Rate"
                            />

                            <div
                                onClick={() => navigate('/super-admin/pending-registrations')}
                                className="bg-theme-secondary p-6 rounded-xl shadow-sm border border-theme-color hover:shadow-md hover:border-yellow-500 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-theme-secondary text-sm font-medium uppercase tracking-wider mb-1">Pending Approvals</h3>
                                        <div className="text-3xl font-bold text-theme-primary mb-2 number-animation">
                                            {pendingCount}
                                        </div>
                                        <p className="text-xs text-theme-secondary opacity-70">Awaiting Review</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-yellow-500 bg-opacity-10 group-hover:bg-opacity-20 transition-colors">
                                        <FaClock className="text-2xl text-yellow-500" />
                                    </div>
                                </div>
                                {pendingCount > 0 && (
                                    <div className="text-xs text-yellow-600 font-semibold mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                        {pendingCount} registration{pendingCount !== 1 ? 's' : ''} pending approval
                                    </div>
                                )}
                            </div>

                            <DistributorStatCard />
                        </div>

                        {/* Agency Management Section */}
                        <AgencyManagement
                            agencies={agencies}
                            filter={filter}
                            onToggleStatus={handleToggleStatus}
                        />

                        {/* Distributor Breakdown */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-3 bg-theme-secondary rounded-xl border border-theme-color shadow-sm p-6">
                                <h3 className="text-lg font-bold text-theme-primary  flex items-center gap-2">
                                    <FaBuilding className="text-theme-accent" />
                                    Distributor Distribution <span className="text-sm font-bold text-theme-secondary bg-theme-tertiary p-1 rounded-md"> {stats.distributors.IOCL + stats.distributors.HPCL + stats.distributors.BPCL} / {stats.marketCounts.IOCL + stats.marketCounts.HPCL + stats.marketCounts.BPCL}</span>
                                </h3>

                                <h3 className="text-xs font-bold text-theme-secondary mb-3">As per the LPG Profile Report as of April 1, 2025 released by the Petroleum Planning & Analysis Cell (PPAC)</h3>

                                <div className="space-y-6">
                                    {/* IOCL */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-theme-primary">IOCL</span>
                                            <span className="text-sm font-bold text-orange-500">{Math.round((stats.distributors.IOCL / (stats.marketCounts.IOCL || 1)) * 100).toFixed(6)}% captured</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-theme-secondary mb-2">
                                            <span>Registered: {stats.distributors.IOCL}</span>
                                            <span>Total IOCL in Market: {stats.marketCounts.IOCL}</span>
                                        </div>
                                        <div className="w-full bg-theme-tertiary rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(stats.distributors.IOCL / (stats.marketCounts.IOCL || 1).toFixed(6)) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* HPCL */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-theme-primary">HPCL</span>
                                            <span className="text-sm font-bold text-blue-600">{Math.round((stats.distributors.HPCL / (stats.marketCounts.HPCL || 1).toFixed(6)) * 100)}% captured</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-theme-secondary mb-2">
                                            <span>Registered: {stats.distributors.HPCL}</span>
                                            <span>Total HPCL in Market: {stats.marketCounts.HPCL}</span>
                                        </div>
                                        <div className="w-full bg-theme-tertiary rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(stats.distributors.HPCL / (stats.marketCounts.HPCL || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* BPCL */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-theme-primary">BPCL</span>
                                            <span className="text-sm font-bold text-yellow-500">{Math.round((stats.distributors.BPCL / (stats.marketCounts.BPCL || 1)) * 100)}% captured</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-theme-secondary mb-2">
                                            <span>Registered: {stats.distributors.BPCL}</span>
                                            <span>Total BPCL in Market: {stats.marketCounts.BPCL}</span>
                                        </div>
                                        <div className="w-full bg-theme-tertiary rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-yellow-600 h-3 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${(stats.distributors.BPCL / (stats.marketCounts.BPCL || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-4 pt-2 border-t border-theme-color">

                                    <h2 className="text-lg font-bold text-theme-primary">Captured Market Share</h2>
                                </p>
                                <div className="mt-4 pt-2 border-t border-theme-color grid grid-cols-3 gap-4 text-center">

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
                                    {pendingCount > 0 && (
                                        <button
                                            onClick={() => navigate('/super-admin/pending-registrations')}
                                            className="w-full p-3 rounded-lg border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-left flex items-center justify-between group transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-yellow-600" />
                                                <span className="text-sm font-bold text-yellow-700">Review Pending Registrations ({pendingCount})</span>
                                            </div>
                                            <span className="text-xs text-yellow-600 opacity-100 group-hover:opacity-100 transition-opacity">Go &rarr;</span>
                                        </button>
                                    )}
                                    <button onClick={() => navigate('/super-admin/products')} className="w-full p-3 rounded-lg border border-theme-color hover:bg-theme-tertiary text-left flex items-center justify-between group transition-colors">
                                        <div className="flex items-center gap-2">
                                            <FaBox className="text-theme-secondary group-hover:text-theme-accent" />
                                            <span className="text-sm font-medium text-theme-primary">Manage Global Products</span>
                                        </div>
                                        <span className="text-xs text-theme-accent opacity-0 group-hover:opacity-100 transition-opacity">Go &rarr;</span>
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
