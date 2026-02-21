import React from 'react';

const TripBadge = ({ tripNumber }) => {
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Trip #{tripNumber}
        </span>
    );
};

export default TripBadge;
