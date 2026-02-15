import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaBuilding } from 'react-icons/fa';

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        gstNumber: '',
        contactPerson: '',
        contactNumber: '',
        email: '',
        address: { street: '', city: '', state: '', pincode: '' }
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/inventory/suppliers');
            if (res.data.success) {
                setSuppliers(res.data.suppliers);
            }
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Error fetching suppliers', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                const res = await api.put(`/inventory/supplier/${editingSupplier._id}`, formData);
                if (res.data.success) {
                    setMessage({ text: 'Supplier updated successfully', type: 'success' });
                    setSuppliers(prev => prev.map(s => s._id === res.data.supplier._id ? res.data.supplier : s));
                    closeModal();
                }
            } else {
                const res = await api.post('/inventory/supplier', formData);
                if (res.data.success) {
                    setMessage({ text: 'Supplier added successfully', type: 'success' });
                    setSuppliers(prev => [res.data.supplier, ...prev]);
                    closeModal();
                }
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error saving supplier', type: 'error' });
        }
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            gstNumber: supplier.gstNumber || '',
            contactPerson: supplier.contactPerson || '',
            contactNumber: supplier.contactNumber || '',
            email: supplier.email || '',
            address: {
                street: supplier.address?.street || '',
                city: supplier.address?.city || '',
                state: supplier.address?.state || '',
                pincode: supplier.address?.pincode || ''
            }
        });
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (supplier) => {
        try {
            const res = await api.put(`/inventory/supplier/${supplier._id}/status`, { isActive: !supplier.isActive });
            if (res.data.success) {
                setSuppliers(prev => prev.map(s => s._id === supplier._id ? { ...s, isActive: !s.isActive } : s));
                setMessage({ text: `Supplier ${!supplier.isActive ? 'activated' : 'deactivated'}`, type: 'success' });
            }
        } catch (error) {
            setMessage({ text: 'Error updating status', type: 'error' });
        }
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
        setFormData({
            name: '',
            gstNumber: '',
            contactPerson: '',
            contactNumber: '',
            email: '',
            address: { street: '', city: '', state: '', pincode: '' }
        });
    };

    return (
        <div className="p-4 animate-fadeIn max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <FaBuilding className="text-theme-primary text-xl" />
                    <h1 className="text-lg font-bold text-theme-primary">Suppliers</h1>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{suppliers.length} Total</span>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-theme-accent text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:opacity-90 transition-all shadow-sm"
                >
                    <FaPlus size={12} /> Add
                </button>
            </div>

            {message.text && (
                <div className={`px-3 py-2 mb-3 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8 text-gray-500 text-sm">Loading...</div>
            ) : suppliers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed">No suppliers found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {suppliers.map(supplier => (
                        <div key={supplier._id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-theme-accent hover:shadow-sm transition-all flex flex-col justify-between h-full group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-theme-primary text-sm truncate" title={supplier.name}>{supplier.name}</h3>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{supplier.gstNumber || 'No GST'}</div>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${supplier.isActive ? 'bg-green-500' : 'bg-red-500'}`} title={supplier.isActive ? 'Active' : 'Inactive'}></span>
                                </div>

                                <div className="space-y-1 mb-3">
                                    <div className="text-xs text-gray-600 truncate">
                                        <span className="font-medium text-gray-700">{supplier.contactPerson}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="truncate">{supplier.contactNumber || '-'}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-400 truncate">
                                        {supplier.address?.city}, {supplier.address?.state}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-2 mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleToggleStatus(supplier)}
                                    className={`p-1 rounded hover:bg-gray-100 text-xs ${supplier.isActive ? 'text-red-500' : 'text-green-500'}`}
                                    title={supplier.isActive ? 'Deactivate' : 'Activate'}
                                >
                                    {supplier.isActive ? <FaTimes size={12} /> : <FaCheck size={12} />}
                                </button>
                                <button
                                    onClick={() => handleEdit(supplier)}
                                    className="p-1 rounded hover:bg-gray-100 text-blue-500 text-xs"
                                    title="Edit"
                                >
                                    <FaEdit size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-base font-bold text-gray-800">
                                {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Company Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-0.5">GST No</label>
                                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="w-full border rounded px-2 py-1.5 text-sm uppercase focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Phone</label>
                                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Contact Person</label>
                                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                </div>
                            </div>

                            <div className="border-t pt-2">
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Address</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <input type="text" name="address.street" value={formData.address.street} onChange={handleInputChange} placeholder="Street Address" className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                    </div>
                                    <input type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} placeholder="City" className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                    <input type="text" name="address.state" value={formData.address.state} onChange={handleInputChange} placeholder="State" className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent" />
                                    <input type="text" name="address.pincode" value={formData.address.pincode} onChange={handleInputChange} placeholder="Pincode" className="w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-theme-accent focus:border-theme-accent col-span-2 md:col-span-1" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t mt-2">
                                <button type="button" onClick={closeModal} className="px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="bg-theme-accent text-white px-4 py-1.5 rounded text-xs hover:opacity-90">{editingSupplier ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierManagement;
