import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../axios/axiosInstance';
import { FaArrowLeft, FaSpinner, FaTruck } from 'react-icons/fa';
import StockTable from '../../components/stock/StockTable';

const VehicleStockPage = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [ledgers, setLedgers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);

                // Fetch vehicle details
                const vehicleRes = await api.get(`/inventory/vehicles/${vehicleId}`);
                if (!vehicleRes.data.success) {
                    setError('Vehicle not found');
                    return;
                }

                const vehicleData = vehicleRes.data.data;
                setVehicle(vehicleData);

                // Fetch ledger for vehicle's stock location
                if (vehicleData.stockLocationId) {
                    const ledgerRes = await api.get(`/inventory/stock/location/${vehicleData.stockLocationId._id}`);
                    if (ledgerRes.data.success) {
                        setLedgers(ledgerRes.data.data?.ledgers || []);

                        // Fetch vehicle's transactions
                        const txRes = await api.get(
                            `/inventory/stock/transactions?transactionType=VEHICLE_ISSUE&locationId=${vehicleData.stockLocationId._id}&status=CONFIRMED&limit=20`
                        );
                        if (txRes.data.success) {
                            setTransactions(txRes.data.data?.transactions || []);
                        }
                    }
                }

                setError('');
            } catch (err) {
                console.error('Error fetching vehicle stock:', err);
                setError('Error loading vehicle stock');
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [vehicleId]);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate('/inventory/vehicles')}
                        className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <FaArrowLeft />
                        Back to Vehicles
                    </button>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
                        {error || 'Vehicle not found'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/inventory/vehicles')}
                    className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                    <FaArrowLeft />
                    Back to Vehicles
                </button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {vehicle.registrationNumber}
                            </h1>
                            <p className="text-lg text-gray-600 mt-1">{vehicle.vehicleType}</p>
                            {vehicle.defaultDriverName && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Driver: <strong>{vehicle.defaultDriverName}</strong>
                                    {vehicle.defaultDriverPhone && ` • ${vehicle.defaultDriverPhone}`}
                                </p>
                            )}
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <FaTruck className="text-4xl text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Stock Location</p>
                            <p className="font-bold text-gray-900">{vehicle.stockLocationId?.name || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Stock Table */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Stock</h2>
                    <StockTable ledgers={ledgers} />
                </div>

                {/* Open Transactions */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Transactions</h2>
                    {transactions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                            No open transactions for this vehicle
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reference</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trip</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cylinders</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transactions.map((tx) => (
                                        <tr key={tx._id}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.referenceNumber}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(tx.transactionDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">Trip #{tx.tripNumber}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.totalQuantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleStockPage;
