import React from 'react';
import { FaCog } from 'react-icons/fa';

const GeneralSettings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-theme-primary mb-1">General Settings</h3>
                <p className="text-sm text-theme-secondary">Manage your general application preferences.</p>
            </div>
            <div className="p-6 bg-theme-secondary rounded-xl border border-theme-color text-center py-12">
                <FaCog className="mx-auto text-4xl text-theme-secondary mb-3 opacity-50" />
                <p className="text-theme-secondary">General settings content coming soon.</p>
            </div>
        </div>
    );
};

export default GeneralSettings;
