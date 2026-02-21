import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios/axiosInstance';
import { FaPlus, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const IssueStockPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Vehicle Selection, 2: Products
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Step 1: Vehicle Selection
    const [vehicles, setVehicles] = useState([]);
    const [godowns, setGodowns] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [driverName, setDriverName] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [tripNumber, setTripNumber] = useState(1);
    const [todayTripsCount, setTodayTripsCount] = useState(0);
    const [selectedGodown, setSelectedGodown] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [remarks, setRemarks] = useState('');

    // Step 2: Products
    const [ledgers, setLedgers] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allowOverdraft, setAllowOverdraft] = useState(false);
    const [stockWarnings, setStockWarnings] = useState({});

    // Fetch vehicles and godowns on load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [vehiclesRes, godownsRes] = await Promise.all([
                    api.get('/inventory/vehicles'),
                    api.get('/inventory/stock-locations?type=GODOWN'),
                ]);

                if (vehiclesRes.data.success) {
                    setVehicles(vehiclesRes.data.data || []);
                }
                if (godownsRes.data.success) {
                    const godownList = godownsRes.data.data || [];
                    setGodowns(godownList);
                    if (godownList.length === 1) {
                        setSelectedGodown(godownList[0]._id);
                    }
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Error loading vehicles and godowns');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // When vehicle is selected
    const handleVehicleSelect = async (vehicleId) => {
        const vehicle = vehicles.find((v) => v._id === vehicleId);
        if (!vehicle) return;

        setSelectedVehicle(vehicleId);
        setDriverName(vehicle.defaultDriverName || '');
        setDriverPhone(vehicle.defaultDriverPhone || '');

        // Fetch today's trip count
        try {
            const res = await api.get(`/inventory/stock/open?vehicleId=${vehicleId}`);
            const todayTransactions = res.data.data || [];
            const todayCount = todayTransactions.filter((tx) => {
                const txDate = new Date(tx.transactionDate).toDateString();
                const today = new Date().toDateString();
                return txDate === today;
            }).length;
            setTodayTripsCount(todayCount);
            setTripNumber(todayCount + 1);
        } catch (err) {
            console.error('Error fetching trip count:', err);
        }
    };

    // Fetch ledger when godown is selected
    const handleGodownSelect = async (godownId) => {
        setSelectedGodown(godownId);
        if (!godownId) return;

        try {
            setLoading(true);
            const res = await api.get(`/inventory/stock/location/${godownId}`);
            if (res.data.success) {
                setLedgers(res.data.data?.ledgers || []);
                // Initialize selected products with zero quantities
                const initialProducts = (res.data.data?.ledgers || []).map((ledger) => ({
                    agencyProductId: ledger.agencyProductId._id,
                    productLabel: ledger.agencyProductId.localName || ledger.agencyProductId.itemCode,
                    stockField: 'filled', // default
                    quantity: 0,
                    unitPrice: ledger.agencyProductId.currentSalePrice || 0,
                }));
                setSelectedProducts(initialProducts);
            }
        } catch (err) {
            console.error('Error fetching ledger:', err);
            setError('Error loading godown stock');
        } finally {
            setLoading(false);
        }
    };

    // Handle product quantity change
    const handleProductQuantityChange = (index, quantity) => {
        const updated = [...selectedProducts];
        updated[index].quantity = parseInt(quantity) || 0;
        setSelectedProducts(updated);

        // Check if exceeds available stock
        const ledger = ledgers[index];
        const available = ledger?.stock[updated[index].stockField] || 0;
        if (updated[index].quantity > available) {
            setStockWarnings({ ...stockWarnings, [index]: 'Exceeds available stock' });
        } else {
            const newWarnings = { ...stockWarnings };
            delete newWarnings[index];
            setStockWarnings(newWarnings);
        }
    };

    const handleProductStockFieldChange = (index, field) => {
        const updated = [...selectedProducts];
        updated[index].stockField = field;
        setSelectedProducts(updated);

        // Reset quantity when changing field
        updated[index].quantity = 0;
        setSelectedProducts(updated);

        // Clear warnings
        const newWarnings = { ...stockWarnings };
        delete newWarnings[index];
        setStockWarnings(newWarnings);
    };

    // Validate Step 1
    const validateStep1 = () => {
        if (!selectedVehicle) {
            setError('Please select a vehicle');
            return false;
        }
        if (!driverName.trim()) {
            setError('Driver name is required');
            return false;
        }
        if (!selectedGodown) {
            setError('Please select a source godown');
            return false;
        }
        if (tripNumber < 1) {
            setError('Trip number must be at least 1');
            return false;
        }
        setError('');
        return true;
    };

    // Validate Step 2
    const validateStep2 = () => {
        const hasProducts = selectedProducts.some((p) => p.quantity > 0);
        if (!hasProducts) {
            setError('Please add at least one product');
            return false;
        }

        if (!allowOverdraft) {
            for (let i = 0; i < selectedProducts.length; i++) {
                if (selectedProducts[i].quantity > 0) {
                    const ledger = ledgers[i];
                    const available = ledger?.stock[selectedProducts[i].stockField] || 0;
                    if (selectedProducts[i].quantity > available) {
                        setError('Insufficient stock. Enable "Allow overdraft" to proceed.');
                        return false;
                    }
                }
            }
        }

        setError('');
        return true;
    };

    // Submit form
    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setShowConfirmModal(false);
        setSubmitting(true);

        try {
            const lines = selectedProducts.filter((p) => p.quantity > 0);
            const res = await api.post('/inventory/stock/issue', {
                vehicleId: selectedVehicle,
                driverName,
                driverPhone,
                tripNumber,
                sourceLocationId: selectedGodown,
                allowOverdraft,
                remarks,
                lines,
            });

            if (res.data.success) {
                setSuccessMessage('Stock issued successfully!');
                setTimeout(() => {
                    navigate('/deliveries/open');
                }, 1500);
            } else {
                setError(res.data.message || 'Error issuing stock');
            }
        } catch (err) {
            console.error('Error submitting:', err);
            setError('Error issuing stock. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const totalCylinders = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = selectedProducts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Issue Stock to Vehicle</h1>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                        <FaExclamationTriangle />
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
                        <FaCheckCircle />
                        {successMessage}
                    </div>
                )}

                {/* Step Indicator */}
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={() => setStep(1)}
                        className={`px-6 py-2 rounded font-medium transition ${step === 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        1. Vehicle & Driver
                    </button>
                    <button
                        onClick={() => validateStep1() && setStep(2)}
                        disabled={!selectedVehicle}
                        className={`px-6 py-2 rounded font-medium transition ${step === 2
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
                            }`}
                    >
                        2. Select Products
                    </button>
                </div>

                {/* Step 1: Vehicle Selection */}
                {step === 1 && (
                    <div className="bg-white rounded-lg shadow p-6 space-y-6">
                        {/* Vehicle Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Vehicle *</label>
                            <select
                                value={selectedVehicle}
                                onChange={(e) => handleVehicleSelect(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Select Vehicle --</option>
                                {vehicles.map((v) => (
                                    <option key={v._id} value={v._id}>
                                        {v.registrationNumber} ({v.vehicleType}) - {v.defaultDriverName || 'No Driver'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Driver Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Driver Name *</label>
                                <input
                                    type="text"
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Driver Phone</label>
                                <input
                                    type="tel"
                                    value={driverPhone}
                                    onChange={(e) => setDriverPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Trip Number */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Trip No. *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={tripNumber}
                                    onChange={(e) => setTripNumber(parseInt(e.target.value) || 1)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {todayTripsCount > 0 && (
                                    <p className="text-sm text-blue-600 mt-2">
                                        This vehicle has {todayTripsCount} trip(s) today. Entering Trip #{tripNumber}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Issue Date</label>
                                <input
                                    type="date"
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Source Godown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Source Godown *</label>
                            <select
                                value={selectedGodown}
                                onChange={(e) => handleGodownSelect(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Select Godown --</option>
                                {godowns.map((g) => (
                                    <option key={g._id} value={g._id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Remarks</label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                            />
                        </div>

                        <button
                            onClick={() => validateStep1() && setStep(2)}
                            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                        >
                            Continue to Products
                        </button>
                    </div>
                )}

                {/* Step 2: Select Products */}
                {step === 2 && (
                    <div className="space-y-6">
                        {/* Override Warning */}
                        {!allowOverdraft && Object.keys(stockWarnings).length > 0 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 flex items-start gap-3">
                                <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Stock Warnings</p>
                                    <p className="text-sm mt-1">Some products exceed available stock. Enable "Allow overdraft" to proceed.</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Stock Type</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Available</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Qty to Issue</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Unit Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedProducts.map((product, idx) => {
                                            const ledger = ledgers[idx];
                                            const available = ledger?.stock[product.stockField] || 0;
                                            const hasWarning = stockWarnings[idx];
                                            const rowClass = hasWarning ? 'bg-red-50' : available === 0 ? 'opacity-50' : '';

                                            return (
                                                <tr key={idx} className={rowClass}>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {product.productLabel}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <select
                                                            value={product.stockField}
                                                            onChange={(e) => handleProductStockFieldChange(idx, e.target.value)}
                                                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                        >
                                                            <option value="filled">Filled</option>
                                                            <option value="empty">Empty</option>
                                                            <option value="defective">Defective</option>
                                                            <option value="sound">Sound</option>
                                                            <option value="quantity">Quantity</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center text-gray-700">{available}</td>
                                                    <td className="px-6 py-4 text-sm text-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductQuantityChange(idx, e.target.value)}
                                                            className={`w-20 px-2 py-1 border rounded text-center focus:ring-2 focus:ring-blue-500 ${hasWarning ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                                                }`}
                                                        />
                                                        {hasWarning && <p className="text-xs text-red-600 mt-1">{hasWarning}</p>}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-center">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={product.unitPrice}
                                                            onChange={(e) => {
                                                                const updated = [...selectedProducts];
                                                                updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                                                                setSelectedProducts(updated);
                                                            }}
                                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="mt-6 pt-6 border-t space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Total Cylinders:</span>
                                    <span className="font-bold">{totalCylinders}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Total Value:</span>
                                    <span className="font-bold">₹{totalValue.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Override */}
                        {user?.role === 'ADMIN' && (
                            <label className="flex items-center gap-3 bg-white rounded-lg shadow p-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allowOverdraft}
                                    onChange={(e) => setAllowOverdraft(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-900">Allow Overdraft</span>
                            </label>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => validateStep2() && setShowConfirmModal(true)}
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Issue Stock'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {showConfirmModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Issue</h2>
                            <p className="text-gray-600 mb-4">
                                Issue <strong>{totalCylinders} cylinders</strong> to vehicle <strong>{selectedVehicle && vehicles.find((v) => v._id === selectedVehicle)?.registrationNumber} (Trip #{tripNumber})</strong> from <strong>{selectedGodown && godowns.find((g) => g._id === selectedGodown)?.name}</strong>?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {submitting ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueStockPage;
