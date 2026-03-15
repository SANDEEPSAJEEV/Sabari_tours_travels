import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
    whatsapp_number: '919876543210',
    phone_display: '+91 98765 43210',
    email: 'info@sabaritours.com',
    address: 'Sabari Tours and Travels, Aluva, Kerala',
    wa_message: "Hi Sabari Tours! I'm interested in your tour packages. Can you help me plan a trip?"
};

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`);
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched Settings:', data);
                setSettings({ ...DEFAULT_SETTINGS, ...data });
            }
        } catch (err) {
            console.warn('Settings API unavailable, using defaults');
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            console.log('Updating settings with:', newSettings);
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Failed to save settings: ${errText}`);
            }
            const updated = await res.json();
            console.log('Settings updated successfully:', updated);
            setSettings({ ...DEFAULT_SETTINGS, ...updated });
            return { success: true };
        } catch (err) {
            console.error('Update settings failed:', err);
            return { success: false, error: err.message };
        }
    };

    // Build WhatsApp link from current settings
    const getWhatsAppLink = (customMessage) => {
        // Strip non-digits for the WhatsApp API
        const rawNumber = (settings.whatsapp_number || '919876543210').toString();
        let cleanNumber = rawNumber.replace(/\D/g, '');

        // Auto-prepend 91 if it's a 10-digit number (common for India)
        if (cleanNumber.length === 10) {
            cleanNumber = '91' + cleanNumber;
        }

        const message = customMessage || settings.wa_message || "Hi Sabari Tours!";
        const link = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        console.log(`Generated WA link: ${link}`);
        return link;
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, getWhatsAppLink }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
    return ctx;
}
