'use client'
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Moon, Sun, Monitor } from "lucide-react"
import './selectTheme.css'
import { useTheme } from "next-themes"

interface ThemeOption {
    value: string;
    label: string;
    icon: React.ReactNode;
    description: string;
}

const SelectThemeButton = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Ensure component is mounted before rendering theme-dependent content
    useEffect(() => {
        setMounted(true);
    }, []);

    const themes: ThemeOption[] = [
        {
            value: 'light',
            label: 'Light',
            icon: <Sun size={20} />,
            description: 'Light theme for bright environments'
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: <Moon size={20} />,
            description: 'Dark theme for low-light environments'
        },
        {
            value: 'system',
            label: 'System',
            icon: <Monitor size={20} />,
            description: 'Follow system preference'
        }
    ];

    const currentTheme = themes.find(t => t.value === theme) || themes[2]; // Default to system

    // Handle theme selection
    const handleThemeSelect = (themeValue: string) => {
        setTheme(themeValue);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <div className="custom-theme-selector">
                <button className="theme-selector-trigger">
                    <span className="selected-theme-label">Theme</span>
                    <ChevronDown size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="custom-theme-selector" ref={dropdownRef}>
            <button
                className="profile-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                title={`Current theme: ${currentTheme.label}`}
            >
                <div className="selected-theme-content">
                    {currentTheme.icon}
                    <span className="selected-theme-label">{currentTheme.label}</span>
                </div>
                <ChevronDown
                    className={`chevron-icon ${isOpen ? 'rotated' : ''}`}
                    size={16}
                />
            </button>

            {isOpen && (
                <div className="theme-dropdown">
                    {/* <div className="dropdown-header">
                        <span className="dropdown-title">Select Theme</span>
                        <span className="current-badge">{resolvedTheme}</span>
                    </div> */}
                    <ul className="theme-list" role="listbox">
                        {themes.map((themeOption) => (
                            <li
                                key={themeOption.value}
                                className={`theme-option ${theme === themeOption.value ? 'selected' : ''}`}
                                onClick={() => handleThemeSelect(themeOption.value)}
                                role="option"
                                aria-selected={theme === themeOption.value}
                            >
                                <div className="theme-info">
                                    <div className="theme-main">
                                        {themeOption.icon}
                                        <span className="theme-name">{themeOption.label}</span>
                                    </div>
                                    <span className="theme-description">{themeOption.description}</span>
                                </div>
                                {theme === themeOption.value && (
                                    <Check className="check-icon" size={16} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectThemeButton;