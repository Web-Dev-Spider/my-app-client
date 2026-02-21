import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios/axiosInstance';
import { FaPlus, FaTruck, FaSpinner, FaBox } from 'react-icons/fa';
import VehicleTypeBadge from '../../components/stock/VehicleTypeBadge';
import TripBadge from '../../components/stock/TripBadge';

const OpenDeliveriesPage = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOpenTransactions();
        const interval = setInterval(fetchOpenTransactions, 60000); // Refresh every 60 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchOpenTransactions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/inventory/stock/open');
            if (res.data.success) {
                setTransactions(res.data.data || []);
                setError('');
            } else {
                setError('Failed to load open deliveries');
            }
        } catch (err) {
            console.error('Error fetching open transactions:', err);
            setError('Error loading open deliveries');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Active Deliveries</h1>
                    <button
                        onClick={() => navigate('/deliveries/issue')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
                    >
                        <FaPlus className="mr-2" />
                        New Issue
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {transactions.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FaTruck className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-xl text-gray-600">No active deliveries</p>
                        <p className="text-sm text-gray-500 mt-1">All vehicles are back at the depot</p>
                    </div>
                ) : (
                    /* Card Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {transactions.map((tx) => {
                            const vehicle = tx.destinationLocationId;
                            const godown = tx.sourceLocationId;
                            const totalCylinders = tx.lines.reduce((sum, line) => sum + line.quantity, 0);

                            return (
                                <div
                                    key={tx._id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {vehicle?.name || 'Unknown Vehicle'}
                                                </h3>
                                                <p className="text-sm text-gray-600">{vehicle?.locationType}</p>
                                            </div>
                                            <VehicleTypeBadge vehicleType={vehicle?.vehicleType} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-3">
                                            <TripBadge tripNumber={tx.tripNumber} />
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {tx.referenceNumber}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="px-6 py-4 space-y-4">
                                        {/* Driver Info */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Driver</p>
                                            <p className="text-sm text-gray-900">{tx.driverName || '—'}</p>
                                            <p className="text-sm text-gray-600">{tx.driverPhone || '—'}</p>
                                        </div>

                                        {/* Date & Time */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Issued At</p>
                                            <p className="text-sm text-gray-900">{formatDate(tx.transactionDate)}</p>
                                        </div>

                                        {/* Products */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Products Issued</p>
                                            <div className="space-y-1 bg-gray-50 rounded p-3">
                                                {tx.lines.map((line, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                                                        <span>{line.productLabel}</span>
                                                        <span className="font-medium">× {line.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="bg-blue-50 rounded p-3 border border-blue-100">
                                            <p className="text-sm text-gray-600">Total Cylinders</p>
                                            <p className="text-2xl font-bold text-blue-700">{totalCylinders}</p>
                                        </div>

                                        {/* From/To */}
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>
                                                <strong>From:</strong> {godown?.name || 'Unknown'}
                                            </p>
                                            <p>
                                                <strong>To:</strong> {vehicle?.name || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="bg-gray-50 px-6 py-3 border-t">
                                        <button
                                            onClick={() => navigate(`/deliveries/settle/${tx._id}`)}
                                            className="w-full px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                                        >
                                            Settle Vehicle
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpenDeliveriesPage;
