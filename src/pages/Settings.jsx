import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaCog, FaPalette, FaUser, FaBell, FaLock, FaChevronRight } from 'react-icons/fa';

const Settings = () => {
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('appearance');

    const themes = [
        { id: 'earth', name: 'Earth', color: '#ebe9e7', description: 'Natural and grounded' },
        { id: 'dark', name: 'Dark', color: '#121212', description: 'Easy on the eyes' },
        { id: 'light', name: 'Light', color: '#ffffff', description: 'Clean and crisp' },
        { id: 'slate', name: 'Slate', color: '#4a5162ff', description: 'Professional and cool' },
    ];

    const tabs = [
        { id: 'general', label: 'General', icon: FaCog },
        { id: 'appearance', label: 'Appearance', icon: FaPalette },
        { id: 'account', label: 'Account', icon: FaUser },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'security', label: 'Security', icon: FaLock },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'appearance':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Theme Preferences</h3>
                            <p className="text-sm text-theme-secondary">Customize the look and feel of your application.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group ${theme === t.id
                                            ? 'border-theme-accent bg-theme-tertiary shadow-md'
                                            : 'border-theme-color hover:border-theme-accent/50 hover:bg-theme-tertiary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-full border-2 border-theme-color shadow-sm flex-shrink-0 transition-transform duration-300 ${theme === t.id ? 'scale-110' : 'group-hover:scale-105'}`}
                                            style={{ backgroundColor: t.color }}
                                        />
                                        <div>
                                            <span className="block font-semibold text-theme-primary">{t.name}</span>
                                            <span className="text-xs text-theme-secondary">{t.description}</span>
                                        </div>
                                        {theme === t.id && (
                                            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-theme-accent shadow-sm animate-pulse" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-theme-tertiary rounded-xl border border-theme-color">
                            <h4 className="font-semibold text-theme-primary mb-2">Preview</h4>
                            <div className="bg-theme-secondary p-4 rounded-lg border border-theme-color shadow-sm">
                                <div className="h-4 w-1/3 bg-theme-primary/20 rounded mb-3"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-theme-primary/10 rounded"></div>
                                    <div className="h-3 w-5/6 bg-theme-primary/10 rounded"></div>
                                    <div className="h-3 w-4/6 bg-theme-primary/10 rounded"></div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <div className="h-8 w-20 bg-theme-accent rounded"></div>
                                    <div className="h-8 w-20 bg-theme-primary/20 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'general':
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
            case 'account':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-theme-primary mb-1">Account Settings</h3>
                            <p className="text-sm text-theme-secondary">Update your personal information.</p>
                        </div>
                        <div className="p-6 bg-theme-secondary rounded-xl border border-theme-color text-center py-12">
                            <FaUser className="mx-auto text-4xl text-theme-secondary mb-3 opacity-50" />
                            <p className="text-theme-secondary">Account details form coming soon.</p>
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
        <div className="min-h-screen bg-theme-primary text-theme-primary transition-colors duration-300 pt-8 pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif text-theme-primary">Settings</h1>
                    <p className="text-theme-secondary mt-1">Manage your account preferences and application settings.</p>
                </div>

                <div className="bg-theme-secondary rounded-2xl shadow-lg border border-theme-color overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-theme-tertiary/30 border-r border-theme-color flex-shrink-0">
                        <nav className="p-4 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
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
                    <div className="flex-1 p-6 md:p-10 bg-theme-secondary overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
