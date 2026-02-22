import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios/axiosInstance';
import { FaPlus, FaEdit, FaSpinner, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import EditGodownModal from '../../components/godown/EditGodownModal';
import AddGodownModal from '../../components/godown/AddGodownModal';

const GodownSettingsPage = () => {
    // const navigate = useNavigate();
    const [godowns, setGodowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGodown, setSelectedGodown] = useState(null);

    // Fetch godowns on mount
    useEffect(() => {
        fetchGodowns();
    }, []);

    const fetchGodowns = async () => {
        try {
            setLoading(true);
            const response = await api.get('/inventory/stock-locations?type=GODOWN');
            if (response.data.success) {
                // Sort by createdAt ascending to show default (oldest) first
                const sorted = (response.data.data || []).sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                setGodowns(sorted);
                setError('');
            } else {
                setError(response.data.message || 'Failed to load godowns');
            }
        } catch (err) {
            console.error('Error fetching godowns:', err);
            setError(err.response?.data?.message || 'Error loading godowns');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (godown) => {
        setSelectedGodown(godown);
        setShowEditModal(true);
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        fetchGodowns();
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchGodowns();
    };

    const isDefaultGodown = (godown) => {
        return godowns.length > 0 && godown._id === godowns[0]._id;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-theme-accent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-theme-primary py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-theme-primary">Godown Settings</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-theme-accent text-white font-medium rounded-lg hover:bg-theme-accent-hover transition"
                    >
                        <FaPlus />
                        Add New Godown
                    </button>
                </div>

                {/* Important Note */}
                <div className="mb-6 p-4 bg-theme-secondary border border-theme-color rounded-lg">
                    <p className="text-theme-primary text-sm">
                        <span className="font-semibold">Note:</span> The default godown (marked with{' '}
                        <FaCheckCircle className="inline text-theme-accent" /> Default badge) receives all opening stock automatically when products are internalized.
                        The default is the oldest godown and cannot be changed to keep things simple. To change defaults, contact support.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-theme-secondary border border-error-color rounded-lg text-error-color">
                        {error}
                    </div>
                )}

                {/* Godowns Grid */}
                {godowns.length === 0 ? (
                    <div className="text-center py-12 bg-theme-secondary rounded-lg shadow border border-theme-color">
                        <FaMapMarkerAlt className="mx-auto h-16 w-16 text-theme-secondary mb-4" />
                        <p className="text-xl text-theme-secondary mb-6">No godowns found</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-theme-accent text-white font-medium rounded-lg hover:bg-theme-accent-hover transition"
                        >
                            <FaPlus />
                            Create Your First Godown
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {godowns.map((godown) => (
                            <div
                                key={godown._id}
                                className="bg-theme-secondary rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-theme-color"
                            >
                                {/* Header with Icon */}
                                <div className="bg-theme-primary px-6 py-4 border-b border-theme-color">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-theme-primary">{godown.name}</h3>
                                            {godown.code && (
                                                <p className="text-sm text-theme-primary">{godown.code}</p>
                                            )}
                                        </div>
                                        <FaMapMarkerAlt className="text-theme-accent text-2xl mt-1" />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="px-6 py-4 space-y-3">
                                    {/* Default Badge */}
                                    {isDefaultGodown(godown) && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-theme-ternary bg-opacity-3 rounded border border-theme-accent">
                                            <FaCheckCircle className="text-theme-accent text-sm" />
                                            <span className="text-sm font-medium text-theme-accent">Default</span>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {godown.address && (
                                        <div>
                                            <p className="text-xs text-theme-secondary uppercase tracking-wide">Address</p>
                                            <p className="text-sm text-theme-primary">{godown.address}</p>
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {godown.notes && (
                                        <div>
                                            <p className="text-xs text-theme-secondary uppercase tracking-wide">Notes</p>
                                            <p className="text-sm text-theme-primary">{godown.notes}</p>
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-theme-secondary uppercase tracking-wide">Status:</p>
                                        <div className="flex items-center gap-1">
                                            {godown.isActive ? (
                                                <>
                                                    <FaCheckCircle className="text-green-500 text-sm" />
                                                    <span className="text-sm font-medium text-green-600">Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimesCircle className="text-red-500 text-sm" />
                                                    <span className="text-sm font-medium text-error-color">Inactive</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div>
                                        <p className="text-xs text-theme-secondary">
                                            Created: {new Date(godown.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="bg-theme-tertiary px-6 py-3 border-t border-theme-color">
                                    <button
                                        onClick={() => handleEdit(godown)}
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-theme-accent text-white text-sm font-medium rounded hover:bg-theme-accent-hover transition"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Godown Modal */}
                {showAddModal && (
                    <AddGodownModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={handleAddSuccess}
                    />
                )}

                {/* Edit Godown Modal */}
                {showEditModal && selectedGodown && (
                    <EditGodownModal
                        godown={selectedGodown}
                        allGodowns={godowns}
                        onClose={() => setShowEditModal(false)}
                        onSuccess={handleEditSuccess}
                    />
                )}
            </div>
        </div>
    );
};

export default GodownSettingsPage;
