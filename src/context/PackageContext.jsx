import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { defaultPackages } from '../data/data';

import { API_BASE_URL } from '../config';

const PackageContext = createContext();

const API_URL = `${API_BASE_URL}/api/packages`;

export function PackageProvider({ children }) {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch all packages from the API ──────────────────────────────────────
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error(`Server responded ${res.status}`);
            const data = await res.json();
            setPackages(data);
        } catch (err) {
            console.warn('API unavailable, falling back to defaults:', err.message);
            // Graceful fallback to hardcoded defaults if server is down
            setError('Could not connect to server. Showing cached data.');
            const stored = localStorage.getItem('sabari-tours-packages');
            setPackages(stored ? JSON.parse(stored) : defaultPackages);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    // ── Add package ──────────────────────────────────────────────────────────
    const addPackage = async (pkg) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pkg)
            });
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const newPkg = await res.json();
            setPackages(prev => [...prev, newPkg]);
            return newPkg;
        } catch (err) {
            console.error('addPackage error:', err);
            // Optimistic local fallback
            const newPkg = { ...pkg, id: Date.now() };
            setPackages(prev => [...prev, newPkg]);
            return newPkg;
        }
    };

    // ── Update package ───────────────────────────────────────────────────────
    const updatePackage = async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            const updated = await res.json();
            setPackages(prev => prev.map(p => p.id === id ? updated : p));
        } catch (err) {
            console.error('updatePackage error:', err);
            setPackages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        }
    };

    // ── Delete package ───────────────────────────────────────────────────────
    const deletePackage = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Server error ${res.status}`);
            setPackages(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('deletePackage error:', err);
            setPackages(prev => prev.filter(p => p.id !== id));
        }
    };

    // ── Reset to defaults (re-seeds via API if available) ───────────────────
    const resetToDefault = async () => {
        await fetchPackages();
    };

    return (
        <PackageContext.Provider value={{
            packages,
            loading,
            error,
            addPackage,
            updatePackage,
            deletePackage,
            resetToDefault,
            refetch: fetchPackages
        }}>
            {children}
        </PackageContext.Provider>
    );
}

export function usePackages() {
    const context = useContext(PackageContext);
    if (!context) {
        throw new Error('usePackages must be used within a PackageProvider');
    }
    return context;
}
