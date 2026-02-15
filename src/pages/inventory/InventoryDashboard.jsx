import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaBoxes, FaTruck, FaArrowUp, FaArrowDown, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const InventoryDashboard = () => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const res = await api.get('/inventory/stock/live');
            if (res.data.success) {
                setStock(res.data.stock);
            }
        } catch (error) {
            console.error("Error fetching stock:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-theme-primary">Inventory Dashboard</h1>
                    <p className="text-sm text-theme-secondary">Live stock overview</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/inventory/plant-receipt" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-green-700">
                        <FaArrowDown /> Plant Receipt (In)
                    </Link>
                    <Link to="/inventory/empty-dispatch" className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-700">
                        <FaArrowUp /> Empty Dispatch (Out)
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stock.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-theme-color">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-theme-primary">
                                {item.productCode && <span className="text-sm text-gray-500 mr-2">{item.productCode}</span>}
                                {item.productName}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${item.condition === 'FILLED' ? 'bg-green-100 text-green-800' :
                                item.condition === 'EMPTY' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {item.condition}
                            </span>
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-600">Agency Stock</span>
                                <span className="font-bold text-theme-accent text-xl">{item.agencyStock}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-2 text-gray-500">
                                <span>With Customers</span>
                                <span>{item.customerStock}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-2 text-gray-500">
                                <span>Pending at Plant</span>
                                <span>{item.plantPending}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {stock.length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No stock data available yet. Start by creating transactions.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryDashboard;
