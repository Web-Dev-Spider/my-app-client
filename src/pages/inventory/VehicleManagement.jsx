import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import {
    FaPlus, FaEdit, FaTrash, FaTruck, FaCheckCircle, FaTimesCircle,
    FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaTimes, FaSave
} from 'react-icons/fa';

// ── Compliance helpers ─────────────────────────────────────────────────────────

const COMPLIANCE_FIELDS = [
    { key: 'fitness', label: 'Fitness', certLabel: 'Certificate No.' },
    { key: 'pollution', label: 'Pollution', certLabel: 'Certificate No.' },
    { key: 'insurance', label: 'Insurance', certLabel: 'Policy No.' },
    { key: 'permit', label: 'Permit', certLabel: 'Permit No.' },
    { key: 'roadTax', label: 'Road Tax', certLabel: 'Receipt No.' },
    { key: 'tax', label: 'Tax', certLabel: 'Receipt No.' },
];

function getDaysRemaining(dateStr) {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

function ComplianceBadge({ expiryDate }) {
    const days = getDaysRemaining(expiryDate);
    if (days === null) return <span className="text-xs text-gray-400">—</span>;

    if (days < 0)
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                <FaExclamationCircle className="text-[10px]" /> Expired {Math.abs(days)}d ago
            </span>
        );
    if (days <= 7)
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                <FaExclamationTriangle className="text-[10px]" /> {days}d left
            </span>
        );
    if (days <= 30)
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <FaExclamationTriangle className="text-[10px]" /> {days}d left
            </span>
        );
    if (days <= 60)
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <FaInfoCircle className="text-[10px]" /> {days}d left
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <FaCheckCircle className="text-[10px]" /> Valid
        </span>
    );
}

// ── Default form state ─────────────────────────────────────────────────────────

const emptyForm = () => ({
    registrationNumber: '',
    vehicleType: 'TRUCK',
    make: '',
    model: '',
    yearOfManufacture: '',
    fitness: { expiryDate: '', certificateNumber: '' },
    pollution: { expiryDate: '', certificateNumber: '' },
    insurance: { expiryDate: '', policyNumber: '', insurer: '' },
    permit: { expiryDate: '', permitNumber: '', permitType: '' },
    roadTax: { expiryDate: '', receiptNumber: '' },
    tax: { expiryDate: '', receiptNumber: '' },
    remarks: '',
});

function toInputDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().slice(0, 10);
}

function vehicleToForm(v) {
    return {
        registrationNumber: v.registrationNumber || '',
        vehicleType: v.vehicleType || 'TRUCK',
        make: v.make || '',
        model: v.model || '',
        yearOfManufacture: v.yearOfManufacture || '',
        fitness: { expiryDate: toInputDate(v.fitness?.expiryDate), certificateNumber: v.fitness?.certificateNumber || '' },
        pollution: { expiryDate: toInputDate(v.pollution?.expiryDate), certificateNumber: v.pollution?.certificateNumber || '' },
        insurance: { expiryDate: toInputDate(v.insurance?.expiryDate), policyNumber: v.insurance?.policyNumber || '', insurer: v.insurance?.insurer || '' },
        permit: { expiryDate: toInputDate(v.permit?.expiryDate), permitNumber: v.permit?.permitNumber || '', permitType: v.permit?.permitType || '' },
        roadTax: { expiryDate: toInputDate(v.roadTax?.expiryDate), receiptNumber: v.roadTax?.receiptNumber || '' },
        tax: { expiryDate: toInputDate(v.tax?.expiryDate), receiptNumber: v.tax?.receiptNumber || '' },
        remarks: v.remarks || '',
    };
}

// ── Component ──────────────────────────────────────────────────────────────────

const VehicleManagement = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [formData, setFormData] = useState(emptyForm());
    const [message, setMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchVehicles(); }, []);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/inventory/vehicles');
            if (res.data.success) setVehicles(res.data.vehicles);
        } catch {
            showMessage('Error fetching vehicles', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // ── Form helpers ──────────────────────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const openModal = (vehicle = null) => {
        setEditingVehicle(vehicle);
        setFormData(vehicle ? vehicleToForm(vehicle) : emptyForm());
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
        setFormData(emptyForm());
    };

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingVehicle) {
                const res = await api.put(`/inventory/vehicle/${editingVehicle._id}`, formData);
                if (res.data.success) {
                    setVehicles(prev => prev.map(v => v._id === res.data.vehicle._id ? res.data.vehicle : v));
                    showMessage('Vehicle updated successfully');
                    closeModal();
                }
            } else {
                const res = await api.post('/inventory/vehicle', formData);
                if (res.data.success) {
                    setVehicles(prev => [res.data.vehicle, ...prev]);
                    showMessage('Vehicle added successfully');
                    closeModal();
                }
            }
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error saving vehicle', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete / Toggle ───────────────────────────────────────────────────────

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle? This cannot be undone.')) return;
        try {
            const res = await api.delete(`/inventory/vehicle/${id}`);
            if (res.data.success) {
                setVehicles(prev => prev.filter(v => v._id !== id));
                showMessage('Vehicle deleted successfully');
            }
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error deleting vehicle', 'error');
        }
    };

    const handleToggleStatus = async (vehicle) => {
        try {
            const res = await api.put(`/inventory/vehicle/${vehicle._id}/status`, { isActive: !vehicle.isActive });
            if (res.data.success) {
                setVehicles(prev => prev.map(v => v._id === vehicle._id ? res.data.vehicle : v));
                showMessage(res.data.message);
            }
        } catch (error) {
            showMessage(error.response?.data?.message || 'Error updating status', 'error');
        }
    };

    // ── Compliance summary for a vehicle ──────────────────────────────────────

    const getWorstCompliance = (v) => {
        let worst = null;
        for (const f of COMPLIANCE_FIELDS) {
            const d = getDaysRemaining(v[f.key]?.expiryDate);
            if (d === null) continue;
            if (worst === null || d < worst) worst = d;
        }
        return worst;
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="p-6 bg-theme-primary min-h-screen">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-theme-primary flex items-center gap-2">
                            <FaTruck className="text-blue-600" /> Vehicle Management
                        </h1>
                        <p className="text-sm text-theme-secondary mt-0.5">
                            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow"
                    >
                        <FaPlus /> Add Vehicle
                    </button>
                </div>

                {/* Toast message */}
                {message.text && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border ${message.type === 'error'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Vehicle Table */}
                <div className="bg-theme-secondary rounded-xl border border-theme-color shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-theme-secondary text-sm">Loading vehicles...</div>
                    ) : vehicles.length === 0 ? (
                        <div className="p-12 text-center text-theme-secondary text-sm">
                            No vehicles added yet. Click "Add Vehicle" to get started.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-theme-tertiary/50 text-theme-secondary text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-5 py-4">Vehicle</th>
                                        <th className="px-5 py-4">Type</th>
                                        <th className="px-5 py-4">Fitness</th>
                                        <th className="px-5 py-4">Pollution</th>
                                        <th className="px-5 py-4">Insurance</th>
                                        <th className="px-5 py-4">Permit</th>
                                        <th className="px-5 py-4 text-center">Status</th>
                                        <th className="px-5 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-theme-color">
                                    {vehicles.map(v => {
                                        const worst = getWorstCompliance(v);
                                        const hasAlert = worst !== null && worst <= 30;
                                        return (
                                            <tr key={v._id} className="hover:bg-theme-tertiary/20 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {hasAlert && (
                                                            <FaExclamationTriangle className={`text-xs shrink-0 ${worst <= 7 ? 'text-red-500' : 'text-amber-500'}`} />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-semibold text-theme-primary">{v.registrationNumber}</p>
                                                            {(v.make || v.model) && (
                                                                <p className="text-xs text-theme-secondary">{[v.make, v.model].filter(Boolean).join(' ')}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                                        {v.vehicleType}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4"><ComplianceBadge expiryDate={v.fitness?.expiryDate} /></td>
                                                <td className="px-5 py-4"><ComplianceBadge expiryDate={v.pollution?.expiryDate} /></td>
                                                <td className="px-5 py-4"><ComplianceBadge expiryDate={v.insurance?.expiryDate} /></td>
                                                <td className="px-5 py-4"><ComplianceBadge expiryDate={v.permit?.expiryDate} /></td>
                                                <td className="px-5 py-4 text-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(v)}
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {v.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                                                        {v.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openModal(v)}
                                                            className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FaEdit className="text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(v._id)}
                                                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash className="text-sm" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
                    <div className="bg-theme-secondary w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden border border-theme-color">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-theme-tertiary border-b border-theme-color shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-theme-accent/20">
                                    <FaTruck className="text-theme-accent text-sm" />
                                </div>
                                <h2 className="text-sm font-bold text-theme-primary">
                                    {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                                </h2>
                            </div>
                            <button onClick={closeModal} className="p-1.5 hover:bg-theme-primary rounded-lg transition-colors">
                                <FaTimes className="text-theme-secondary text-xs" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="px-4 py-4 space-y-4">

                                {/* Basic Info */}
                                <div>
                                    <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <span className="flex-1 border-t border-theme-color"></span>
                                        Vehicle Details
                                        <span className="flex-1 border-t border-theme-color"></span>
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-semibold text-theme-primary mb-1">
                                                Registration No. <span className="text-error-color">*</span>
                                            </label>
                                            <input
                                                name="registrationNumber"
                                                value={formData.registrationNumber}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. KL 07 AB 1234"
                                                className="w-full px-3 py-2 rounded-lg border border-theme-color bg-theme-input text-theme-primary text-sm font-semibold placeholder:font-normal placeholder:text-theme-secondary focus:outline-none focus:ring-1 focus:ring-theme-accent uppercase"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-theme-primary mb-1">Type <span className="text-error-color">*</span></label>
                                            <select
                                                name="vehicleType"
                                                value={formData.vehicleType}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 rounded-lg border border-theme-color bg-theme-input text-theme-primary text-sm focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                            >
                                                {['TRUCK', 'TEMPO', 'AUTO', 'VAN', 'PICKUP', 'OTHER'].map(t => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-theme-primary mb-1">Year</label>
                                            <input
                                                name="yearOfManufacture"
                                                type="number"
                                                value={formData.yearOfManufacture}
                                                onChange={handleChange}
                                                placeholder="e.g. 2020"
                                                min="1980"
                                                max={new Date().getFullYear()}
                                                className="w-full px-3 py-2 rounded-lg border border-theme-color bg-theme-input text-theme-primary text-sm placeholder:text-theme-secondary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-theme-primary mb-1">Make</label>
                                            <input
                                                name="make"
                                                value={formData.make}
                                                onChange={handleChange}
                                                placeholder="e.g. Tata"
                                                className="w-full px-3 py-2 rounded-lg border border-theme-color bg-theme-input text-theme-primary text-sm placeholder:text-theme-secondary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-theme-primary mb-1">Model</label>
                                            <input
                                                name="model"
                                                value={formData.model}
                                                onChange={handleChange}
                                                placeholder="e.g. Ace"
                                                className="w-full px-3 py-2 rounded-lg border border-theme-color bg-theme-input text-theme-primary text-sm placeholder:text-theme-secondary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Compliance — compact table */}
                                <div>
                                    <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <span className="flex-1 border-t border-theme-color"></span>
                                        Compliance Documents
                                        <span className="flex-1 border-t border-theme-color"></span>
                                    </p>
                                    <div className="rounded-xl border border-theme-color overflow-hidden">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="bg-theme-tertiary border-b border-theme-color">
                                                    <th className="px-3 py-2 text-left font-bold text-theme-secondary uppercase tracking-wide w-[28%]">Doc</th>
                                                    <th className="px-3 py-2 text-left font-bold text-theme-secondary uppercase tracking-wide w-[36%]">Expiry</th>
                                                    <th className="px-3 py-2 text-left font-bold text-theme-secondary uppercase tracking-wide">Ref. No.</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-theme-color">
                                                {[
                                                    { label: 'Fitness',   dateField: 'fitness.expiryDate',   refField: 'fitness.certificateNumber',   ph: 'Cert. No.' },
                                                    { label: 'Pollution', dateField: 'pollution.expiryDate', refField: 'pollution.certificateNumber', ph: 'Cert. No.' },
                                                    { label: 'Insurance', dateField: 'insurance.expiryDate', refField: 'insurance.policyNumber',      ph: 'Policy No.' },
                                                    { label: 'Permit',    dateField: 'permit.expiryDate',    refField: 'permit.permitNumber',         ph: 'Permit No.' },
                                                    { label: 'Road Tax',  dateField: 'roadTax.expiryDate',   refField: 'roadTax.receiptNumber',       ph: 'Receipt No.' },
                                                    { label: 'Tax',       dateField: 'tax.expiryDate',       refField: 'tax.receiptNumber',           ph: 'Receipt No.' },
                                                ].map((row, i) => {
                                                    const [p1d, c1d] = row.dateField.split('.');
                                                    const [p1r, c1r] = row.refField.split('.');
                                                    return (
                                                        <tr key={row.label} className={i % 2 === 0 ? 'bg-theme-secondary' : 'bg-theme-primary'}>
                                                            <td className="px-3 py-2 font-semibold text-theme-primary whitespace-nowrap">{row.label}</td>
                                                            <td className="px-2 py-1.5">
                                                                <input type="date"
                                                                    name={row.dateField}
                                                                    value={formData[p1d][c1d]}
                                                                    onChange={handleChange}
                                                                    className="w-full px-2 py-1 rounded border border-theme-color bg-theme-input text-theme-primary text-xs focus:outline-none focus:ring-1 focus:ring-theme-accent" />
                                                            </td>
                                                            <td className="px-2 py-1.5">
                                                                <input type="text"
                                                                    name={row.refField}
                                                                    value={formData[p1r][c1r]}
                                                                    onChange={handleChange}
                                                                    placeholder={row.ph}
                                                                    className="w-full px-2 py-1 rounded border border-theme-color bg-theme-input text-theme-primary text-xs placeholder:text-theme-secondary focus:outline-none focus:ring-1 focus:ring-theme-accent" />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div>
                                    <label className="block text-xs font-semibold text-theme-primary mb-1">Remarks</label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Optional notes..."
                                        className="w-full px-3 py-2 rounded-lg border border-theme-color bg-theme-input text-theme-primary text-sm placeholder:text-theme-secondary focus:outline-none focus:ring-1 focus:ring-theme-accent resize-none"
                                    />
                                </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="px-4 py-3 border-t border-theme-color bg-theme-tertiary flex justify-end gap-2 shrink-0">
                                <button type="button" onClick={closeModal}
                                    className="px-4 py-2 rounded-lg border border-theme-color text-sm font-semibold text-theme-primary hover:bg-theme-primary transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-theme-accent text-sm font-semibold transition-colors disabled:opacity-60"
                                    style={{ color: 'var(--bg-primary)' }}>
                                    <FaSave className="text-xs" />
                                    {submitting ? 'Saving...' : editingVehicle ? 'Update' : 'Add Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleManagement;
