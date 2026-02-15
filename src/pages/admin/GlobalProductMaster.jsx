import React, { useState, useEffect } from "react";
import api from "../../axios/axiosInstance";
import { FaBox, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaTags } from "react-icons/fa";

const GlobalProductMaster = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        productCode: "",
        productType: "CYLINDER", // default
        category: "",
        capacityKg: "",
        isFiber: false,
        hsnCode: "",
        taxRate: 5
    });

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/admin/global-products");
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const fetchCategories = async (type) => {
        try {
            const { data } = await api.get(`/admin/product-categories?type=${type}`);
            if (data.success) {
                setCategories(data.categories);
                // Set default category if none selected or invalid
                if (data.categories.length > 0 && !formData.category) {
                    setFormData(prev => ({ ...prev, category: data.categories[0].name }));
                }
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            fetchCategories(formData.productType);
        }
    }, [isModalOpen, formData.productType]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            category: name === "productType" ? "" : prev.category // Reset category on type change
        }));
    };

    const handleAddCategory = async () => {
        const newCategory = prompt(`Enter new category name for ${formData.productType}:`);
        if (newCategory) {
            try {
                const { data } = await api.post("/admin/product-category", {
                    name: newCategory,
                    type: formData.productType
                });
                if (data.success) {
                    fetchCategories(formData.productType);
                    setFormData(prev => ({ ...prev, category: newCategory }));
                }
            } catch (error) {
                alert("Failed to add category: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/admin/global-product/${editingProduct._id}`, formData);
            } else {
                await api.post("/admin/global-product", formData);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product", error);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                productCode: product.productCode,
                productType: product.productType,
                category: product.category,
                capacityKg: product.capacityKg || "",
                isFiber: product.isFiber || false,
                hsnCode: product.hsnCode || "",
                taxRate: product.taxRate || 0
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                productCode: "",
                productType: "CYLINDER", // Default
                category: "",
                capacityKg: "",
                isFiber: false,
                hsnCode: "",
                taxRate: 5
            });
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen animate-fadeIn">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBox className="text-blue-600" />
                        Global Product Master
                    </h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md"
                    >
                        <FaPlus /> Add New Product
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4 border-b">Type</th>
                                <th className="p-4 border-b">Code</th>
                                <th className="p-4 border-b">Name</th>
                                <th className="p-4 border-b">Category</th>
                                <th className="p-4 border-b text-center">Tax %</th>
                                <th className="p-4 border-b text-center">Status</th>
                                <th className="p-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">
                                        No global products found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-blue-50 transition duration-150">
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${product.productType === 'CYLINDER' ? 'bg-orange-100 text-orange-700' :
                                                    (product.productType === 'PR' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700')
                                                }`}>
                                                {product.productType === 'ITEM' ? 'NFR Product' : (product.productType === 'NFR' ? 'NFR Product' : (product.productType === 'PR' ? 'Pressure Regulator' : product.productType))}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-gray-600">{product.productCode}</td>
                                        <td className="p-4 font-medium text-gray-800">
                                            {product.name}
                                            {product.capacityKg && <span className="text-xs text-gray-500 ml-2">({product.capacityKg} kg)</span>}
                                            {product.isFiber && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded ml-1">Fiber</span>}
                                        </td>
                                        <td className="p-4 capitalize text-gray-600">{product.category}</td>
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-800">
                                {editingProduct ? "Edit Product" : "New Global Product"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                                    <select
                                        name="productType"
                                        value={formData.productType}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    >
                                        <option value="CYLINDER">Cylinder</option>
                                        <option value="NFR">NFR Product</option>
                                        <option value="PR">Pressure Regulator (PR)</option>
                                        {/* Fallback for legacy data */}
                                        <option value="ITEM" disabled>Legacy Item</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                                    <input
                                        name="productCode"
                                        value={formData.productCode}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <button type="button" onClick={handleAddCategory} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            <FaPlus size={10} /> Add New
                                        </button>
                                    </div>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition capitalize"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                                    <input
                                        type="number"
                                        name="taxRate"
                                        value={formData.taxRate}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        required
                                    />
                                </div>
                            </div>

                            {formData.productType === 'CYLINDER' && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-800 mb-1">Capacity (Kg)</label>
                                        <input
                                            type="number"
                                            name="capacityKg"
                                            value={formData.capacityKg}
                                            onChange={handleInputChange}
                                            step="0.1"
                                            className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-blue-900"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer text-blue-800 font-medium select-none">
                                            <input
                                                type="checkbox"
                                                name="isFiber"
                                                checked={formData.isFiber}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            Is Fiber Composite
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
                                <input
                                    name="hsnCode"
                                    value={formData.hsnCode}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
                                >
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalProductMaster;
