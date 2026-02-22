import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaBuilding, FaMapMarkerAlt, FaPlus, FaTrash, FaEdit, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import EditGodownModal from '../godown/EditGodownModal';
import AddGodownModal from '../godown/AddGodownModal';

const GeneralSettings = () => {
    const [activeTab, setActiveTab] = useState('agency');

    // Agency State
    const [agencyFormData, setAgencyFormData] = useState({
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
        contacts: [],
        gstNumber: ''
    });
    const [agencyLoading, setAgencyLoading] = useState(false);
    const [agencyFetching, setAgencyFetching] = useState(true);
    const [agencyMessage, setAgencyMessage] = useState({ type: '', text: '' });

    // Godown State
    const [godowns, setGodowns] = useState([]);
    const [godownLoading, setGodownLoading] = useState(true);
    const [godownError, setGodownError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGodown, setSelectedGodown] = useState(null);

    // Fetch Agency Details
    useEffect(() => {
        const fetchAgencyDetails = async () => {
            try {
                const res = await api.get('/admin/my-agency');
                if (res.data.success) {
                    const { agency } = res.data;
                    let contactList = [];

                    if (Array.isArray(agency.contacts) && agency.contacts.length > 0) {
                        contactList = agency.contacts;
                    } else if (agency.contactNumber && typeof agency.contactNumber === 'object') {
                        if (agency.contactNumber.mobile) contactList.push({ type: 'Mobile', number: agency.contactNumber.mobile });
                        if (agency.contactNumber.landline) contactList.push({ type: 'Landline', number: agency.contactNumber.landline });
                    }

                    setAgencyFormData({
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
                setAgencyFetching(false);
            }
        };

        fetchAgencyDetails();
    }, []);

    // Fetch Godowns
    useEffect(() => {
        fetchGodowns();
    }, []);

    const fetchGodowns = async () => {
        try {
            setGodownLoading(true);
            const response = await api.get('/inventory/stock-locations?type=GODOWN');
            if (response.data.success) {
                const sorted = (response.data.data || []).sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                setGodowns(sorted);
                setGodownError('');
            } else {
                setGodownError(response.data.message || 'Failed to load godowns');
            }
        } catch (err) {
            console.error('Error fetching godowns:', err);
            setGodownError(err.response?.data?.message || 'Error loading godowns');
        } finally {
            setGodownLoading(false);
        }
    };

    // Agency Handlers
    const handleAgencyChange = (section, field, value) => {
        if (section) {
            setAgencyFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setAgencyFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleContactChange = (index, field, value) => {
        const newContacts = [...agencyFormData.contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setAgencyFormData(prev => ({ ...prev, contacts: newContacts }));
    };

    const addContact = () => {
        if (agencyFormData.contacts.length < 3) {
            setAgencyFormData(prev => ({
                ...prev,
                contacts: [...prev.contacts, { type: 'Mobile', number: '' }]
            }));
        }
    };

    const removeContact = (index) => {
        const newContacts = agencyFormData.contacts.filter((_, i) => i !== index);
        setAgencyFormData(prev => ({ ...prev, contacts: newContacts }));
    };

    const handleAgencySubmit = async (e) => {
        e.preventDefault();
        setAgencyLoading(true);
        setAgencyMessage({ type: '', text: '' });

        try {
            const res = await api.put('/admin/my-agency', agencyFormData);
            if (res.data.success) {
                setAgencyMessage({ type: 'success', text: 'Agency details updated successfully' });
            }
        } catch (error) {
            setAgencyMessage({ type: 'error', text: error.response?.data?.message || 'Error updating agency details' });
        } finally {
            setAgencyLoading(false);
        }
    };

    // Godown Handlers
    const handleEditGodown = (godown) => {
        setSelectedGodown(godown);
        setShowEditModal(true);
    };

    const handleAddGodownSuccess = () => {
        setShowAddModal(false);
        fetchGodowns();
    };

    const handleEditGodownSuccess = () => {
        setShowEditModal(false);
        fetchGodowns();
    };

    const isDefaultGodown = (godown) => {
        return godowns.length > 0 && godown._id === godowns[0]._id;
    };

    // Agency Settings Component
    const AgencySettingsComponent = () => (
        <form onSubmit={handleAgencySubmit} className="space-y-4">
            {agencyMessage.text && (
                <div className={`p-3 rounded-md text-sm ${agencyMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {agencyMessage.text}
                </div>
            )}

            <div className="p-4 bg-theme-secondary rounded-xl border border-theme-color mb-4">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-theme-tertiary text-theme-accent">
                        <FaBuilding size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-theme-primary">{agencyFormData.name}</h2>
                        <p className="text-xs text-theme-secondary">Agency Profile</p>
                    </div>
                </div>
            </div>

            <div className="p-5 bg-theme-secondary rounded-xl border border-theme-color space-y-4">
                <h4 className="font-semibold text-theme-primary border-b border-theme-color pb-2 text-sm">Address Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['buildingNo', 'place', 'landmark', 'street', 'city', 'district', 'state', 'pincode'].map(field => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-theme-secondary mb-1 capitalize">
                                {field === 'buildingNo' ? 'Building No.' : field}
                            </label>
                            <input
                                type="text"
                                value={agencyFormData.address[field]}
                                onChange={(e) => handleAgencyChange('address', field, e.target.value)}
                                className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-5 bg-theme-secondary rounded-xl border border-theme-color space-y-4">
                <div className="flex justify-between items-center border-b border-theme-color pb-2">
                    <h4 className="font-semibold text-theme-primary text-sm">Contact Number(s)</h4>
                    {agencyFormData.contacts.length < 3 && (
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
                    {agencyFormData.contacts.map((contact, index) => (
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
                    {agencyFormData.contacts.length === 0 && (
                        <p className="text-sm text-theme-secondary italic">No contact numbers added.</p>
                    )}
                </div>

                <div className="border-t border-theme-color pt-4 mt-4">
                    <label className="block text-sm font-medium text-theme-secondary mb-1">GST Number</label>
                    <input
                        type="text"
                        value={agencyFormData.gstNumber}
                        onChange={(e) => handleAgencyChange(null, 'gstNumber', e.target.value)}
                        className="w-full px-4 py-1.5 rounded-lg border border-theme-color bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={agencyLoading}
                    className={`px-5 py-2 rounded-lg font-medium text-white text-sm transition-colors duration-200 ${agencyLoading ? 'bg-theme-secondary cursor-not-allowed' : 'bg-theme-accent hover:bg-theme-accent/90'}`}
                >
                    {agencyLoading ? 'Updating...' : 'Update Agency Details'}
                </button>
            </div>
        </form>
    );

    // Godown Settings Component
    const GodownSettingsComponent = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-theme-primary">Godown Management</h3>
                    <p className="text-sm text-theme-secondary">Manage your godowns and stock locations</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-theme-accent text-white font-medium rounded-lg hover:bg-theme-accent-hover transition text-sm"
                >
                    <FaPlus /> Add Godown
                </button>
            </div>

            <div className="p-4 bg-theme-secondary border border-theme-color rounded-lg">
                <p className="text-theme-primary text-sm">
                    <span className="font-semibold">Note:</span> The default godown (marked with <FaCheckCircle className="inline text-theme-accent" /> Default) receives all opening stock automatically.
                </p>
            </div>

            {godownError && (
                <div className="p-4 bg-theme-secondary border border-error-color rounded-lg text-error-color text-sm">
                    {godownError}
                </div>
            )}

            {godownLoading ? (
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="animate-spin text-2xl text-theme-accent" />
                </div>
            ) : godowns.length === 0 ? (
                <div className="text-center py-12 bg-theme-secondary rounded-lg border border-theme-color">
                    <FaMapMarkerAlt className="mx-auto h-12 w-12 text-theme-secondary mb-3" />
                    <p className="text-theme-secondary mb-4">No godowns found</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-theme-accent text-white font-medium rounded-lg hover:bg-theme-accent-hover transition text-sm"
                    >
                        <FaPlus /> Create Your First Godown
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {godowns.map((godown) => (
                        <div key={godown._id} className="bg-theme-secondary rounded-lg border border-theme-color overflow-hidden hover:shadow-lg transition">
                            <div className="bg-theme-tertiary px-5 py-3 border-b border-theme-color">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-theme-primary text-sm">{godown.name}</h4>
                                        {godown.code && <p className="text-xs text-theme-secondary">{godown.code}</p>}
                                    </div>
                                    <FaMapMarkerAlt className="text-theme-accent text-lg" />
                                </div>
                            </div>

                            <div className="px-5 py-3 space-y-2 text-sm">
                                {isDefaultGodown(godown) && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-theme-accent/10 rounded border border-theme-accent text-xs">
                                        <FaCheckCircle className="text-theme-accent" /> Default
                                    </div>
                                )}
                                {godown.address && <p className="text-xs text-theme-secondary">{godown.address}</p>}
                                <div className="flex items-center gap-1">
                                    {godown.isActive ? (
                                        <>
                                            <FaCheckCircle className="text-green-500 text-xs" />
                                            <span className="text-xs text-green-600">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle className="text-red-500 text-xs" />
                                            <span className="text-xs text-red-600">Inactive</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleEditGodown(godown)}
                                className="w-full px-4 py-2 bg-theme-tertiary border-t border-theme-color text-theme-accent hover:bg-theme-accent hover:text-white text-xs font-medium transition flex items-center justify-center gap-2"
                            >
                                <FaEdit /> Edit
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && <AddGodownModal onClose={() => setShowAddModal(false)} onSuccess={handleAddGodownSuccess} />}
            {showEditModal && selectedGodown && (
                <EditGodownModal
                    godown={selectedGodown}
                    allGodowns={godowns}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={handleEditGodownSuccess}
                />
            )}
        </div>
    );

    const tabs = [
        { id: 'agency', label: 'Agency', icon: FaBuilding },
        { id: 'godowns', label: 'Godowns', icon: FaMapMarkerAlt }
    ];

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-theme-color">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive
                                    ? 'border-theme-accent text-theme-accent'
                                    : 'border-transparent text-theme-secondary hover:text-theme-primary'
                                }`}
                        >
                            <Icon /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="animate-fadeIn">
                {activeTab === 'agency' && (
                    agencyFetching ? (
                        <div className="text-center py-12">
                            <FaSpinner className="animate-spin text-2xl text-theme-accent mx-auto" />
                            <p className="text-theme-secondary text-sm mt-2">Loading agency details...</p>
                        </div>
                    ) : (
                        <AgencySettingsComponent />
                    )
                )}
                {activeTab === 'godowns' && <GodownSettingsComponent />}
            </div>
        </div>
    );
};

export default GeneralSettings;
