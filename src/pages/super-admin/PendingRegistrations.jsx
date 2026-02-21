import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaEnvelope, FaBuilding } from 'react-icons/fa';
import api from '../../axios/axiosInstance';

function PendingRegistrations() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [rejectModal, setRejectModal] = useState({ show: false, userId: null, email: '' });
    const [rejectionNote, setRejectionNote] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchPendingRegistrations();
    }, []);

    const fetchPendingRegistrations = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/pending-registrations');
            if (response.data.success) {
                setPendingUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pending registrations:', error);
            setErrorMessage('Failed to load pending registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            setActionLoading(prev => ({ ...prev, [userId]: 'approving' }));
            const response = await api.put(`/admin/registration/${userId}/approve`);
            if (response.data.success) {
                setSuccessMessage('User approved successfully!');
                setPendingUsers(pendingUsers.filter(user => user._id !== userId));
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error approving user:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to approve user');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    const handleRejectClick = (userId, email) => {
        setRejectModal({ show: true, userId, email });
        setRejectionNote('');
    };

    const handleRejectConfirm = async () => {
        const { userId } = rejectModal;
        try {
            setActionLoading(prev => ({ ...prev, [userId]: 'rejecting' }));
            const response = await api.put(`/admin/registration/${userId}/reject`, {
                rejectionNote
            });
            if (response.data.success) {
                setSuccessMessage('User rejected successfully!');
                setPendingUsers(pendingUsers.filter(user => user._id !== userId));
                setRejectModal({ show: false, userId: null, email: '' });
                setRejectionNote('');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error rejecting user:', error);
            setErrorMessage(error.response?.data?.message || 'Failed to reject user');
            setTimeout(() => setErrorMessage(''), 3000);
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="text-4xl text-theme-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-theme-primary min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-theme-primary mb-2">Pending Registrations</h1>
                    <p className="text-theme-secondary">Review and approve/reject pending agency registrations</p>
                </div>

                {/* Messages */}
                {successMessage && (
                    <div className="bg-green-500/20 border border-green-500/50 text-green-600 p-3 rounded-lg mb-6 animate-pulse">
                        ✓ {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-600 p-3 rounded-lg mb-6 animate-pulse">
                        ✗ {errorMessage}
                    </div>
                )}

                {/* Empty State */}
                {pendingUsers.length === 0 ? (
                    <div className="bg-theme-secondary rounded-xl border border-theme-color p-12 text-center">
                        <p className="text-theme-secondary text-lg">No pending registrations at this time</p>
                    </div>
                ) : (
                    <div className="bg-theme-secondary rounded-xl border border-theme-color overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-theme-input border-b border-theme-color">
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Agency Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Admin Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">SAP Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Registered</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-theme-secondary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-color">
                                    {pendingUsers.map(user => (
                                        <tr key={user._id} className="hover:bg-theme-input transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FaBuilding className="text-theme-accent" />
                                                    <span className="text-theme-primary font-medium">{user.agencyId?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-theme-primary">{user.name || 'Admin'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope className="text-theme-accent text-sm" />
                                                    <span className="text-theme-primary text-sm">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block bg-theme-input text-theme-primary px-3 py-1 rounded-full text-xs font-medium">
                                                    {user.agencyId?.company || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-theme-primary font-medium">{user.agencyId?.sapcode || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-theme-secondary">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleApprove(user._id)}
                                                        disabled={actionLoading[user._id]}
                                                        className="px-4 py-2 bg-green-500/20 text-green-600 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                                                    >
                                                        {actionLoading[user._id] === 'approving' ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <FaCheck />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(user._id, user.email)}
                                                        disabled={actionLoading[user._id]}
                                                        className="px-4 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                                                    >
                                                        {actionLoading[user._id] === 'rejecting' ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <FaTimes />
                                                        )}
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-theme-secondary rounded-xl border border-theme-color shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-theme-primary mb-4">Reject Registration</h2>
                        <p className="text-theme-secondary text-sm mb-4">
                            Are you sure you want to reject this registration?
                        </p>
                        <p className="text-theme-primary font-medium mb-4">{rejectModal.email}</p>

                        <textarea
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            placeholder="Reason for rejection (optional)"
                            className="w-full px-4 py-2 rounded-lg bg-theme-input text-theme-primary border border-theme-color focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all text-sm mb-6 resize-none h-24"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setRejectModal({ show: false, userId: null, email: '' })}
                                className="flex-1 px-4 py-2 bg-theme-input text-theme-primary rounded-lg hover:bg-theme-input/80 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                className="flex-1 px-4 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30 transition-all font-medium"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingRegistrations;
