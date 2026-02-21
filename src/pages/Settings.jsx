import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCog, FaPalette, FaUser, FaBell, FaLock, FaChevronRight, FaBuilding, FaBox, FaTruck, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

import UserManagementForm from '../components/settings/UserManagementForm';
import AgencySettings from '../components/settings/AgencySettings';
import AccountSettings from '../components/settings/AccountSettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import ProductManagement from './inventory/ProductManagement';
import SupplierManagement from './inventory/SupplierManagement';
import VehicleManagement from './inventory/VehicleManagement';
import GodownSettingsPage from './settings/GodownSettingsPage';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('appearance');

    const tabs = [
        { id: 'general', label: 'General', icon: FaCog },
        { id: 'appearance', label: 'Appearance', icon: FaPalette },
        { id: 'account', label: 'Account', icon: FaUser },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'security', label: 'Security', icon: FaLock },
        ...(user?.role === 'ADMIN' ? [{ id: 'godowns', label: 'Godowns', icon: FaMapMarkerAlt }] : []),
        ...(user?.role === 'ADMIN' ? [{ id: 'users', label: 'Manage Users', icon: FaUser }] : []),
        ...(user?.role === 'ADMIN' ? [{ id: 'agency', label: 'Agency', icon: FaBuilding }] : []),
        ...(user?.role === 'ADMIN' ? [{ id: 'products', label: 'Manage Products', icon: FaBox }] : []),
        ...(user?.role === 'ADMIN' ? [{ id: 'suppliers', label: 'Manage Suppliers', icon: FaUsers }] : []),
        ...(user?.role === 'ADMIN' ? [{ id: 'vehicles', label: 'Vehicles', icon: FaTruck }] : []),
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'appearance':
                return <AppearanceSettings />;
            case 'account':
                return <AccountSettings />;
            case 'users':
                return (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Manage Users</h3>
                            <p className="text-sm text-theme-secondary">Create and manage staff accounts.</p>
                        </div>
                        <UserManagementForm />
                    </div>
                );
            case 'agency':
                return (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Agency Details</h3>
                            <p className="text-sm text-theme-secondary">Manage agency address and contact information.</p>
                        </div>
                        <AgencySettings />
                    </div>
                );
            case 'godowns':
                return <GodownSettingsPage />;
            case 'products':
                return <ProductManagement />;
            case 'suppliers':
                return <SupplierManagement />;
            case 'vehicles':
                return <VehicleManagement />;
            case 'notifications':
            case 'security':
                return (
                    <div className="space-y-4 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1 capitalize">{activeTab}</h3>
                            <p className="text-sm text-theme-secondary">Manage your {activeTab} settings.</p>
                        </div>
                        <div className="p-4 bg-theme-secondary rounded-xl border border-theme-color text-center py-10">
                            <FaCog className="mx-auto text-3xl text-theme-secondary mb-3 opacity-50" />
                            <p className="text-theme-secondary capitalize">{activeTab} settings content coming soon.</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-64 text-theme-secondary">
                        <p>Select a category to view settings</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-theme-primary text-theme-primary transition-colors duration-300 pt-6 pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold font-serif text-theme-primary">Settings</h1>
                    <p className="text-sm text-theme-secondary mt-1">Manage your account preferences and application settings.</p>
                </div>

                <div className="bg-theme-secondary rounded-2xl shadow-lg border border-theme-color overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                    {/* Sidebar */}
                    <div className="w-full md:w-56 bg-theme-tertiary/30 border-r border-theme-color flex-shrink-0">
                        <nav className="p-3 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-theme-primary text-theme-primary shadow-sm ring-1 ring-theme-color/50'
                                            : 'text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`text-lg ${isActive ? 'text-theme-accent' : 'text-theme-secondary'}`} />
                                            <span>{tab.label}</span>
                                        </div>
                                        {isActive && <FaChevronRight className="text-xs text-theme-accent" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-4 md:p-6 bg-theme-secondary overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
