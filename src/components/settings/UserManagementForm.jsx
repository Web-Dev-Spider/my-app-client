import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft, FaCheck } from 'react-icons/fa';

// Hardcoded for now, matching server/config/permissions.js
const AVAILABLE_PERMISSIONS = {
    CREATE_MANAGER: "CREATE_MANAGER",
    CREATE_STAFF: "CREATE_STAFF",
    ADD_FINANCE: "ADD_FINANCE",
    EDIT_FINANCE: "EDIT_FINANCE",
    UPLOAD_DOCUMENT: "UPLOAD_DOCUMENT",
    DELETE_DOCUMENT: "DELETE_DOCUMENT",
    CREATE_VEHICLE: "CREATE_VEHICLE",
    EDIT_VEHICLE: "EDIT_VEHICLE",
    VIEW_REPORTS: "VIEW_REPORTS",
    MANAGE_USERS: "MANAGE_USERS",
    ASSIGN_DELIVERY: "ASSIGN_DELIVERY",
    UPDATE_DELIVERY: "UPDATE_DELIVERY",
    UPDATE_INVENTORY: "UPDATE_INVENTORY",
};

const UserManagementForm = () => {
    const [view, setView] = useState('list'); // 'list', 'create', 'edit'
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        username: '',
        password: '',
        role: '',
        permissions: [] // Array of permission strings
    });

    const roles = [
        "MANAGER",
        "ACCOUNTANT",
        "SHOWROOM-STAFF",
        "DELIVERY-BOY-DRIVER",
        "DELIVERY-BOY",
        "MECHANIC",
        "GODOWN-KEEPER",
        "TRUCK-DRIVER"
    ];

    const [stats, setStats] = useState({});

    useEffect(() => {
        if (view === 'list') {
            fetchUsersAndStats();
        }
    }, [view]);

    const fetchUsersAndStats = async () => {
        setLoading(true);
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/agency-stats')
            ]);

            if (usersRes.data.success) {
                setUsers(usersRes.data.users);
            }
            if (statsRes.data.success) {
                setStats(statsRes.data.stats);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage({ type: 'error', text: 'Error fetching data' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setFormData({
            name: '', email: '', mobile: '', username: '', password: '', role: '', permissions: []
        });
        setEditingUser(null);
        setView('create');
        setMessage({ type: '', text: '' });
    };

    const handleEditClick = (user) => {
        setFormData({
            name: user.name,
            email: user.email || '',
            mobile: user.mobile,
            username: user.username,
            password: '', // Don't populate password
            role: user.role,
            permissions: user.permissions || []
        });
        setEditingUser(user);
        setView('edit');
        setMessage({ type: '', text: '' });
    };

    const handleToggleStatus = async (user) => {
        try {
            const res = await api.put(`/admin/user/${user._id}/status`, { isActive: !user.isActive });
            if (res.data.success) {
                // Optimistically update UI
                setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isActive: !user.isActive } : u));
                setMessage({ type: 'success', text: `User ${!user.isActive ? 'activated' : 'deactivated'} successfully` });

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 3000);
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            setMessage({ type: 'error', text: 'Error updating status' });
        }
    };

    const handleDeleteClick = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await api.delete(`/admin/user/${userId}`);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'User deleted successfully' });
                fetchUsersAndStats();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage({ type: 'error', text: 'Error deleting user' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissionToggle = (perm) => {
        setFormData(prev => {
            const currentPerms = prev.permissions;
            if (currentPerms.includes(perm)) {
                return { ...prev, permissions: currentPerms.filter(p => p !== perm) };
            } else {
                return { ...prev, permissions: [...currentPerms, perm] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let res;
            if (view === 'create') {
                res = await api.post('/admin/create-user', formData);
            } else if (view === 'edit') {
                // Determine if any data was actually changed to avoid unnecessary updates if needed, 
                // but for now we send all (backend handles partial updates for some fields, but we are sending full object structure)
                res = await api.put(`/admin/user/${editingUser._id}`, formData);
            }

            if (res.data.success) {
                setMessage({ type: 'success', text: `User ${view === 'create' ? 'created' : 'updated'} successfully` });
                setTimeout(() => {
                    setView('list');
                    setMessage({ type: '', text: '' });
                }, 1500);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || `Error ${view === 'create' ? 'creating' : 'updating'} user` });
        } finally {
            setLoading(false);
        }
    };

    const [selectedRole, setSelectedRole] = useState(null);

    // Filter out Admins from the view entirely
    const staffUsers = users.filter(u => u.role !== 'ADMIN' && u.role !== 'SUPER-ADMIN');

    // Calculate total stats from users array
    const totalStats = {
        total: staffUsers.length,
        active: staffUsers.filter(u => u.isActive).length,
        inactive: staffUsers.filter(u => !u.isActive).length
    };

    const filteredUsers = selectedRole
        ? staffUsers.filter(user => user.role === selectedRole)
        : staffUsers;

    if (view === 'list') {
        return (
            <div className="space-y-6 animate-fadeIn">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total Staffs Card - Acts as 'All' filter */}
                    <div
                        onClick={() => setSelectedRole(null)}
                        className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${selectedRole === null
                            ? 'bg-theme-accent text-white border-theme-accent ring-2 ring-theme-accent/50'
                            : 'bg-theme-accent/10 border-theme-accent/30 hover:bg-theme-accent/20'
                            }`}
                    >
                        <h5 className={`text-xs uppercase font-semibold mb-2 ${selectedRole === null ? 'text-white/90' : 'text-theme-accent'}`}>Total Staffs</h5>
                        <div className="flex justify-between items-end">
                            <span className={`text-2xl font-bold ${selectedRole === null ? 'text-white' : 'text-theme-accent'}`}>{totalStats.total}</span>
                            <div className={`text-xs text-left ${selectedRole === null ? 'text-white/80' : 'text-theme-secondary'}`}>
                                <div><span className="font-medium">{totalStats.active}</span> Active</div>
                                <div><span className="font-medium">{totalStats.inactive}</span> Inactive</div>
                            </div>
                        </div>
                    </div>

                    {roles.map(role => {
                        const roleStats = stats[role] || { total: 0, active: 0, inactive: 0 };
                        const isSelected = selectedRole === role;

                        return (
                            <div
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${isSelected
                                    ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-300/50'
                                    : 'bg-theme-secondary border-theme-color hover:bg-theme-tertiary'
                                    }`}
                            >
                                <h5 className={`text-xs uppercase font-bold mb-2 truncate ${isSelected ? 'text-blue-900' : 'text-theme-secondary'}`} title={role.replace(/-/g, ' ')}>
                                    {role.replace(/-/g, ' ')}
                                </h5>
                                <div className="flex justify-between items-end">
                                    <span className={`text-2xl font-bold ${isSelected ? 'text-blue-900' : 'text-theme-primary'}`}>{roleStats.total}</span>
                                    <div className={`text-xs text-left ${isSelected ? 'text-blue-800' : 'text-theme-secondary'}`}>
                                        <div className={isSelected ? "text-blue-900" : "text-green-600"}><span className="font-semibold">{roleStats.active}</span> Active</div>
                                        <div className={isSelected ? "text-blue-900" : "text-red-600"}><span className="font-semibold">{roleStats.inactive}</span> Inactive</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <h3 className="text-lg font-bold text-theme-primary">
                        {selectedRole ? `${selectedRole.replace(/-/g, ' ')} List` : 'All Staff List'}
                    </h3>
                    <button
                        onClick={handleCreateClick}
                        className="px-4 py-2 bg-theme-accent text-white rounded-lg flex items-center gap-2 text-sm hover:bg-theme-accent/90"
                    >
                        <FaPlus /> Add New User
                    </button>
                </div>

                {message.text && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-theme-secondary rounded-xl border border-theme-color overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-theme-tertiary text-theme-secondary border-b border-theme-color">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Role</th>
                                    <th className="px-6 py-3 font-medium">Username</th>
                                    <th className="px-6 py-3 font-medium">Contact</th>
                                    <th className="px-6 py-3 font-medium text-center">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-theme-color">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-6 py-4 text-center text-theme-secondary">Loading users...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-4 text-center text-theme-secondary">No users found{selectedRole ? ` for role ${selectedRole}` : ''}.</td></tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-theme-tertiary/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-theme-primary">{user.name}</td>
                                            <td className="px-6 py-4 text-theme-secondary">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-theme-secondary">{user.username}</td>
                                            <td className="px-6 py-4 text-theme-secondary">
                                                <div>{user.mobile}</div>
                                                <div className="text-xs opacity-70">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${user.isActive
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(user._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-5 bg-theme-secondary rounded-xl border border-theme-color space-y-4" autoComplete="off">
            <div className="flex justify-between items-center mb-4">
                <button
                    type="button"
                    onClick={() => { setView('list'); setMessage({ type: '', text: '' }); }}
                    className="text-theme-secondary hover:text-theme-primary flex items-center gap-1 text-sm"
                >
                    <FaArrowLeft /> Back to List
                </button>
                <h3 className="text-lg font-bold text-theme-primary">{view === 'create' ? 'Create New User' : 'Edit User'}</h3>
            </div>

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
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
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
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
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
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
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
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        required
                        autoComplete="new-username"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Password {view === 'edit' && <span className="text-xs font-normal opacity-70">(Leave blank to keep unchanged)</span>}</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        required={view === 'create'}
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                    >
                        <option value="" disabled>Select Role</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Permissions Section */}
            <div className="mt-6 border-t border-theme-color pt-4">
                <h4 className="font-semibold text-theme-primary text-sm mb-3">Permissions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(AVAILABLE_PERMISSIONS).map(([key, value]) => {
                        const isGranted = formData.permissions.includes(value);
                        return (
                            <div
                                key={key}
                                onClick={() => handlePermissionToggle(value)}
                                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-sm select-none
                                    ${isGranted
                                        ? 'bg-theme-accent/10 border-theme-accent text-theme-accent font-medium'
                                        : 'bg-theme-tertiary border-theme-color text-theme-secondary hover:border-theme-accent/50'
                                    }`}
                            >
                                <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-colors
                                    ${isGranted ? 'bg-theme-accent border-theme-accent text-white' : 'bg-theme-primary border-theme-secondary'}
                                `}>
                                    {isGranted && <FaCheck size={10} />}
                                </div>
                                <span className="truncate" title={key.replace(/_/g, ' ')}>{key.replace(/_/g, ' ')}</span>
                            </div>
                        );
                    })}
                </div>
                <p className="text-xs text-theme-secondary mt-3">
                    <strong>Note:</strong> Standard permissions are automatically assigned based on the selected Role. You can grant additional special permissions by selecting them above.
                </p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => { setView('list'); setMessage({ type: '', text: '' }); }}
                    className="px-5 py-2 rounded-lg font-medium text-theme-secondary hover:bg-theme-tertiary text-sm transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2 rounded-lg font-medium text-white text-sm transition-colors duration-200 ${loading ? 'bg-theme-secondary cursor-not-allowed' : 'bg-theme-accent hover:bg-theme-accent/90'}`}
                >
                    {loading ? (view === 'create' ? 'Creating...' : 'Updating...') : (view === 'create' ? 'Create User' : 'Update User')}
                </button>
            </div>
        </form>
    );
};

export default UserManagementForm;
