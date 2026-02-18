import React, { useState, useEffect, useMemo } from 'react';
import api from '../../axios/axiosInstance';
import { FaBoxes, FaArrowUp, FaArrowDown, FaGasPump, FaIndustry, FaFire, FaWrench, FaCubes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ─── Condition badge colours ───
const conditionStyles = {
    FILLED: 'bg-green-100 text-green-800',
    EMPTY: 'bg-orange-100 text-orange-800',
    DEFECTIVE: 'bg-red-100 text-red-800',
    SOUND: 'bg-blue-100 text-blue-800',
    IN_STOCK: 'bg-purple-100 text-purple-800',
};

// ─── Stat card ───
const StatCard = ({ label, value, icon: Icon, color = 'text-theme-accent', bgColor = 'bg-theme-tertiary' }) => (
    <div className="bg-theme-secondary rounded-xl border border-theme-color p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`text-xl ${color}`} />
        </div>
        <div>
            <p className="text-xs text-theme-secondary font-medium uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-bold text-theme-primary">{value}</p>
        </div>
    </div>
);

// ─── Collapsible Section ───
const Section = ({ title, icon: Icon, iconColor, badge, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <section className="space-y-4">
            <button onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center text-left">
                <h2 className="text-lg font-bold text-theme-primary flex items-center gap-2">
                    <Icon className={iconColor} /> {title}
                    {badge && (
                        <span className="text-xs font-normal text-theme-secondary bg-theme-tertiary px-2 py-0.5 rounded-full">
                            {badge}
                        </span>
                    )}
                </h2>
                {open ? <FaChevronUp className="text-theme-secondary" /> : <FaChevronDown className="text-theme-secondary" />}
            </button>
            {open && children}
        </section>
    );
};

// ─── Stock detail table (reusable) ───
const StockTable = ({ items, showCapacity = false, showCategory = false }) => (
    <div className="overflow-x-auto rounded-xl border border-theme-color">
        <table className="w-full text-sm">
            <thead>
                <tr className="bg-theme-tertiary text-theme-secondary text-left">
                    <th className="px-4 py-3 font-medium">Item Code</th>
                    <th className="px-4 py-3 font-medium">Product Name</th>
                    {showCategory && <th className="px-4 py-3 font-medium">Category</th>}
                    {showCapacity && <th className="px-4 py-3 font-medium">Capacity</th>}
                    <th className="px-4 py-3 font-medium">Condition</th>
                    <th className="px-4 py-3 font-medium text-right">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Purchase ₹</th>
                    <th className="px-4 py-3 font-medium text-right">Sale ₹</th>
                    <th className="px-4 py-3 font-medium text-right">HSN</th>
                    <th className="px-4 py-3 font-medium text-right">Tax %</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, i) => (
                    <tr key={i} className="border-t border-theme-color hover:bg-theme-tertiary transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-theme-secondary">
                            {item.itemCode || item.productCode}
                        </td>
                        <td className="px-4 py-3 text-theme-primary font-medium">
                            {item.productName}
                            {item.isFiber && <span className="ml-1.5 text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded">Fiber</span>}
                        </td>
                        {showCategory && (
                            <td className="px-4 py-3 text-theme-secondary text-xs">{item.category}</td>
                        )}
                        {showCapacity && (
                            <td className="px-4 py-3 text-theme-secondary">{item.capacityKg ? `${item.capacityKg} Kg` : '-'}</td>
                        )}
                        <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${conditionStyles[item.condition] || 'bg-gray-100 text-gray-800'}`}>
                                {item.condition}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-theme-accent text-base">{item.agencyStock}</td>
                        <td className="px-4 py-3 text-right text-theme-secondary">
                            {item.purchasePrice > 0 ? `₹${item.purchasePrice.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-theme-secondary">
                            {item.currentSalePrice > 0 ? `₹${item.currentSalePrice.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-right text-theme-secondary text-xs">{item.hsnCode || '-'}</td>
                        <td className="px-4 py-3 text-right text-theme-secondary text-xs">{item.taxRate != null ? `${item.taxRate}%` : '-'}</td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr>
                        <td colSpan={showCapacity && showCategory ? 10 : showCapacity || showCategory ? 9 : 8}
                            className="px-4 py-6 text-center text-theme-secondary italic">
                            No products mapped yet.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const InventoryDashboard = () => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStock(); }, []);

    const fetchStock = async () => {
        try {
            const res = await api.get('/inventory/stock/live');
            if (res.data.success) setStock(res.data.stock);
        } catch (error) {
            console.error("Error fetching stock:", error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Computed summaries ───
    const summary = useMemo(() => {
        const cylinders = stock.filter(s => s.productType === 'CYLINDER');
        const prs = stock.filter(s => s.productType === 'PR');
        const nfrs = stock.filter(s => s.productType === 'NFR');

        const sumStock = (arr) => arr.reduce((t, s) => t + (s.agencyStock || 0), 0);

        // Cylinder condition totals (across all categories)
        const cylFilled = cylinders.filter(s => s.condition === 'FILLED');
        const cylEmpty = cylinders.filter(s => s.condition === 'EMPTY');
        const cylDefective = cylinders.filter(s => s.condition === 'DEFECTIVE');

        return {
            // Cylinder totals by condition
            totalCylFilled: sumStock(cylFilled),
            totalCylEmpty: sumStock(cylEmpty),
            totalCylDefective: sumStock(cylDefective),
            totalCylinders: sumStock(cylinders),

            // Cylinder filled by category (primary stat)
            domesticFilled: sumStock(cylFilled.filter(s => s.category === 'Domestic')),
            commercialFilled: sumStock(cylFilled.filter(s => s.category === 'Commercial')),
            ftlFilled: sumStock(cylFilled.filter(s => s.category === 'FTL')),
            fiberFilled: sumStock(cylFilled.filter(s => s.isFiber === true)),

            // PR totals
            prSound: sumStock(prs.filter(s => s.condition === 'SOUND')),
            prDefective: sumStock(prs.filter(s => s.condition === 'DEFECTIVE')),
            prDomestic: sumStock(prs.filter(s => s.category === 'Domestic')),
            prCommercial: sumStock(prs.filter(s => s.category === 'Commercial')),
            prFTL: sumStock(prs.filter(s => s.category === 'FTL')),
            totalPR: sumStock(prs),

            // NFR
            totalNFR: sumStock(nfrs),

            // Raw lists
            cylinders,
            prs,
            nfrs,

            // Overall
            totalProducts: stock.length,
            totalStock: sumStock(stock),
        };
    }, [stock]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-accent"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 animate-fadeIn">
            {/* ─── Header ─── */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-theme-primary">Inventory Dashboard</h1>
                    <p className="text-sm text-theme-secondary">Agency live stock overview • {summary.totalProducts} entries</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/inventory/plant-receipt" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-green-700 transition-colors">
                        <FaArrowDown /> Plant Receipt (In)
                    </Link>
                    <Link to="/inventory/empty-dispatch" className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-red-700 transition-colors">
                        <FaArrowUp /> Empty Dispatch (Out)
                    </Link>
                </div>
            </div>

            {stock.length === 0 ? (
                <div className="p-8 text-center text-theme-secondary bg-theme-secondary rounded-xl border border-dashed border-theme-color">
                    No stock data available yet. Map products from Global Product Master and add opening stock to get started.
                </div>
            ) : (
                <>
                    {/* ═══════════ CYLINDERS ═══════════ */}
                    <Section title="Cylinders" icon={FaGasPump} iconColor="text-orange-500"
                        badge={`${summary.cylinders.length} entries`}>

                        {/* Row 1: Filled by category */}
                        <p className="text-xs font-semibold text-theme-secondary uppercase tracking-wider">Filled Stock by Category</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatCard label="Domestic Filled" value={summary.domesticFilled} icon={FaGasPump}
                                color="text-blue-600" bgColor="bg-blue-50" />
                            <StatCard label="Commercial Filled" value={summary.commercialFilled} icon={FaIndustry}
                                color="text-emerald-600" bgColor="bg-emerald-50" />
                            <StatCard label="FTL Filled" value={summary.ftlFilled} icon={FaFire}
                                color="text-amber-600" bgColor="bg-amber-50" />
                            <StatCard label="Fiber Filled" value={summary.fiberFilled} icon={FaCubes}
                                color="text-cyan-600" bgColor="bg-cyan-50" />
                        </div>

                        {/* Row 2: Overall condition breakdown */}
                        <p className="text-xs font-semibold text-theme-secondary uppercase tracking-wider mt-2">Overall Stock by Condition</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <StatCard label="Total Filled" value={summary.totalCylFilled} icon={FaBoxes}
                                color="text-green-600" bgColor="bg-green-50" />
                            <StatCard label="Total Empty" value={summary.totalCylEmpty} icon={FaBoxes}
                                color="text-orange-600" bgColor="bg-orange-50" />
                            <StatCard label="Total Defective" value={summary.totalCylDefective} icon={FaBoxes}
                                color="text-red-600" bgColor="bg-red-50" />
                            <StatCard label="Grand Total" value={summary.totalCylinders} icon={FaBoxes}
                                color="text-gray-600" bgColor="bg-gray-50" />
                        </div>

                        <StockTable items={summary.cylinders} showCapacity showCategory />
                    </Section>

                    {/* ═══════════ PRESSURE REGULATORS ═══════════ */}
                    <Section title="Pressure Regulators" icon={FaWrench} iconColor="text-indigo-500"
                        badge={`${summary.prs.length} entries • Total: ${summary.totalPR}`}>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            <StatCard label="Total PR" value={summary.totalPR} icon={FaWrench}
                                color="text-indigo-600" bgColor="bg-indigo-50" />
                            <StatCard label="Domestic PR" value={summary.prDomestic} icon={FaGasPump}
                                color="text-blue-600" bgColor="bg-blue-50" />
                            <StatCard label="Commercial PR" value={summary.prCommercial} icon={FaIndustry}
                                color="text-emerald-600" bgColor="bg-emerald-50" />
                            <StatCard label="Sound" value={summary.prSound} icon={FaWrench}
                                color="text-blue-600" bgColor="bg-blue-50" />
                            <StatCard label="Defective" value={summary.prDefective} icon={FaWrench}
                                color="text-red-600" bgColor="bg-red-50" />
                        </div>

                        <StockTable items={summary.prs} showCategory />
                    </Section>

                    {/* ═══════════ NFR ITEMS ═══════════ */}
                    <Section title="NFR Items" icon={FaCubes} iconColor="text-purple-500"
                        badge={`${summary.nfrs.length} items • Total Qty: ${summary.totalNFR}`}>

                        <StockTable items={summary.nfrs} />
                    </Section>
                </>
            )}
        </div>
    );
};

export default InventoryDashboard;
