import React from 'react';

const StockTable = ({ ledgers }) => {
    if (!ledgers || ledgers.length === 0) {
        return (
            <div className="bg-theme-secondary rounded-lg shadow p-6 text-center text-theme-secondary border border-theme-color">
                No stock data available
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-theme-secondary rounded-lg shadow border border-theme-color">
            <table className="min-w-full divide-y divide-theme-color">
                <thead className="bg-theme-tertiary">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Item Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Filled
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Empty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Defective
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Sound
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Qty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider">
                            Last Movement
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-theme-secondary divide-y divide-theme-color">
                    {ledgers.map((ledger) => {
                        const product = ledger.agencyProductId;
                        const hasStock =
                            ledger.stock.filled > 0 ||
                            ledger.stock.empty > 0 ||
                            ledger.stock.defective > 0 ||
                            ledger.stock.sound > 0 ||
                            ledger.stock.defectivePR > 0 ||
                            ledger.stock.quantity > 0;
                        const rowClass = hasStock ? '' : 'opacity-50';

                        return (
                            <tr key={ledger._id} className={rowClass}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                                    {product?.localName || product?.itemCode || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                                    {product?.itemCode || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                                    {ledger.stock.filled}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                                    {ledger.stock.empty}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                                    {ledger.stock.defective}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                                    {ledger.stock.sound}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                                    {ledger.stock.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-secondary">
                                    {ledger.lastMovementAt
                                        ? new Date(ledger.lastMovementAt).toLocaleDateString()
                                        : '—'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable;
