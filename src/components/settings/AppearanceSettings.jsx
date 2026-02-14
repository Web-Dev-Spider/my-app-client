import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AppearanceSettings = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'earth', name: 'Earth', color: '#ebe9e7', description: 'Natural and grounded' },
        { id: 'dark', name: 'Dark', color: '#121212', description: 'Easy on the eyes' },
        { id: 'light', name: 'Light', color: '#ffffff', description: 'Clean and crisp' },
        { id: 'slate', name: 'Slate', color: '#4a5162ff', description: 'Professional and cool' },
    ];

    return (
        <div className="space-y-4 animate-fadeIn">
            <div>
                <h3 className="text-xl font-bold text-theme-primary mb-1">Theme Preferences</h3>
                <p className="text-sm text-theme-secondary">Customize the look and feel of your application.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 group ${theme === t.id
                            ? 'border-theme-accent bg-theme-tertiary shadow-md'
                            : 'border-theme-color hover:border-theme-accent/50 hover:bg-theme-tertiary/50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-full border-2 border-theme-color shadow-sm flex-shrink-0 transition-transform duration-300 ${theme === t.id ? 'scale-110' : 'group-hover:scale-105'}`}
                                style={{ backgroundColor: t.color }}
                            />
                            <div>
                                <span className="block font-semibold text-theme-primary text-sm">{t.name}</span>
                                <span className="text-xs text-theme-secondary">{t.description}</span>
                            </div>
                            {theme === t.id && (
                                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-theme-accent shadow-sm animate-pulse" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-6 p-5 bg-theme-tertiary rounded-xl border border-theme-color">
                <h4 className="font-semibold text-theme-primary mb-2 text-sm">Preview</h4>
                <div className="bg-theme-secondary p-3 rounded-lg border border-theme-color shadow-sm">
                    <div className="h-4 w-1/3 bg-theme-primary/20 rounded mb-3"></div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-theme-primary/10 rounded"></div>
                        <div className="h-3 w-5/6 bg-theme-primary/10 rounded"></div>
                        <div className="h-3 w-4/6 bg-theme-primary/10 rounded"></div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <div className="h-7 w-16 bg-theme-accent rounded"></div>
                        <div className="h-7 w-16 bg-theme-primary/20 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearanceSettings;
