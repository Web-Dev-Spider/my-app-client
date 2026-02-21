import React from 'react';

const VehicleTypeBadge = ({ vehicleType }) => {
    const typeColors = {
        'auto': { bg: 'bg-blue-100', text: 'text-blue-800' },
        '407': { bg: 'bg-green-100', text: 'text-green-800' },
        'pickup': { bg: 'bg-orange-100', text: 'text-orange-800' },
        'van': { bg: 'bg-purple-100', text: 'text-purple-800' },
        'truck': { bg: 'bg-red-100', text: 'text-red-800' },
        'bike': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    };

    const style = typeColors[vehicleType?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            {vehicleType || 'Other'}
        </span>
    );
};

export default VehicleTypeBadge;
