import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const EmptyDispatch = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([{ cylinderProductId: '', quantity: '' }]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        // Fetch products
        api.get('/inventory/products?type=cylinder')
            .then(res => setProducts(res.data.products))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    const handleAddItem = () => {
        setItems([...items, { cylinderProductId: '', quantity: '' }]);
    };

    const handleRemoveItem = (index) => {
        const list = [...items];
        list.splice(index, 1);
        setItems(list);
    };

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...items];
        list[index][name] = value;
        setItems(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const payload = {
                voucherNo,
                date,
                items: items.map(i => ({ ...i, quantity: Number(i.quantity) })),
            };
            const res = await api.post('/inventory/plant/dispatch/empty', payload);
            if (res.data.success) {
                setMessage({ text: 'Empty Dispatch created successfully!', type: 'success' });
                setTimeout(() => navigate('/inventory/dashboard'), 1500);
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error creating voucher', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-theme-primary">Empty Dispatch Voucher</h1>
                    <p className="text-sm text-theme-secondary">Dispatch Empty Cylinders to Plant</p>
                </div>
                <Link to="/inventory/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <FaArrowLeft /> Back
                </Link>
            </div>

            {message.text && (
                <div className={`p-4 mb-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No</label>
                        <input
                            type="text"
                            value={voucherNo}
                            onChange={(e) => setVoucherNo(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                        <button type="button" onClick={handleAddItem} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <FaPlus /> Add Item
                        </button>
                    </div>

                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-end bg-gray-50 p-3 rounded-lg relative group">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                                <select
                                    name="cylinderProductId"
                                    value={item.cylinderProductId}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full border rounded-md p-2 text-sm"
                                    required
                                >
                                    <option value="">Select Cylinder Type</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.productCode ? `${p.productCode} - ` : ''}{p.name} ({p.capacityKg}kg)</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-32">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full border rounded-md p-2 text-sm"
                                    required
                                    min="1"
                                />
                            </div>
                            {items.length > 1 && (
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-2">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        <FaSave /> {loading ? 'Saving...' : 'Save Voucher'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmptyDispatch;
