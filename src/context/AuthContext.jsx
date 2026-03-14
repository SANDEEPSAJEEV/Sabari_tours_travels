import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();
const SESSION_KEY = 'sabari-active-user';

export function AuthProvider({ children }) {
    // We only need to track the active logged-in user in session storage.
    // The master list of users lives in the PostgreSQL database now.
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading active user from sessionStorage:', e);
        }
        return null;
    });

    // Auto-save active user session
    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }, [currentUser]);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setCurrentUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Invalid email or password' };
            }
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, error: 'Network error communicating with server' };
        }
    };

    const register = async (name, email, password) => {
        try {
            // First, register the user in the database auth table
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                return { success: false, error: data.error || 'Registration failed' };
            }

            // If successful, save event to enquiries table for marketing/admin tracking
            try {
                await fetch(`${API_BASE_URL}/api/enquiries`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        subject: 'New User Registration',
                        source: 'Registration'
                    })
                });
            } catch (err) {
                console.error('Failed to log registration enquiry:', err);
            }

            setCurrentUser(data.user);
            return { success: true };

        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, error: 'Network error communicating with server' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, register, logout, isAdmin: currentUser?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
