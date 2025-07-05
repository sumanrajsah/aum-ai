// components/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <button
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="profile-btn"
        >
            {currentTheme === 'dark' ? <><Sun size={20} />Light</> : <><Moon size={20} />Dark</>} Mode
        </button>
    );
}
