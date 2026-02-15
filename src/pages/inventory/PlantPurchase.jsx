import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaSave, FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const PlantPurchase = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [supplier, setSupplier] = useState('');

    // Items with financial fields
    const [items, setItems] = useState([
        { cylinderProductId: '', quantity: '', unitPrice: '', taxRate: '', taxAmount: 0, totalAmount: 0 }
    ]);

    const [totals, setTotals] = useState({
        subTotal: 0,
        taxTotal: 0,
        grandTotal: 0
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        api.get('/inventory/products')
            .then(res => setProducts(res.data.products))
            .catch(err => console.error("Error fetching products:", err));
    }, []);

    // Recalculate totals whenever items change
    useEffect(() => {
        const subTotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice) || 0), 0);
        const taxTotal = items.reduce((sum, item) => sum + (Number(item.taxAmount) || 0), 0);
        const grandTotal = items.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);

        setTotals({ subTotal, taxTotal, grandTotal });
    }, [items]);

    const handleAddItem = () => {
        setItems([...items, { cylinderProductId: '', quantity: '', unitPrice: '', taxRate: '', taxAmount: 0, totalAmount: 0, productCode: '' }]);
    };

    const handleRemoveItem = (index) => {
        const list = [...items];
        list.splice(index, 1);
        setItems(list);
    };

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...items];

        // Update value first
        list[index][name] = value;

        // Auto-fill financial details if product is selected (could be improved with product lookup)
        if (name === 'cylinderProductId') {
            const product = products.find(p => p._id === value);
            if (product) {
                list[index].taxRate = product.taxRate || 0;
                list[index].productCode = product.productCode || '';
                list[index].unitPrice = product.currentPurchasePrice || '';
            }
        }

        // Calculate line computations
        const quantity = Number(list[index].quantity) || 0;
        const unitPrice = Number(list[index].unitPrice) || 0;
        const taxRate = Number(list[index].taxRate) || 0;

        const taxableValue = quantity * unitPrice;
        const taxAmount = (taxableValue * taxRate) / 100;
        const totalAmount = taxableValue + taxAmount;

        list[index].taxAmount = Number(taxAmount.toFixed(2));
        list[index].totalAmount = Number(totalAmount.toFixed(2));

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
                supplier,
                items: items.map(i => ({
                    cylinderProductId: i.cylinderProductId,
                    quantity: Number(i.quantity),
                    unitPrice: Number(i.unitPrice),
                    taxRate: Number(i.taxRate),
                    taxAmount: Number(i.taxAmount),
                    totalAmount: Number(i.totalAmount)
                })),
                subTotal: totals.subTotal,
                taxTotal: totals.taxTotal,
                rounding: 0, // Can add UI for this
                grandTotal: totals.grandTotal,
                createdBy: 'user'
            };

            const res = await api.post('/inventory/plant/receipt', payload); // Route remains same
            if (res.data.success) {
                setMessage({ text: 'Plant Purchase recorded successfully!', type: 'success' });
                setTimeout(() => navigate('/inventory/dashboard'), 1500);
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error recording purchase', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-theme-primary">Plant Purchase Entry</h1>
                    <p className="text-sm text-theme-secondary">Record Vendor Invoice & Incoming Stock</p>
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
                {/* Header Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                        <input
                            type="text"
                            value={voucherNo}
                            onChange={(e) => setVoucherNo(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="e.g. 7003109182"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input
                            type="text"
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="IOCL Plant"
                        />
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-medium">
                            <tr>
                                <th className="p-3 w-32">Code</th>
                                <th className="p-3 w-64">Product</th>
                                <th className="p-3 w-24">Qty</th>
                                <th className="p-3 w-32">Rate (Taxable)</th>
                                <th className="p-3 w-24">Tax %</th>
                                <th className="p-3 w-32">Tax Amt</th>
                                <th className="p-3 w-32">Total</th>
                                <th className="p-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.productCode}
                                            readOnly
                                            className="w-full bg-gray-50 border rounded-md p-1.5 text-gray-500 cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            name="cylinderProductId"
                                            value={item.cylinderProductId}
                                            onChange={(e) => handleItemChange(e, index)}
                                            className="w-full border rounded-md p-1.5"
                                            required
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => (
                                                <option key={p._id} value={p._id}>{p.productCode} - {p.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(e, index)}
                                            className="w-full border rounded-md p-1.5"
                                            min="1"
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            name="unitPrice"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(e, index)}
                                            className="w-full border rounded-md p-1.5"
                                            step="0.000001"
                                            required
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            name="taxRate"
                                            value={item.taxRate}
                                            readOnly
                                            className="w-full bg-gray-50 border rounded-md p-1.5 text-gray-500 cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.taxAmount}
                                            readOnly
                                            className="w-full bg-gray-50 border-none p-1.5 text-right font-mono"
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={item.totalAmount}
                                            readOnly
                                            className="w-full bg-gray-50 border-none p-1.5 text-right font-mono font-medium"
                                        />
                                    </td>
                                    <td className="p-2">
                                        {items.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                                                <FaTrash />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <button type="button" onClick={handleAddItem} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium">
                        <FaPlus /> Add Item
                    </button>
                    <div className="text-right space-y-1 w-64">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Sub Total:</span>
                            <span>{totals.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tax Total:</span>
                            <span>{totals.taxTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-theme-primary border-t pt-1 border-gray-300">
                            <span>Grand Total:</span>
                            <span>{totals.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 shadow-md transform active:scale-95 transition-all"
                    >
                        <FaSave /> {loading ? 'Saving Purchase...' : 'Save Purchase'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlantPurchase;
