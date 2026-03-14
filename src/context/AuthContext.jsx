import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

const STORAGE_KEY = 'sabari-users';
const SESSION_KEY = 'sabari-active-user';

// Mock initial admin user
const initialUsers = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin',
        password: '123',
        role: 'admin'
    }
];

export function AuthProvider({ children }) {
    const [users, setUsers] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading users from localStorage:', e);
        }
        return initialUsers;
    });

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const stored = sessionStorage.getItem(SESSION_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading active user from sessionStorage:', e);
        }
        return null;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem(SESSION_KEY);
        }
    }, [currentUser]);

    const login = (email, password) => {
        const user = users.find(u =>
            (u.email === email || (u.email === 'admin' && email === 'admin123')) &&
            u.password === password
        );

        if (user) {
            setCurrentUser(user);
            return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
    };

    const register = async (name, email, password) => {
        if (users.some(u => u.email === email)) {
            return { success: false, error: 'Email already exists' };
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            role: 'user'
        };

        // Also save to PostgreSQL enquiries table for marketing/admin tracking
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
            console.error('Failed to save registration enquiry to database:', err);
        }

        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        return { success: true };
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
