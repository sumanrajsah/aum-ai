import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Settings = {
    // put all user settings here
    theme: 'light' | 'dark';
    language: string;
    background: "none" | "space" // <— add this
    systemContextWindow: number;
    memory: boolean;
};

type SettingsStore = {
    settings: Settings;
    loading: boolean;
    error?: string;
    init: () => Promise<void>;
    setSettings: (patch: Partial<Settings>) => Promise<void>;
    replaceSettings: (next: Settings) => void;
};


async function fetchSettingsApi(): Promise<Settings | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/settings`, { credentials: 'include' });
    console.log(res)
    console.info(res)
    if (!res.ok) throw new Error('Failed to fetch settings');
    return (await res.json()) as Settings;
}

async function saveSettingsApi(settings: Settings): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/v1/user/settings`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to save settings');
}

export const useSettingsStore = create<SettingsStore>()(
    (set, get) => ({
        settings: { theme: 'light', language: 'en', background: "none", systemContextWindow: 3, memory: false }, // always defined
        loading: false,
        error: undefined,

        init: async () => {
            if (typeof window === 'undefined') return;
            set({ loading: true, error: undefined });
            try {
                const serverSettings = await fetchSettingsApi();
                if (serverSettings) {
                    // Merge with defaults in case server returns partial settings
                    const defaults = { theme: 'light', language: 'en', background: "none", systemContextWindow: 3, memory: false };
                    set({ settings: { ...defaults, ...serverSettings } });
                }
            } catch (err: any) {
                set({ error: err?.message ?? 'Fetch error' });
            } finally {
                set({ loading: false });
            }
        },

        setSettings: async (patch) => {
            const prev = get().settings;
            const next = { ...prev, ...patch };
            set({ settings: next, error: undefined });

            try {
                await saveSettingsApi(next);
            } catch (err: any) {
                set({ settings: prev, error: err?.message ?? 'Save failed' });
                throw err;
            }
        },

        replaceSettings: (next) => set({ settings: next }),
    })
);
