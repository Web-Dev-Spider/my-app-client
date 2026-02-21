import React, { useState, useEffect } from "react";
import api from "../../axios/axiosInstance";
import { FaBox, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaTags, FaChevronRight } from "react-icons/fa";

const GlobalProductMaster = () => {
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({ name: "", type: "NFR", description: "" });
    const [categoryMessage, setCategoryMessage] = useState({ text: "", type: "" });
    const [editingProduct, setEditingProduct] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Schema-driven options
    const productTypes = ["CYLINDER", "PR", "NFR"];
    const categoryOptions = ["Domestic", "Commercial", "NFR", "FTL"];

    const productTypeLabels = {
        CYLINDER: "Cylinder",
        PR: "Pressure Regulator",
        NFR: "NFR (Non-Fuel Revenue) Items",
    };

    // Category options allowed per product type
    const categoryByProductType = {
        CYLINDER: ["Domestic", "Commercial", "FTL"],
        PR: ["Domestic", "Commercial", "FTL"],
        NFR: ["NFR"],
    };

    // Default valuationType per product type
    const defaultValuationType = {
        CYLINDER: "DEPOSIT",
        PR: "DEPOSIT",
        NFR: "NFR",
    };

    const initialForm = {
        name: "",
        productCode: "",
        productType: "CYLINDER",
        category: "Domestic",
        valuationType: "DEPOSIT",
        capacityKg: "",
        isFiber: false,
        isReturnable: false,
        hsnCode: "",
        taxRate: 5,
        unit: "NOS",
    };

    const [formData, setFormData] = useState(initialForm);

    // Category manager state
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [activeCategoryTab, setActiveCategoryTab] = useState('CYLINDER');

    // Card browser filter state
    const [selectedType, setSelectedType] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [l3Filter, setL3Filter] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/admin/global-products");
            setProducts(data.products || []);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchSubcategories = async (type = "") => {
        try {
            const url = type ? `/admin/product-category?type=${type}` : "/admin/product-category";
            const { data } = await api.get(url);
            setSubcategories(data.categories || []);
        } catch (error) {
            console.error("Error fetching subcategories", error);
        }
    };

    const fetchAllSubcategories = async () => {
        try {
            const { data } = await api.get("/admin/product-category");
            setAllSubcategories(data.categories || []);
        } catch (error) {
            console.error("Error fetching all subcategories", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => {
            const updates = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };

            // When productType changes, reset dependent fields
            if (name === "productType") {
                const allowedCategories = categoryByProductType[value] || categoryOptions;
                updates.category = allowedCategories[0];
                updates.valuationType = defaultValuationType[value] || "DEPOSIT";
                if (value !== "CYLINDER") {
                    updates.capacityKg = "";
                    updates.isFiber = false;
                }
                fetchSubcategories(value);
            }

            return updates;
        });
    };

    const openCategoryModal = (defaultType) => {
        const tab = defaultType || 'CYLINDER';
        setActiveCategoryTab(tab);
        setCategoryFormData({ name: "", type: tab, description: "" });
        setCategoryMessage({ text: "", type: "" });
        fetchAllSubcategories();
        setIsCategoryModalOpen(true);
    };

    const switchCategoryTab = (tab) => {
        setActiveCategoryTab(tab);
        setCategoryFormData(prev => ({ ...prev, type: tab, name: "", description: "" }));
        setCategoryMessage({ text: "", type: "" });
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/admin/product-category", categoryFormData);
            if (data.success) {
                setCategoryMessage({ text: `"${categoryFormData.name}" added to ${productTypeLabels[activeCategoryTab]}`, type: "success" });
                fetchAllSubcategories();
                fetchSubcategories(formData.productType);
                setCategoryFormData(prev => ({ ...prev, name: "", description: "" }));
                setTimeout(() => setCategoryMessage({ text: "", type: "" }), 2500);
            }
        } catch (error) {
            setCategoryMessage({ text: error.response?.data?.message || "Failed to add subcategory", type: "error" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const payload = {
                name: formData.name,
                productCode: formData.productCode,
                productType: formData.productType,
                category: formData.category,
                valuationType: formData.valuationType,
                capacityKg: formData.productType === "CYLINDER" ? formData.capacityKg : undefined,
                isFiber: formData.isFiber,
                isReturnable: formData.isReturnable,
                hsnCode: formData.hsnCode,
                taxRate: formData.taxRate,
                unit: formData.unit,
            };

            if (editingProduct) {
                await api.put(`/admin/global-product/${editingProduct._id}`, payload);
            } else {
                await api.post("/admin/global-product", payload);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to save product.";
            if (msg.includes("duplicate key error")) {
                setErrorMessage("A product with this Product Code already exists.");
            } else {
                setErrorMessage(msg);
            }
        }
    };

    const openModal = (product = null) => {
        setErrorMessage("");
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                productCode: product.productCode,
                productType: product.productType,
                category: product.category || "Domestic",
                valuationType: product.valuationType || product.businessType || "DEPOSIT",
                capacityKg: product.capacityKg || "",
                isFiber: product.isFiber || false,
                isReturnable: product.isReturnable || false,
                hsnCode: product.hsnCode || "",
                taxRate: product.taxRate || 0,
                unit: product.unit || "NOS",
            });
            fetchSubcategories(product.productType);
        } else {
            setEditingProduct(null);
            setFormData(initialForm);
            fetchSubcategories("CYLINDER");
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to deactivate this product?")) {
            try {
                await api.delete(`/admin/global-product/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    const allowedCategories = categoryByProductType[formData.productType] || categoryOptions;

    const getValuationOptions = (pt) => {
        if (pt === "CYLINDER") return [{ value: "DEPOSIT", label: "Deposit (Refundable)" }, { value: "VALUATED", label: "Valuated" }];
        if (pt === "PR") return [{ value: "DEPOSIT", label: "Deposit" }, { value: "VALUATED", label: "Valuated" }];
        return [{ value: "NFR", label: "NFR" }];
    };

    // ── Card browser helpers ──

    const getLevel2Groups = (type) => {
        const typed = products.filter(p => p.productType === type);
        const groups = [];
        const dep = typed.filter(p => p.valuationType === 'DEPOSIT');
        if (dep.length) groups.push({ key: 'DEPOSIT', label: 'Deposit Types', count: dep.length });
        const val = typed.filter(p => p.valuationType === 'VALUATED');
        if (val.length) groups.push({ key: 'VALUATED', label: 'Valuated Types', count: val.length });
        const ftl = typed.filter(p => p.category === 'FTL');
        if (ftl.length) groups.push({ key: 'FTL', label: 'FTL Types', count: ftl.length });
        return groups;
    };

    const getLevel3Items = (type, group) => {
        let base = products.filter(p => p.productType === type);
        base = group === 'FTL'
            ? base.filter(p => p.category === 'FTL')
            : base.filter(p => p.valuationType === group);

        if (type === 'CYLINDER' && group !== 'FTL') {
            // Group by (capacityKg, isFiber) for cylinder deposit/valuated products
            const seen = new Set();
            const result = [];
            [...base].sort((a, b) => (a.capacityKg || 0) - (b.capacityKg || 0)).forEach(p => {
                const k = `${p.capacityKg}_${!!p.isFiber}`;
                if (!seen.has(k)) {
                    seen.add(k);
                    result.push({
                        key: k,
                        filterType: 'capacity',
                        label: p.capacityKg ? `${p.capacityKg} kg${p.isFiber ? ' Composite' : ''}` : p.name,
                        count: base.filter(x => x.capacityKg === p.capacityKg && !!x.isFiber === !!p.isFiber).length,
                        capacityKg: p.capacityKg,
                        isFiber: !!p.isFiber,
                    });
                }
            });
            return result;
        } else {
            // Group by name (FTL products, PR products, NFR)
            const seen = new Set();
            const result = [];
            base.forEach(p => {
                if (!seen.has(p.name)) {
                    seen.add(p.name);
                    result.push({
                        key: p.name,
                        filterType: 'name',
                        label: p.name,
                        count: base.filter(x => x.name === p.name).length,
                        name: p.name,
                    });
                }
            });
            return result;
        }
    };

    const selectType = (type) => { setSelectedType(type); setSelectedGroup(null); setL3Filter(null); };
    const selectGroup = (group) => { setSelectedGroup(group); setL3Filter(null); };
    const clearAll = () => { setSelectedType(null); setSelectedGroup(null); setL3Filter(null); };

    const filteredProducts = products.filter(p => {
        if (selectedType && p.productType !== selectedType) return false;
        if (selectedGroup) {
            if (selectedGroup === 'FTL' ? p.category !== 'FTL' : p.valuationType !== selectedGroup) return false;
        }
        if (l3Filter) {
            if (l3Filter.type === 'capacity') {
                if (p.capacityKg !== l3Filter.capacityKg || !!p.isFiber !== l3Filter.isFiber) return false;
            } else if (l3Filter.type === 'name') {
                if (p.name !== l3Filter.name) return false;
            }
        }
        return true;
    });

    const typeConfig = {
        CYLINDER: { label: 'Cylinder Types', active: 'border-orange-500 bg-orange-50', text: 'text-orange-600', hover: 'hover:border-orange-300' },
        PR:       { label: 'PR Types',       active: 'border-indigo-500 bg-indigo-50', text: 'text-indigo-600', hover: 'hover:border-indigo-300' },
        NFR:      { label: 'NFR Types',      active: 'border-purple-500 bg-purple-50', text: 'text-purple-600', hover: 'hover:border-purple-300' },
    };
    const groupConfig = {
        DEPOSIT:  { active: 'border-blue-500 bg-blue-50',   text: 'text-blue-700',   hover: 'hover:border-blue-300' },
        VALUATED: { active: 'border-green-500 bg-green-50', text: 'text-green-700',  hover: 'hover:border-green-300' },
        FTL:      { active: 'border-amber-500 bg-amber-50', text: 'text-amber-700',  hover: 'hover:border-amber-300' },
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen animate-fadeIn">
            <div className="max-w-6xl mx-auto">

                {/* ── Header + Breadcrumb ── */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FaBox className="text-blue-600" />
                            Global Product Master
                        </h1>
                        <nav className="flex items-center gap-1 mt-1.5 text-sm">
                            <button
                                onClick={clearAll}
                                className={`transition ${!selectedType ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                All Products
                            </button>
                            {selectedType && (
                                <>
                                    <FaChevronRight className="text-gray-300 text-xs" />
                                    <button
                                        onClick={() => { setSelectedGroup(null); setL3Filter(null); }}
                                        className={`transition ${!selectedGroup ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {productTypeLabels[selectedType]}
                                    </button>
                                </>
                            )}
                            {selectedGroup && (
                                <>
                                    <FaChevronRight className="text-gray-300 text-xs" />
                                    <button
                                        onClick={() => setL3Filter(null)}
                                        className={`transition ${!l3Filter ? 'text-blue-600 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {selectedGroup === 'DEPOSIT' ? 'Deposit Types' : selectedGroup === 'FTL' ? 'FTL Types' : 'Valuated Types'}
                                    </button>
                                </>
                            )}
                            {l3Filter && (
                                <>
                                    <FaChevronRight className="text-gray-300 text-xs" />
                                    <span className="text-blue-600 font-semibold">
                                        {l3Filter.type === 'capacity'
                                            ? `${l3Filter.capacityKg} kg${l3Filter.isFiber ? ' Composite' : ''}`
                                            : l3Filter.name}
                                    </span>
                                </>
                            )}
                        </nav>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => openCategoryModal(formData.productType)}
                            className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition shadow-sm font-medium"
                        >
                            <FaTags /> Product Categories
                        </button>
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md font-medium"
                        >
                            <FaPlus /> Add New Product
                        </button>
                    </div>
                </div>

                {/* ── Level 1: Product Type Cards ── */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                    {['CYLINDER', 'PR', 'NFR'].map(type => {
                        const cfg = typeConfig[type];
                        const count = products.filter(p => p.productType === type).length;
                        const isActive = selectedType === type;
                        return (
                            <div
                                key={type}
                                onClick={() => selectType(type)}
                                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md select-none
                                    ${isActive ? cfg.active : `border-gray-200 bg-white ${cfg.hover}`}`}
                            >
                                <div className={`text-3xl font-bold mb-1 ${isActive ? cfg.text : 'text-gray-700'}`}>{count}</div>
                                <div className={`font-semibold text-sm ${isActive ? cfg.text : 'text-gray-600'}`}>{cfg.label}</div>
                                <div className="text-xs text-gray-400 mt-0.5">products</div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Level 2: Valuation Group Cards ── */}
                {selectedType && selectedType !== 'NFR' && (() => {
                    const groups = getLevel2Groups(selectedType);
                    if (!groups.length) return null;
                    return (
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            {groups.map(({ key, label, count }) => {
                                const cfg = groupConfig[key] || groupConfig.DEPOSIT;
                                const isActive = selectedGroup === key;
                                return (
                                    <div
                                        key={key}
                                        onClick={() => selectGroup(key)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md select-none
                                            ${isActive ? cfg.active : `border-gray-200 bg-white ${cfg.hover}`}`}
                                    >
                                        <div className={`text-2xl font-bold mb-1 ${isActive ? cfg.text : 'text-gray-600'}`}>{count}</div>
                                        <div className={`font-semibold text-sm ${isActive ? cfg.text : 'text-gray-500'}`}>{label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}

                {/* ── Level 3: Capacity / Name Chips ── */}
                {selectedType && selectedGroup && (() => {
                    const items = getLevel3Items(selectedType, selectedGroup);
                    if (!items.length) return null;
                    return (
                        <div className="flex flex-wrap gap-2 mb-5 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider self-center mr-1">Filter by:</span>
                            {items.map(item => {
                                const isActive = l3Filter && (
                                    item.filterType === 'capacity'
                                        ? l3Filter.type === 'capacity' && l3Filter.capacityKg === item.capacityKg && l3Filter.isFiber === item.isFiber
                                        : l3Filter.type === 'name' && l3Filter.name === item.name
                                );
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => {
                                            if (isActive) {
                                                setL3Filter(null);
                                            } else if (item.filterType === 'capacity') {
                                                setL3Filter({ type: 'capacity', capacityKg: item.capacityKg, isFiber: item.isFiber });
                                            } else {
                                                setL3Filter({ type: 'name', name: item.name });
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all select-none
                                            ${isActive
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                            }`}
                                    >
                                        {item.label}
                                        <span className="ml-1.5 text-xs opacity-60">({item.count})</span>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })()}

                {/* ── Product Table ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                            {selectedType && (
                                <span className="text-gray-400 font-normal ml-1.5">
                                    · {selectedType}
                                    {selectedGroup ? ` › ${selectedGroup}` : ''}
                                    {l3Filter ? ` › ${l3Filter.type === 'capacity' ? `${l3Filter.capacityKg}kg${l3Filter.isFiber ? ' Composite' : ''}` : l3Filter.name}` : ''}
                                </span>
                            )}
                        </span>
                        {(selectedType || selectedGroup || l3Filter) && (
                            <button
                                onClick={clearAll}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded transition"
                            >
                                <FaTimes size={10} /> Clear filter
                            </button>
                        )}
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4 border-b">Type</th>
                                <th className="p-4 border-b">Code</th>
                                <th className="p-4 border-b">Name</th>
                                <th className="p-4 border-b">Category</th>
                                <th className="p-4 border-b">Valuation</th>
                                <th className="p-4 border-b">Capacity</th>
                                <th className="p-4 border-b text-center">Tax %</th>
                                <th className="p-4 border-b text-center">Status</th>
                                <th className="p-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-8 text-center text-gray-400">
                                        No products found{selectedType ? ' for the selected filter' : '. Add one to get started'}.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-blue-50 transition duration-150">
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${product.productType === 'CYLINDER' ? 'bg-orange-100 text-orange-700' :
                                                product.productType === 'PR' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                {product.productType}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-gray-600">{product.productCode}</td>
                                        <td className="p-4 font-medium text-gray-800">
                                            {product.name}
                                            {product.isFiber && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded ml-1">Fiber</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${product.category === 'Domestic' ? 'bg-blue-100 text-blue-700' :
                                                product.category === 'Commercial' ? 'bg-emerald-100 text-emerald-700' :
                                                    product.category === 'FTL' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{product.valuationType || product.businessType || '-'}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {product.capacityKg ? `${product.capacityKg} kg` : '-'}
                                        </td>
                                        <td className="p-4 text-center text-gray-600">{product.taxRate}%</td>
                                        <td className="p-4 text-center">
                                            {product.isActive ? (
                                                <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs flex items-center justify-center w-fit mx-auto gap-1">
                                                    <FaCheck size={10} /> Active
                                                </span>
                                            ) : (
                                                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs flex items-center justify-center w-fit mx-auto gap-1">
                                                    <FaTimes size={10} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => openModal(product)} className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition">
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══════════ CREATE / EDIT MODAL ═══════════ */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingProduct ? "Edit Product" : "New Global Product"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            {errorMessage && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm flex items-start">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm">Error</p>
                                        <p className="text-sm">{errorMessage}</p>
                                    </div>
                                    <button type="button" onClick={() => setErrorMessage("")} className="text-red-400 hover:text-red-600 transition">
                                        <FaTimes />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-12 gap-8">

                                {/* ─── Section 1: Identity ─── */}
                                <div className="col-span-12 md:col-span-6 space-y-5">
                                    <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-2 border-b pb-1">Identity</h3>

                                    {/* Product Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Type *</label>
                                        <select
                                            name="productType"
                                            value={formData.productType}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                        >
                                            {productTypes.map((pt) => (
                                                <option key={pt} value={pt}>{productTypeLabels[pt] || pt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                            required
                                        >
                                            {allowedCategories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                            {subcategories.length > 0 && (
                                                <>
                                                    <option disabled>─── Custom Subcategories ───</option>
                                                    {subcategories.map((sub) => (
                                                        <option key={sub._id} value={sub.name}>{sub.name}</option>
                                                    ))}
                                                </>
                                            )}
                                        </select>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formData.productType === 'CYLINDER' && 'Domestic / Commercial / FTL cylinder'}
                                            {formData.productType === 'PR' && 'Domestic / Commercial / FTL pressure regulator'}
                                            {formData.productType === 'NFR' && (subcategories.length > 0 ? 'Select a subcategory, or NFR for general items' : 'Non-fuel revenue item — add subcategories via Add Subcategory')}
                                        </p>
                                    </div>

                                    {/* Product Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                            required
                                            placeholder={
                                                formData.productType === 'CYLINDER' ? 'e.g. 14.2kg Domestic Cylinder' :
                                                    formData.productType === 'PR' ? 'e.g. Domestic PR' : 'e.g. LPG Gas Stove'
                                            }
                                        />
                                    </div>
                                </div>

                                {/* ─── Section 2: Details ─── */}
                                <div className="col-span-12 md:col-span-6 space-y-5">
                                    <h3 className="text-sm uppercase font-bold text-gray-400 tracking-wider mb-2 border-b pb-1">Details</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Code *</label>
                                            <input
                                                name="productCode"
                                                value={formData.productCode}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono shadow-sm"
                                                required
                                                placeholder="CODE123"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">HSN Code *</label>
                                            <input
                                                name="hsnCode"
                                                value={formData.hsnCode}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                                required
                                                placeholder="27111900"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valuation Type</label>
                                            <select
                                                name="valuationType"
                                                value={formData.valuationType}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                            >
                                                {getValuationOptions(formData.productType).map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
                                            <select
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                            >
                                                <option value="NOS">Numbers (NOS)</option>
                                                <option value="KGS">Kilograms (KGS)</option>
                                                <option value="MTR">Meters (MTR)</option>
                                                <option value="SET">Sets (SET)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Type-specific attributes */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4 shadow-inner">
                                        {formData.productType === 'CYLINDER' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-blue-800 mb-1.5">Capacity (Kg)</label>
                                                    <input
                                                        type="number"
                                                        name="capacityKg"
                                                        value={formData.capacityKg}
                                                        onChange={handleInputChange}
                                                        step="0.1"
                                                        className="w-full border border-blue-200 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 transition text-blue-900 shadow-sm"
                                                        placeholder="14.2"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-end pb-3">
                                                    <label className="flex items-center gap-3 cursor-pointer text-base text-blue-800 font-medium select-none bg-white px-3 py-2 rounded border border-blue-100 hover:border-blue-300 transition">
                                                        <input
                                                            type="checkbox"
                                                            name="isFiber"
                                                            checked={formData.isFiber}
                                                            onChange={handleInputChange}
                                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                        Is Fiber
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {formData.productType === 'PR' && (
                                            <p className="text-sm text-indigo-600 font-medium">
                                                PR tracks Sound & Defective variants automatically.
                                            </p>
                                        )}

                                        {formData.productType === 'NFR' && (
                                            <p className="text-sm text-purple-600 font-medium">
                                                NFR tracks simple quantity only.
                                            </p>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tax Rate (%)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        name="taxRate"
                                                        value={formData.taxRate}
                                                        onChange={handleInputChange}
                                                        className="w-full border border-gray-300 rounded px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                                        required
                                                    />
                                                    <span className="absolute right-3 top-2.5 text-gray-400 font-medium">%</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-end pb-3">
                                                <label className="flex items-center gap-3 cursor-pointer text-base text-gray-700 font-medium select-none bg-white px-3 py-2 rounded border border-gray-200 hover:border-gray-300 transition">
                                                    <input
                                                        type="checkbox"
                                                        name="isReturnable"
                                                        checked={formData.isReturnable}
                                                        onChange={handleInputChange}
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    Returnable
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-md font-medium text-sm"
                                >
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════ PRODUCT CATEGORY MANAGER ═══════════ */}
            {isCategoryModalOpen && (() => {
                const tabConfig = {
                    CYLINDER: { label: 'Cylinder',           activeBorder: 'border-orange-500', activeText: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
                    PR:       { label: 'Pressure Regulator', activeBorder: 'border-indigo-500', activeText: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
                    NFR:      { label: 'NFR Items',           activeBorder: 'border-purple-500', activeText: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
                };
                const displayed = allSubcategories.filter(s => s.type === activeCategoryTab);
                const cfg = tabConfig[activeCategoryTab];

                return (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FaTags className="text-blue-600" /> Product Categories
                                </h2>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b shrink-0">
                                {Object.entries(tabConfig).map(([key, tc]) => {
                                    const count = allSubcategories.filter(s => s.type === key).length;
                                    const isActive = activeCategoryTab === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => switchCategoryTab(key)}
                                            className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2
                                                ${isActive ? `${tc.activeBorder} ${tc.activeText}` : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {tc.label}
                                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? tc.badge : 'bg-gray-100 text-gray-500'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Subcategory list */}
                            <div className="flex-1 overflow-y-auto p-5 min-h-30">
                                {displayed.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                                        <FaTags className="text-gray-200 text-4xl mb-3" />
                                        <p className="text-sm text-gray-400">No subcategories yet for {tabConfig[activeCategoryTab].label}.</p>
                                        <p className="text-xs text-gray-300 mt-1">Add one below.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {displayed.map((sub, idx) => (
                                            <div key={sub._id || idx} className="flex items-start justify-between px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                                                <div>
                                                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mr-2 ${cfg.badge}`}>
                                                        {tabConfig[activeCategoryTab].label}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800">{sub.name}</span>
                                                    {sub.description && (
                                                        <p className="text-xs text-gray-400 mt-0.5 ml-0.5">{sub.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add new subcategory form */}
                            <div className="border-t bg-gray-50 p-5 shrink-0">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Add subcategory to {tabConfig[activeCategoryTab].label}
                                </p>
                                {categoryMessage.text && (
                                    <div className={`mb-3 p-2.5 rounded-lg text-sm ${categoryMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                        {categoryMessage.text}
                                    </div>
                                )}
                                <form onSubmit={handleCategorySubmit} className="space-y-2">
                                    <input
                                        value={categoryFormData.name}
                                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                        placeholder={activeCategoryTab === 'NFR' ? 'e.g. Suraksha Hose, LPG Gas Stove' : activeCategoryTab === 'CYLINDER' ? 'e.g. 5kg Domestic, FTL Bulk' : 'e.g. Domestic PR, Commercial PR'}
                                        autoFocus
                                    />
                                    <textarea
                                        value={categoryFormData.description}
                                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                        rows="2"
                                        placeholder="Description (optional)"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium text-sm flex items-center gap-1.5"
                                        >
                                            <FaPlus size={11} /> Add Subcategory
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default GlobalProductMaster;
