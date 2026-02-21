import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../axios/axiosInstance';

const AddStockModal = ({ locationId, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // Step 1: Select Product, Step 2: Enter Quantities
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantities, setQuantities] = useState({
        filled: 0,
        empty: 0,
        defective: 0,
        sound: 0,
        defectivePR: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/inventory/products');
                setProducts(response.data.data || []);
            } catch (err) {
                setError('Failed to load products');
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setQuantities({ filled: 0, empty: 0, defective: 0, sound: 0, defectivePR: 0 });
        setStep(2);
    };

    const handleQuantityChange = (field, value) => {
        setQuantities({
            ...quantities,
            [field]: parseInt(value) || 0,
        });
    };

    const handleSubmit = async () => {
        if (!selectedProduct) {
            setError('Please select a product');
            return;
        }

        const totalQuantity = Object.values(quantities).reduce((sum, val) => sum + val, 0);
        if (totalQuantity === 0) {
            setError('Please enter at least one quantity');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/inventory/stock/add-to-godown', {
                locationId,
                agencyProductId: selectedProduct._id,
                quantities: {
                    filled: quantities.filled,
                    empty: quantities.empty,
                    defective: quantities.defective,
                    sound: quantities.sound,
                    defectivePR: quantities.defectivePR,
                },
                notes: `Added to ${selectedProduct.localName}`,
            });

            if (response.data.success) {
                alert('Stock added successfully!');
                onSuccess?.();
                onClose();
            } else {
                setError(response.data.message || 'Failed to add stock');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding stock');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-theme-secondary rounded-lg shadow-lg w-full max-w-md max-h-96 flex flex-col border border-theme-color">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-theme-color bg-theme-tertiary">
                    <h2 className="text-xl font-bold text-theme-primary">Add Stock to Godown</h2>
                    <button
                        onClick={onClose}
                        className="text-theme-secondary hover:text-theme-primary transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-theme-secondary border border-error-color rounded-lg text-error-color text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        // Step 1: Select Product
                        <div className="space-y-3">
                            <p className="text-theme-secondary text-sm mb-4">Select a product to add to this godown:</p>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {products.length === 0 ? (
                                    <p className="text-theme-secondary text-center py-4">No products available</p>
                                ) : (
                                    products.map((product) => (
                                        <button
                                            key={product._id}
                                            onClick={() => handleProductSelect(product)}
                                            className="w-full text-left p-3 rounded-lg bg-theme-tertiary border border-theme-color hover:bg-theme-accent hover:text-white hover:border-theme-accent transition"
                                        >
                                            <div className="font-medium text-theme-primary">{product.localName}</div>
                                            <div className="text-sm text-theme-secondary">{product.itemCode}</div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        // Step 2: Enter Quantities
                        <div className="space-y-4">
                            <div>
                                <p className="text-theme-secondary text-sm mb-2 font-medium">Product: {selectedProduct.localName}</p>
                            </div>

                            <div className="space-y-3">
                                {['filled', 'empty', 'sound', 'defective', 'defectivePR'].map((key) => (
                                    <div key={key}>
                                        <label className="block text-sm text-theme-secondary mb-1 capitalize">
                                            {key === 'defectivePR' ? 'Defective (PR)' : key}
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={quantities[key]}
                                            onChange={(e) => handleQuantityChange(key, e.target.value)}
                                            className="w-full px-3 py-2 border border-theme-color rounded-lg bg-theme-primary text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-theme-tertiary rounded-lg">
                                <p className="text-sm text-theme-secondary">
                                    <span className="font-medium">Total Quantity:</span>{' '}
                                    {Object.values(quantities).reduce((sum, val) => sum + val, 0)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-theme-color bg-theme-tertiary">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 px-4 py-2 border border-theme-color text-theme-primary rounded-lg hover:bg-theme-secondary transition"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={step === 1 ? onClose : handleSubmit}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${step === 1
                            ? 'bg-theme-secondary border border-theme-color text-theme-primary hover:bg-theme-tertiary'
                            : 'bg-theme-accent text-white hover:bg-theme-accent-hover'
                            }`}
                    >
                        {step === 1 ? 'Cancel' : 'Add Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStockModal;
