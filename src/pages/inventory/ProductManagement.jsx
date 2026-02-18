import React, { useState, useEffect } from 'react';
import api from '../../axios/axiosInstance';
import { FaBoxOpen, FaPlus, FaEdit, FaCheck, FaTimes, FaFilter, FaSearch, FaArrowRight } from 'react-icons/fa';
import { BsFuelPump, BsTools } from 'react-icons/bs';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cylinder'); // 'cylinder' or 'item'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const [formData, setFormData] = useState({
        type: 'cylinder', // default
        name: '',
        productCode: '',
        capacityKg: '',
        category: 'domestic',
        isFiber: false,
        unit: 'NOS',
        hsnCode: '',
        taxRate: '',
        currentPurchasePrice: '',
        currentSalePrice: '',
        securityDepositPrice: '',
        variant: 'Filled', // For cylinders: Filled, Empty, or Defective
        openingStock: '', // Simplified to single field since each variant is separate
        priceEffectiveDate: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (formData.type === 'pr' && formData.category && formData.category.includes('Domestic')) {
            if (formData.currentSalePrice !== 0) {
                setFormData(prev => ({ ...prev, currentSalePrice: 0 }));
            }
        }
    }, [formData.type, formData.category, formData.currentSalePrice]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/inventory/products');
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setMessage({ text: 'Error fetching products', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on active tab, search term, and category filter
    const filteredProducts = products.filter(p => {
        const normalizeType = (t) => t === 'cylinder' ? 'cylinder' : (t === 'pr' ? 'pr' : 'nfr');
        const productType = normalizeType(p.type);
        const currentTabType = normalizeType(activeTab);

        const matchesTab = productType === currentTabType;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.productCode && p.productCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.itemCode && p.itemCode.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesCategory = true;
        if (filterCategory) {
            if (filterCategory === 'Fiber') {
                matchesCategory = p.isFiber;
            } else if (p.type === 'nfr') {
                // For NFR, filterCategory could be a subcategory
                // Check if it matches subcategory, or fall back to category if broad
                matchesCategory = (p.subcategory === filterCategory) ||
                    (p.category && p.category.toLowerCase() === filterCategory.toLowerCase());
            } else {
                matchesCategory = p.category && p.category.toLowerCase() === filterCategory.toLowerCase();
            }
        }

        return matchesTab && matchesSearch && matchesCategory;
    });

    // Counts (case-insensitive category matching)
    const catMatch = (p, cat) => p.category && p.category.toLowerCase() === cat.toLowerCase();

    const cylinderCounts = {
        total: products.filter(p => p.type === 'cylinder').length,
        domestic: products.filter(p => p.type === 'cylinder' && catMatch(p, 'Domestic')).length,
        commercial: products.filter(p => p.type === 'cylinder' && catMatch(p, 'Commercial')).length,
        ftl: products.filter(p => p.type === 'cylinder' && catMatch(p, 'FTL')).length,
        fiber: products.filter(p => p.type === 'cylinder' && p.isFiber).length
    };

    const nfrCounts = {
        total: products.filter(p => p.type === 'nfr').length,
        hose: products.filter(p => p.type === 'nfr' && p.subcategory === 'Suraksha Hose').length,
        stove: products.filter(p => p.type === 'nfr' && p.subcategory === 'LPG Stove').length,
        lighter: products.filter(p => p.type === 'nfr' && p.subcategory === 'Lighter').length,
        apron: products.filter(p => p.type === 'nfr' && p.subcategory === 'Apron').length,
        trolley: products.filter(p => p.type === 'nfr' && p.subcategory === 'Trolley').length,
        fireBall: products.filter(p => p.type === 'nfr' && p.subcategory === 'Fire Ball').length,
        other: products.filter(p => p.type === 'nfr' && (!p.subcategory || p.subcategory === 'Other')).length
    };

    const prCounts = {
        total: products.filter(p => p.type === 'pr').length,
        domestic: products.filter(p => p.type === 'pr' && catMatch(p, 'Domestic')).length,
        commercial: products.filter(p => p.type === 'pr' && catMatch(p, 'Commercial')).length,
        ftl: products.filter(p => p.type === 'pr' && catMatch(p, 'FTL')).length
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                type: product.type, // cylinder or item
                name: product.name,
                productCode: product.productCode || '',
                capacityKg: product.capacityKg || '',
                category: product.category || 'domestic',
                isFiber: product.isFiber || false,
                unit: product.unit || 'NOS',
                hsnCode: product.hsnCode || '',
                taxRate: product.taxRate || '',
                currentPurchasePrice: product.currentPurchasePrice || '',
                currentSalePrice: product.currentSalePrice || '',
                priceEffectiveDate: product.priceEffectiveDate ? new Date(product.priceEffectiveDate).toISOString().split('T')[0] : '',
                variant: product.variant || 'Filled',
                openingStock: product.openingStock || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                type: activeTab, // default to current tab
                name: '',
                productCode: '',
                capacityKg: '',
                category: 'domestic',
                isFiber: false,
                unit: 'NOS',
                hsnCode: '',
                taxRate: '',
                currentPurchasePrice: '',
                currentSalePrice: '',
                priceEffectiveDate: '',
                variant: 'Filled',
                openingStock: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (payload.type === 'cylinder') {
                delete payload.unit; // remove item specific fields
            } else {
                delete payload.capacityKg;
                // delete payload.category; // Keep category for items
                delete payload.isFiber;
            }

            if (editingProduct) {
                const res = await api.put(`/inventory/product/${editingProduct._id}`, payload);
                if (res.data.success) {
                    setMessage({ text: 'Product updated successfully', type: 'success' });
                    setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...res.data.product, type: payload.type } : p)); // ensure type is preserved/updated
                    closeModal();
                }
            } else {
                const res = await api.post('/inventory/product', payload);
                if (res.data.success) {
                    setMessage({ text: 'Product created successfully', type: 'success' });
                    setProducts(prev => [{ ...res.data.product, type: payload.type }, ...prev]);
                    closeModal();
                }
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error saving product', type: 'error' });
        }
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleToggleStatus = async (product) => {
        try {
            const res = await api.put(`/inventory/product/${product._id}/status`, {
                type: product.type,
                isActive: !product.isActive
            });
            if (res.data.success) {
                setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
                setMessage({ text: `Product ${!product.isActive ? 'activated' : 'deactivated'}`, type: 'success' });
            }
        } catch (error) {
            setMessage({ text: 'Error updating status', type: 'error' });
        }
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const [showGlobalModal, setShowGlobalModal] = useState(false);
    const [globalProducts, setGlobalProducts] = useState([]);
    const [selectedGlobalForMap, setSelectedGlobalForMap] = useState(null);
    const [mapConfig, setMapConfig] = useState({
        purchasePrice: '',
        salePrice: '',
        openingStockFilled: '',
        openingStockEmpty: '',
        openingStockDefective: '',
        openingStockSound: '',
        openingStockDefectivePR: '',
        openingStockQuantity: ''
    });

    const fetchUnmappedProducts = async () => {
        try {
            const res = await api.get('/inventory/products/unmapped');
            if (res.data.success) {
                setGlobalProducts(res.data.products);
                setShowGlobalModal(true);
            }
        } catch (error) {
            setMessage({ text: 'Error fetching global products', type: 'error' });
        }
    };

    const openMapConfig = (product) => {
        setSelectedGlobalForMap(product);
        setMapConfig({
            purchasePrice: '',
            salePrice: product.productType === 'PR' && product.category === 'Domestic' ? 0 : '',
            openingStockFilled: '',
            openingStockEmpty: '',
            openingStockDefective: '',
            openingStockSound: '',
            openingStockDefectivePR: '',
            openingStockQuantity: '',
            // NFR-specific
            localName: product.name || '',
            itemCode: product.productCode || '',
            priceEffectiveDate: new Date().toISOString().split('T')[0]
        });
        setShowGlobalModal(false);
    };

    const handleConfirmMap = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/inventory/product/map', {
                globalProductId: selectedGlobalForMap._id,
                currentPurchasePrice: mapConfig.purchasePrice,
                currentSalePrice: mapConfig.salePrice,
                // Cylinder fields
                openingStockFilled: mapConfig.openingStockFilled,
                openingStockEmpty: mapConfig.openingStockEmpty,
                openingStockDefective: mapConfig.openingStockDefective,
                // PR fields
                openingStockSound: mapConfig.openingStockSound,
                openingStockDefectivePR: mapConfig.openingStockDefectivePR,
                // NFR field (reuse openingStockFilled for quantity)
                ...(selectedGlobalForMap.productType === 'NFR' && {
                    openingStockFilled: mapConfig.openingStockQuantity,
                    localName: mapConfig.localName,
                    itemCode: mapConfig.itemCode,
                    priceEffectiveDate: mapConfig.priceEffectiveDate
                })
            });
            if (res.data.success) {
                setMessage({ text: 'Product added successfully', type: 'success' });
                fetchProducts();
                // Remove from local list
                setGlobalProducts(prev => prev.filter(p => p._id !== selectedGlobalForMap._id));
                setSelectedGlobalForMap(null);
            }
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Error adding product', type: 'error' });
        }
    };

    const renderDashboardCard = (label, count, categoryFilterKey, type) => {
        const isActive = activeTab === type && ((!filterCategory && !categoryFilterKey) || (filterCategory === categoryFilterKey));
        return (
            <div
                onClick={() => {
                    setActiveTab(type);
                    setFilterCategory(categoryFilterKey);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between h-20 relative overflow-hidden group ${isActive ? 'bg-theme-accent text-white border-theme-accent shadow-md ring-2 ring-theme-accent/50' : 'bg-theme-secondary border-theme-color hover:bg-theme-tertiary hover:shadow-sm'}`}
            >
                <div className="z-10 relative">
                    <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate ${isActive ? 'text-white/90' : 'text-theme-secondary'}`}>{label}</div>
                    <div className={`text-xl font-bold font-mono ${isActive ? 'text-white' : 'text-theme-primary'}`}>{count}</div>
                </div>
                {/* Decorative Icon opacity */}
                <div className={`absolute -right-2 -bottom-2 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform ${isActive ? 'text-white' : 'text-theme-primary'}`}>
                    {type === 'cylinder' ? <BsFuelPump size={40} /> : <BsTools size={40} />}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 animate-fadeIn max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <FaBoxOpen className="text-theme-primary text-xl" />
                    <h1 className="text-lg font-bold text-theme-primary">Inventory Management</h1>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="mb-6 space-y-4">
                <div>
                    <h3 className="text-[10px] font-bold text-theme-secondary opacity-70 uppercase tracking-widest mb-2 pl-1">Cylinders Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {renderDashboardCard('All Cylinders', cylinderCounts.total, null, 'cylinder')}
                        {renderDashboardCard('Domestic', cylinderCounts.domestic, 'Domestic', 'cylinder')}
                        {renderDashboardCard('Commercial', cylinderCounts.commercial, 'Commercial', 'cylinder')}
                        {renderDashboardCard('FTL', cylinderCounts.ftl, 'FTL', 'cylinder')}
                        {renderDashboardCard('Fiber', cylinderCounts.fiber, 'Fiber', 'cylinder')}
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-theme-secondary opacity-70 uppercase tracking-widest mb-2 pl-1">NFR Products Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                        {renderDashboardCard('All NFR', nfrCounts.total, null, 'nfr')}
                        {renderDashboardCard('Hose', nfrCounts.hose, 'Suraksha Hose', 'nfr')}
                        {renderDashboardCard('Stove', nfrCounts.stove, 'LPG Stove', 'nfr')}
                        {renderDashboardCard('Lighter', nfrCounts.lighter, 'Lighter', 'nfr')}
                        {renderDashboardCard('Apron', nfrCounts.apron, 'Apron', 'nfr')}
                        {renderDashboardCard('Trolley', nfrCounts.trolley, 'Trolley', 'nfr')}
                        {renderDashboardCard('Fire Ball', nfrCounts.fireBall, 'Fire Ball', 'nfr')}
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-theme-secondary opacity-70 uppercase tracking-widest mb-2 pl-1">Pressure Regulators (PR)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {renderDashboardCard('All PR', prCounts.total, null, 'pr')}
                        {renderDashboardCard('Domestic', prCounts.domestic, 'Domestic', 'pr')}
                        {renderDashboardCard('Commercial', prCounts.commercial, 'Commercial', 'pr')}
                        {renderDashboardCard('FTL', prCounts.ftl, 'FTL', 'pr')}
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-2 mb-4 items-center">
                {/* Search Bar Moved Here */}
                <div className="flex items-center bg-theme-secondary border border-theme-color rounded-lg px-2.5 py-1.5 shadow-sm focus-within:ring-2 ring-theme-accent transition-all w-64 max-w-xs">
                    <FaSearch className="text-theme-secondary mr-2" size={12} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full text-theme-primary placeholder-theme-secondary/50"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchUnmappedProducts}
                        className="bg-theme-secondary text-theme-primary border border-theme-color px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-theme-tertiary transition-all shadow-sm"
                    >
                        <FaSearch size={10} className="text-theme-primary" /> Add from Master
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="bg-theme-accent text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-theme-accent/90 transition-all shadow-sm"
                    >
                        <FaPlus size={10} /> Add Custom
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`px-3 py-2 mb-3 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            {/* List View Table */}
            <div className="bg-theme-secondary rounded-xl shadow-sm border border-theme-color overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-theme-tertiary text-theme-secondary font-medium border-b border-theme-color">
                            <tr>
                                <th className="px-4 py-3">Product Name</th>
                                <th className="px-4 py-3">Item Code</th>
                                <th className="px-4 py-3">{activeTab === 'cylinder' ? 'Info' : activeTab === 'pr' ? 'Stock' : 'Unit'}</th>
                                <th className="px-4 py-3 text-right">Purchase Price</th>
                                <th className="px-4 py-3 text-right">Sale Price</th>
                                <th className="px-4 py-3 text-center">Tax %</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-color">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-theme-secondary">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-theme-secondary">
                                        No matching products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product._id} className="hover:bg-theme-tertiary/50 transition-colors group">
                                        <td className="px-4 py-3 font-medium text-theme-primary">
                                            {product.name}
                                            {product.isGlobal && <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Global</span>}
                                        </td>
                                        <td className="px-4 py-3 text-theme-secondary font-mono text-xs">{product.itemCode || product.productCode || '-'}</td>
                                        <td className="px-4 py-3 text-theme-secondary">
                                            {product.type === 'cylinder' ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-theme-secondary/70">Capacity:</span>
                                                        <span className="font-mono text-theme-primary">{product.capacityKg} kg</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-theme-secondary/70">Category:</span>
                                                        <span className="capitalize text-theme-primary">{product.category}</span>
                                                    </div>
                                                    {product.stock && (
                                                        <div className="flex gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">F:{product.stock.filled || 0}</span>
                                                            <span className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">E:{product.stock.empty || 0}</span>
                                                            <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">D:{product.stock.defective || 0}</span>
                                                        </div>
                                                    )}
                                                    {product.isFiber && (
                                                        <div className="text-orange-500 font-medium text-[10px] uppercase">Fiber Composite</div>
                                                    )}
                                                </>
                                            ) : product.type === 'pr' ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-theme-secondary/70">Category:</span>
                                                        <span className="font-medium text-theme-primary">{product.category || '-'}</span>
                                                    </div>
                                                    {product.stock && (
                                                        <div className="flex gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Sound:{product.stock.sound || 0}</span>
                                                            <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded">Def:{product.stock.defectivePR || 0}</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-theme-secondary/70">Category:</span>
                                                        <span className="font-medium text-theme-primary">{product.category || 'Other'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-theme-secondary/70">Unit:</span>
                                                        <span className="text-theme-primary">{product.unit}</span>
                                                    </div>
                                                    {product.stock && (
                                                        <div className="flex gap-2 mt-0.5">
                                                            <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Qty:{product.stock.quantity || 0}</span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-green-600">{product.currentPurchasePrice?.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-right font-mono text-blue-600">{product.currentSalePrice?.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-center text-theme-secondary">{product.taxRate}%</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openModal(product)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(product)}
                                                    className={`p-1.5 rounded transition-colors ${product.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    title={product.isActive ? 'Deactivate' : 'Activate'}
                                                >
                                                    {product.isActive ? <FaTimes /> : <FaCheck />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-theme-secondary rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] border border-theme-color">
                        <div className="px-4 py-3 border-b border-theme-color flex justify-between items-center bg-theme-tertiary flex-shrink-0">
                            <h2 className="text-base font-bold text-theme-primary">
                                {editingProduct ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            <button onClick={closeModal} className="text-theme-secondary hover:text-theme-primary">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-2 overflow-y-auto custom-scrollbar">
                            {!editingProduct && (
                                <div className="flex gap-2 mb-3 bg-theme-tertiary p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'cylinder' }))}
                                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${formData.type === 'cylinder' ? 'bg-theme-secondary shadow text-theme-accent font-bold' : 'text-theme-secondary'}`}
                                    >
                                        Cylinder
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'nfr', category: 'Other' }))}
                                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${formData.type === 'nfr' ? 'bg-theme-secondary shadow text-theme-accent font-bold' : 'text-theme-secondary'}`}
                                    >
                                        NFR Product
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, type: 'pr', category: 'Domestic PR' }))}
                                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${formData.type === 'pr' ? 'bg-theme-secondary shadow text-theme-accent font-bold' : 'text-theme-secondary'}`}
                                    >
                                        PR
                                    </button>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Item Name *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <input type="text" name="productCode" placeholder="Code" value={formData.productCode} onChange={handleInputChange} className="col-span-1 w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" required />
                                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="col-span-2 w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" required />
                                </div>
                            </div>

                            {formData.type === 'cylinder' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent">
                                            <option value="domestic">Domestic</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="ftl">FTL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Capacity (Kg)</label>
                                        <input type="number" name="capacityKg" value={formData.capacityKg} onChange={handleInputChange} step="0.1" className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" required />
                                    </div>
                                    <label className="col-span-2 flex items-center gap-2 text-[10px] font-medium text-theme-secondary cursor-pointer pt-1">
                                        <input type="checkbox" name="isFiber" checked={formData.isFiber} onChange={handleInputChange} className="rounded text-theme-accent" />
                                        Is Fiber Cylinder?
                                    </label>

                                    {/* Variant Selector */}
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Stock Variant *</label>
                                        <select name="variant" value={formData.variant} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent">
                                            <option value="Filled">Filled</option>
                                            <option value="Empty">Empty</option>
                                            <option value="Defective">Defective</option>
                                        </select>
                                    </div>

                                    {formData.category !== 'ftl' && (
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Security Deposit (₹)</label>
                                            <input type="number" name="securityDepositPrice" value={formData.securityDepositPrice} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" placeholder="Refill Deposit Amount" />
                                        </div>
                                    )}

                                    {/* Opening Stock for Selected Variant */}
                                    <div className="col-span-2 mt-2 p-2 bg-theme-tertiary/50 rounded border border-theme-color/50">
                                        <label className="block text-[10px] font-bold text-theme-primary mb-1.5 border-b border-theme-color pb-0.5">
                                            Opening Stock ({formData.variant})
                                        </label>
                                        <input
                                            type="number"
                                            name="openingStock"
                                            value={formData.openingStock}
                                            onChange={handleInputChange}
                                            className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                            placeholder={`Enter initial ${formData.variant.toLowerCase()} stock quantity`}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'nfr' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent">
                                            <option value="Other">Other</option>
                                            <option value="Suraksha Hose">Suraksha Hose</option>
                                            <option value="LPG Stove">LPG Stove</option>
                                            <option value="Lighter">Lighter</option>
                                            <option value="Apron">Apron</option>
                                            <option value="Trolley">Trolley</option>
                                            <option value="Fire Ball">Fire Ball</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Unit *</label>
                                        <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent">
                                            <option value="NOS">NOS</option>
                                            <option value="KGS">KGS</option>
                                            <option value="MTR">MTR</option>
                                            <option value="SET">SET</option>
                                            <option value="BOX">BOX</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {formData.type === 'pr' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Category</label>
                                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent">
                                            <option value="Domestic PR">Domestic PR (Non Valuated)</option>
                                            <option value="FTL PR">FTL PR (Sales)</option>
                                            <option value="FTL POS Resell PR">FTL POS Resell PR</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Unit</label>
                                        <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent">
                                            <option value="NOS">NOS</option>
                                            <option value="SET">SET</option>
                                            <option value="BOX">BOX</option>
                                        </select>
                                    </div>
                                    {formData.category && formData.category.includes('Domestic') && (
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Security Deposit (₹)</label>
                                            <input type="number" name="securityDepositPrice" value={formData.securityDepositPrice} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" placeholder="PR Deposit Amount" />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-theme-color/50">
                                <div>
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">HSN Code</label>
                                    <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Tax Rate (%)</label>
                                    <input type="number" name="taxRate" value={formData.taxRate} onChange={handleInputChange} step="0.5" className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-theme-color/50">
                                <div>
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Buy Price</label>
                                    <input type="number" name="currentPurchasePrice" value={formData.currentPurchasePrice} onChange={handleInputChange} step="0.01" className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Sell Price</label>
                                    <input
                                        type="number"
                                        name="currentSalePrice"
                                        value={formData.currentSalePrice}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        className={`w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent ${formData.type === 'pr' && formData.category.includes('Domestic') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={formData.type === 'pr' && formData.category.includes('Domestic')}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Price Effective Date</label>
                                    <input type="date" name="priceEffectiveDate" value={formData.priceEffectiveDate} onChange={handleInputChange} className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-theme-color mt-2">
                                <button type="button" onClick={closeModal} className="px-3 py-1.5 border border-theme-color rounded text-xs text-theme-secondary hover:bg-theme-tertiary">Cancel</button>
                                <button type="submit" className="bg-theme-accent text-white px-4 py-1.5 rounded text-xs hover:bg-theme-accent/90 transition-all">{editingProduct ? 'Update' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Product Mapping Modal */}
            {showGlobalModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-theme-secondary rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-theme-color">
                        <div className="px-4 py-3 border-b border-theme-color flex justify-between items-center bg-theme-tertiary flex-shrink-0">
                            <h2 className="text-base font-bold text-theme-primary">
                                Select from Global Master
                            </h2>
                            <button onClick={() => setShowGlobalModal(false)} className="text-theme-secondary hover:text-theme-primary">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <div className="p-0 overflow-y-auto custom-scrollbar">
                            {globalProducts.length === 0 ? (
                                <div className="p-8 text-center text-theme-secondary">No unmapped global products found.</div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-theme-tertiary text-theme-secondary font-medium border-b border-theme-color sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Product Name</th>
                                            <th className="px-4 py-2">Code</th>
                                            <th className="px-4 py-2">Type</th>
                                            <th className="px-4 py-2 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-theme-color">
                                        {globalProducts.map(gp => (
                                            <tr key={gp._id} className="hover:bg-theme-tertiary/50 transition-colors">
                                                <td className="px-4 py-2 font-medium text-theme-primary">{gp.name}</td>
                                                <td className="px-4 py-2 text-theme-secondary font-mono text-xs">{gp.productCode}</td>
                                                <td className="px-4 py-2 text-theme-secondary text-xs">
                                                    {gp.productType === 'CYLINDER' ? 'Cylinder' : (gp.productType === 'PR' ? 'Pressure Regulator' : 'NFR')}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => openMapConfig(gp)}
                                                        className="bg-theme-accent text-white px-2 py-1 rounded text-xs font-bold hover:bg-theme-accent/90 transition-colors"
                                                    >
                                                        Configure & Add
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Config Modal for Mapping */}
            {selectedGlobalForMap && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fadeIn backdrop-blur-sm">
                    <div className="bg-theme-secondary rounded-lg shadow-xl w-full max-w-sm overflow-hidden flex flex-col border border-theme-color">
                        <div className="px-4 py-3 border-b border-theme-color flex justify-between items-center bg-theme-tertiary">
                            <h2 className="text-base font-bold text-theme-primary">
                                Configure: {selectedGlobalForMap.name}
                            </h2>
                            <button onClick={() => setSelectedGlobalForMap(null)} className="text-theme-secondary hover:text-theme-primary">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <form onSubmit={handleConfirmMap} className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Buy Price</label>
                                    <input
                                        type="number"
                                        value={mapConfig.purchasePrice}
                                        onChange={(e) => setMapConfig({ ...mapConfig, purchasePrice: e.target.value })}
                                        className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-medium text-theme-secondary mb-0.5">Sell Price</label>
                                    <input
                                        type="number"
                                        value={mapConfig.salePrice}
                                        onChange={(e) => setMapConfig({ ...mapConfig, salePrice: e.target.value })}
                                        className={`w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-tertiary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent ${selectedGlobalForMap.productType === 'PR' && selectedGlobalForMap.category && selectedGlobalForMap.category.includes('Domestic') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        step="0.01"
                                        disabled={selectedGlobalForMap.productType === 'PR' && selectedGlobalForMap.category && selectedGlobalForMap.category.includes('Domestic')}
                                    />
                                </div>
                            </div>

                            {/* Opening Stock Section — adapts to product type */}
                            <div className="p-2 bg-theme-tertiary/50 rounded border border-theme-color/50">
                                <label className="block text-[10px] font-bold text-theme-primary mb-1.5 border-b border-theme-color pb-0.5">
                                    Opening Stock
                                    <span className="font-normal text-theme-secondary ml-1">({selectedGlobalForMap.productType})</span>
                                </label>

                                {/* CYLINDER: Filled / Empty / Defective */}
                                {selectedGlobalForMap.productType === 'CYLINDER' && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Filled</label>
                                            <input
                                                type="number"
                                                value={mapConfig.openingStockFilled}
                                                onChange={(e) => setMapConfig({ ...mapConfig, openingStockFilled: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Empty</label>
                                            <input
                                                type="number"
                                                value={mapConfig.openingStockEmpty}
                                                onChange={(e) => setMapConfig({ ...mapConfig, openingStockEmpty: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Defective</label>
                                            <input
                                                type="number"
                                                value={mapConfig.openingStockDefective}
                                                onChange={(e) => setMapConfig({ ...mapConfig, openingStockDefective: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* PR: Sound / Defective */}
                                {selectedGlobalForMap.productType === 'PR' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Sound</label>
                                            <input
                                                type="number"
                                                value={mapConfig.openingStockSound}
                                                onChange={(e) => setMapConfig({ ...mapConfig, openingStockSound: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Defective</label>
                                            <input
                                                type="number"
                                                value={mapConfig.openingStockDefectivePR}
                                                onChange={(e) => setMapConfig({ ...mapConfig, openingStockDefectivePR: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* NFR: localName, itemCode, priceEffectiveDate + Quantity */}
                                {selectedGlobalForMap.productType === 'NFR' && (
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Local Name</label>
                                            <input
                                                type="text"
                                                value={mapConfig.localName}
                                                onChange={(e) => setMapConfig({ ...mapConfig, localName: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="Product display name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[9px] text-theme-secondary mb-0.5">Item Code</label>
                                                <input
                                                    type="text"
                                                    value={mapConfig.itemCode}
                                                    onChange={(e) => setMapConfig({ ...mapConfig, itemCode: e.target.value })}
                                                    className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent font-mono"
                                                    placeholder="ITEM001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] text-theme-secondary mb-0.5">Price Effective Date</label>
                                                <input
                                                    type="date"
                                                    value={mapConfig.priceEffectiveDate}
                                                    onChange={(e) => setMapConfig({ ...mapConfig, priceEffectiveDate: e.target.value })}
                                                    className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] text-theme-secondary mb-0.5">Opening Quantity</label>
                                            <input
                                                type="number"
                                                value={mapConfig.openingStockQuantity}
                                                onChange={(e) => setMapConfig({ ...mapConfig, openingStockQuantity: e.target.value })}
                                                className="w-full border border-theme-color rounded px-2 py-1 text-xs bg-theme-secondary text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedGlobalForMap(null)}
                                    className="px-3 py-1.5 border border-theme-color rounded text-xs text-theme-secondary hover:bg-theme-tertiary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-theme-accent text-white px-4 py-1.5 rounded text-xs hover:bg-theme-accent/90 transition-all font-bold"
                                >
                                    Internalize Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
