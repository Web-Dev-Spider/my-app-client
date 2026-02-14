import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaBuilding, FaPlus, FaTrash } from 'react-icons/fa';

const AgencySettings = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: {
            buildingNo: '',
            place: '',
            landmark: '',
            street: '',
            city: '',
            district: '',
            state: '',
            pincode: ''
        },
        contacts: [], // Updated to 'contacts'
        gstNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchAgencyDetails = async () => {
            try {
                const res = await api.get('/admin/my-agency');
                if (res.data.success) {
                    const { agency } = res.data;
                    let contactList = [];

                    // Priority 1: New 'contacts' array
                    if (Array.isArray(agency.contacts) && agency.contacts.length > 0) {
                        contactList = agency.contacts;
                    }
                    // Priority 2: Legacy 'contactNumber' object migration
                    else if (agency.contactNumber && typeof agency.contactNumber === 'object') {
                        if (agency.contactNumber.mobile) contactList.push({ type: 'Mobile', number: agency.contactNumber.mobile });
                        if (agency.contactNumber.landline) contactList.push({ type: 'Landline', number: agency.contactNumber.landline });
                    }

                    setFormData({
                        name: agency.name || '',
                        address: {
                            buildingNo: agency.address?.buildingNo || '',
                            place: agency.address?.place || '',
                            landmark: agency.address?.landmark || '',
                            street: agency.address?.street || '',
                            city: agency.address?.city || '',
                            district: agency.address?.district || '',
                            state: agency.address?.state || '',
                            pincode: agency.address?.pincode || ''
                        },
                        contacts: contactList,
                        gstNumber: agency.gstNumber || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching agency details:", error);
            } finally {
                setFetching(false);
            }
        };

        fetchAgencyDetails();
    }, []);

    const handleChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...formData.contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setFormData(prev => ({ ...prev, contacts: newContacts }));
    };

    const addContact = () => {
        if (formData.contacts.length < 3) {
            setFormData(prev => ({
                ...prev,
                contacts: [...prev.contacts, { type: 'Mobile', number: '' }]
            }));
        }
    };

    const removeContact = (index) => {
        const newContacts = formData.contacts.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, contacts: newContacts }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await api.put('/admin/my-agency', formData);
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Agency details updated successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating agency details' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-theme-secondary">Loading agency details...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message.text && (
                <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Agency Name Display */}
            <div className="p-4 bg-theme-secondary rounded-xl border border-theme-color mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-theme-tertiary text-theme-accent">
                        <FaBuilding size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-theme-primary">{formData.name}</h2>
                        <p className="text-xs text-theme-secondary">Agency Profile</p>
                    </div>
                </div>
            </div>

            <div className="p-5 bg-theme-secondary rounded-xl border border-theme-color space-y-4">
                <h4 className="font-semibold text-theme-primary border-b border-theme-color pb-2 text-sm">Address Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Building No.</label>
                        <input
                            type="text"
                            value={formData.address.buildingNo}
                            onChange={(e) => handleChange('address', 'buildingNo', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Place</label>
                        <input
                            type="text"
                            value={formData.address.place}
                            onChange={(e) => handleChange('address', 'place', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Landmark</label>
                        <input
                            type="text"
                            value={formData.address.landmark}
                            onChange={(e) => handleChange('address', 'landmark', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Street</label>
                        <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => handleChange('address', 'street', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">City</label>
                        <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleChange('address', 'city', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">District</label>
                        <input
                            type="text"
                            value={formData.address.district}
                            onChange={(e) => handleChange('address', 'district', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">State</label>
                        <input
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => handleChange('address', 'state', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-1">Pincode</label>
                        <input
                            type="text"
                            value={formData.address.pincode}
                            onChange={(e) => handleChange('address', 'pincode', e.target.value)}
                            className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="p-5 bg-theme-secondary rounded-xl border border-theme-color space-y-4">
                <div className="flex justify-between items-center border-b border-theme-color pb-2">
                    <h4 className="font-semibold text-theme-primary text-sm">Contact Number(s)</h4>
                    {formData.contacts.length < 3 && (
                        <button
                            type="button"
                            onClick={addContact}
                            className="flex items-center gap-1 text-xs text-theme-accent hover:text-theme-accent/80 transition-colors"
                        >
                            <FaPlus /> Add Number
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {formData.contacts.map((contact, index) => (
                        <div key={index} className="flex gap-3 items-end">
                            <div className="w-1/3">
                                <label className="block text-xs font-medium text-theme-secondary mb-1">Type</label>
                                <select
                                    value={contact.type}
                                    onChange={(e) => handleContactChange(index, 'type', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                                >
                                    <option value="Mobile">Mobile</option>
                                    <option value="Landline">Landline</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-theme-secondary mb-1">Number</label>
                                <input
                                    type="text"
                                    value={contact.number}
                                    onChange={(e) => handleContactChange(index, 'number', e.target.value)}
                                    className="w-full px-3 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                                    placeholder="Enter contact number"
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeContact(index)}
                                className="p-2 text-red-500 hover:text-red-700 bg-theme-tertiary rounded-lg border border-theme-color mb-[1px]"
                                title="Remove Number"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    ))}
                    {formData.contacts.length === 0 && (
                        <p className="text-sm text-theme-secondary italic">No contact numbers added.</p>
                    )}
                </div>

                <div className="border-t border-theme-color pt-4 mt-4">
                    <label className="block text-sm font-medium text-theme-secondary mb-1">GST Number</label>
                    <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => handleChange(null, 'gstNumber', e.target.value)}
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2 rounded-lg font-medium text-white text-sm transition-colors duration-200 ${loading ? 'bg-theme-secondary cursor-not-allowed' : 'bg-theme-accent hover:bg-theme-accent/90'}`}
                >
                    {loading ? 'Updating...' : 'Update Agency Details'}
                </button>
            </div>
        </form>
    );
};

export default AgencySettings;
