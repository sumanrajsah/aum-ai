'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import './selectTheme.css'
import { useSettingsStore } from "@/store/useSettingsStore"

const BgButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // split selectors to avoid creating a new object every render
    const settings = useSettingsStore((s) => s.settings)
    const setSettings = useSettingsStore((s) => s.setSettings)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const currentValue = settings?.background ?? "space"

    const options = useMemo(
        () => [
            { value: "none", label: "None" },
            { value: "space", label: "Outer Space" },
        ],
        []
    )

    const handleToggle = useCallback(() => setIsOpen((v) => !v), [])

    const handleSelect = useCallback(
        async (value: "none" | "space") => {
            setIsOpen(false)
            if (value === currentValue) return // guard: avoid no-op updates
            try {
                await setSettings({ background: value })
            } catch {
                // handle in store
            }
        },
        [currentValue, setSettings]
    )

    if (!mounted) {
        return (
            <div className="custom-theme-selector">
                <button className="theme-selector-trigger">
                    <span className="selected-theme-label">Background</span>
                    <ChevronDown size={16} />
                </button>
            </div>
        )
    }

    const currentOption = options.find((o) => o.value === currentValue) || options[0]

    return (
        <div className="custom-theme-selector" ref={dropdownRef}>
            <button
                className="profile-btn"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                title={`Current background: ${currentOption.label}`}
            >
                <div className="selected-theme-content">
                    <span className="selected-theme-label">{currentOption.label}</span>
                </div>
                <ChevronDown className={`chevron-icon ${isOpen ? "rotated" : ""}`} size={16} />
            </button>

            {isOpen && (
                <div className="theme-dropdown">
                    <ul className="theme-list" role="listbox">
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                className={`theme-option ${currentValue === opt.value ? "selected" : ""}`}
                                onClick={() => handleSelect(opt.value as "none" | "space")}
                                role="option"
                                aria-selected={currentValue === opt.value}
                            >
                                <div className="theme-info">
                                    <span className="theme-name">{opt.label}</span>
                                </div>
                                {currentValue === opt.value && <Check className="check-icon" size={16} />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default React.memo(BgButton)
