import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import api from '../../axios/axiosInstance';

const AddGodownModal = ({ onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [address, setAddress] = useState('');
    const [contact, setContact] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Godown name is required');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/inventory/stock-locations', {
                locationType: 'GODOWN',
                name: name.trim(),
                code: code.trim() || undefined,
                address: address.trim() || undefined,
                contact: contact.trim() || undefined,
                notes: notes.trim() || undefined,
                isActive: true
            });

            if (response.data.success) {
                onSuccess?.();
            } else {
                setError(response.data.message || 'Failed to add godown');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding godown');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3">
            <div className="bg-theme-secondary rounded-xl shadow-2xl w-full max-w-2xl border border-theme-color max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between p-4 md:p-5 border-b border-theme-color bg-theme-tertiary">
                    <h2 className="text-lg md:text-xl font-bold text-theme-primary">Add New Godown</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-theme-secondary hover:text-theme-primary hover:bg-theme-color/20 rounded-lg transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 md:p-5 space-y-4">
                    {error && (
                        <div className="p-3 bg-theme-secondary border border-error-color rounded-lg text-error-color text-sm">
                            {error}
                        </div>
                    )}

                    {/* Grid Layout - 2 columns on md+, 1 column on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-theme-primary mb-1.5">
                                Godown Name <span className="text-error-color">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-theme-color rounded-lg bg-theme-primary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                                placeholder="e.g., Main Warehouse"
                                required
                            />
                        </div>

                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-theme-primary mb-1.5">
                                Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-theme-color rounded-lg bg-theme-primary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                                placeholder="e.g., GDN-02"
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-theme-primary mb-1.5">
                                Contact
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-theme-color rounded-lg bg-theme-primary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                                placeholder="Phone or email"
                            />
                        </div>
                    </div>

                    {/* Address - Full Width */}
                    <div>
                        <label className="block text-sm font-medium text-theme-primary mb-1.5">
                            Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            rows="1"
                            className="w-full px-3 py-2 text-sm border border-theme-color rounded-lg bg-theme-primary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent resize-none"
                            placeholder="Street, City, State"
                        />
                    </div>

                    {/* Notes - Full Width */}
                    <div>
                        <label className="block text-sm font-medium text-theme-primary mb-1.5">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="1"
                            className="w-full px-3 py-2 text-sm border border-theme-color rounded-lg bg-theme-primary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent resize-none"
                            placeholder="Any additional information"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-theme-color">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm border border-theme-color text-theme-primary rounded-lg hover:bg-theme-tertiary transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm bg-theme-accent text-white rounded-lg hover:bg-theme-accent-hover transition font-medium disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Godown'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGodownModal;
