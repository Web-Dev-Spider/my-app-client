import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'earth', name: 'Earth', color: '#ebe9e7' },
        { id: 'dark', name: 'Dark', color: '#121212' },
        { id: 'light', name: 'Light', color: '#ffffff' },
        { id: 'slate', name: 'Slate', color: '#4a5162ff' },
    ];

    return (
        <div className="min-h-screen bg-theme-primary text-theme-primary p-4 transition-colors duration-300 flex justify-center items-start pt-10">
            <div className="w-full max-w-md">
                <div className="bg-theme-secondary p-5 rounded-lg shadow-sm border border-theme-color transition-colors duration-300">
                    <h2 className="text-lg font-bold mb-3 border-b border-theme-color pb-2">Settings</h2>

                    <div className="mb-4">
                        <label className="text-sm font-medium text-theme-secondary block mb-2">Theme</label>
                        <div className="grid grid-cols-2 gap-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={`p-2 rounded border flex items-center gap-2 transition-all ${theme === t.id
                                        ? 'border-theme-accent bg-theme-tertiary shadow-sm'
                                        : 'border-theme-color hover:bg-theme-tertiary'
                                        }`}
                                >
                                    <div
                                        className="w-5 h-5 rounded-full border border-theme-color shadow-sm"
                                        style={{ backgroundColor: t.color }}
                                    />
                                    <span className="text-sm font-medium">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
