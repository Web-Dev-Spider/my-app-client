import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const PlantReceipt = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [supplier, setSupplier] = useState('');
    const [items, setItems] = useState([{ cylinderProductId: '', quantity: '', unitPrice: '', taxRate: '5' }]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [supplierList, setSupplierList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, suppRes] = await Promise.all([
                    api.get('/inventory/products?type=cylinder'),
                    api.get('/inventory/suppliers?active=true')
                ]);
                if (prodRes.data.success) setProducts(prodRes.data.products);
                if (suppRes.data.success) setSupplierList(suppRes.data.suppliers);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleAddItem = () => {
        setItems([...items, { cylinderProductId: '', quantity: '', unitPrice: '', taxRate: '5' }]);
    };

    const handleRemoveItem = (index) => {
        const list = [...items];
        list.splice(index, 1);
        setItems(list);
    };

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...items];

        if (name === 'cylinderProductId') {
            const product = products.find(p => p._id === value);
            if (product) {
                list[index].unitPrice = product.currentPurchasePrice !== undefined ? product.currentPurchasePrice : '';
                list[index].taxRate = product.taxRate !== undefined ? product.taxRate : 5;
            }
        }

        list[index][name] = value;
        setItems(list);
    };

    // Calculate totals
    const calculateTotals = () => {
        let subTotal = 0;
        let taxTotal = 0;

        items.forEach(item => {
            const qty = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.unitPrice) || 0;
            const taxRate = parseFloat(item.taxRate) || 0;

            const baseAmount = qty * price;
            const taxAmount = (baseAmount * taxRate) / 100;

            subTotal += baseAmount;
            taxTotal += taxAmount;
        });

        const total = subTotal + taxTotal;
        const grandTotal = Math.round(total);
        const rounding = grandTotal - total;

        return { subTotal, taxTotal, rounding, grandTotal };
    };

    const totals = calculateTotals();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const payload = {
                voucherNo,
                date,
                supplier,
                items: items.map(i => {
                    const qty = parseFloat(i.quantity) || 0;
                    const price = parseFloat(i.unitPrice) || 0;
                    const taxRate = parseFloat(i.taxRate) || 0;
                    const baseAmount = qty * price;
                    const taxAmount = (baseAmount * taxRate) / 100;

                    return {
                        cylinderProductId: i.cylinderProductId,
                        quantity: qty,
                        unitPrice: price,
                        taxRate: taxRate,
                        taxAmount: taxAmount,
                        totalAmount: baseAmount + taxAmount
                    };
                }),
                subTotal: totals.subTotal,
                taxTotal: totals.taxTotal,
                rounding: totals.rounding,
                grandTotal: totals.grandTotal
            };

            const res = await api.post('/inventory/plant/receipt', payload);
            if (res.data.success) {
                setMessage({ text: 'Plant Receipt created successfully!', type: 'success' });
                setTimeout(() => navigate('/inventory/dashboard'), 1500);
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error creating voucher', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-theme-primary">Plant Receipt Voucher</h1>
                    <p className="text-sm text-theme-secondary">Received Filled Cylinders from Plant (Purchase)</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Voucher / Invoice No</label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier (Plant)</label>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select Supplier</option>
                            {supplierList.map(s => (
                                <option key={s._id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                        <button type="button" onClick={handleAddItem} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <FaPlus /> Add Item
                        </button>
                    </div>

                    <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 pb-1 px-3">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-2">Rate</div>
                        <div className="col-span-1">Tax %</div>
                        <div className="col-span-2 text-right">Amount</div>
                        <div className="col-span-1"></div>
                    </div>

                    {items.map((item, index) => {
                        const qty = parseFloat(item.quantity) || 0;
                        const price = parseFloat(item.unitPrice) || 0;
                        const rate = parseFloat(item.taxRate) || 0;
                        const amt = (qty * price) * (1 + rate / 100);

                        return (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-2 items-end bg-gray-50 p-3 rounded-lg relative group">
                                <div className="col-span-1 md:col-span-4">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Product</label>
                                    <select
                                        name="cylinderProductId"
                                        value={item.cylinderProductId}
                                        onChange={(e) => handleItemChange(e, index)}
                                        className="w-full border rounded-md p-2 text-sm"
                                        required
                                    >
                                        <option value="">Select Cylinder Type</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.capacityKg}kg)</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(e, index)}
                                        className="w-full border rounded-md p-2 text-sm"
                                        required
                                        min="1"
                                        placeholder="Qty"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Rate</label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={item.unitPrice}
                                        onChange={(e) => handleItemChange(e, index)}
                                        className="w-full border rounded-md p-2 text-sm"
                                        required
                                        min="0"
                                        placeholder="Price"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-1">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Tax %</label>
                                    <input
                                        type="number"
                                        name="taxRate"
                                        value={item.taxRate}
                                        onChange={(e) => handleItemChange(e, index)}
                                        className="w-full border rounded-md p-2 text-sm"
                                        min="0"
                                        placeholder="%"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 text-right font-mono text-sm pt-2 md:pt-0">
                                    <label className="md:hidden inline-block text-xs font-medium text-gray-500 mr-2">Amount:</label>
                                    {amt.toFixed(2)}
                                </div>
                                <div className="col-span-1 md:col-span-1 flex justify-end">
                                    {items.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 p-2">
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col items-end pt-4 border-t gap-2 text-sm">
                    <div className="flex justify-between w-full md:w-64">
                        <span className="text-gray-600">Sub Total:</span>
                        <span className="font-medium">{totals.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-full md:w-64">
                        <span className="text-gray-600">Tax Total:</span>
                        <span className="font-medium">{totals.taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-full md:w-64">
                        <span className="text-gray-600">Rounding:</span>
                        <span className="font-medium">{totals.rounding.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-full md:w-64 border-t pt-2 mt-2">
                        <span className="text-lg font-bold text-gray-800">Grand Total:</span>
                        <span className="text-lg font-bold text-theme-primary">₹ {totals.grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-theme-accent text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all"
                    >
                        <FaSave /> {loading ? 'Saving...' : 'Save Receipt'}
                    </button>
                </div>
            </form >
        </div >
    );
};

export default PlantReceipt;
