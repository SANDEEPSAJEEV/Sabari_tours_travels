import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const res = login(formData.email, formData.password);
            if (res.success) {
                onClose();
            } else {
                setError(res.error);
            }
        } else {
            const res = register(formData.name, formData.email, formData.password);
            if (res.success) {
                onClose();
            } else {
                setError(res.error);
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div className="navbar-logo-icon" style={{ margin: '0 auto 16px' }}>🌴</div>
                    <h3>{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {isLogin ? 'Sign in to review and book tour packages' : 'Join us to unearth the magic of Kerala'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="auth-name">Full Name</label>
                            <input
                                id="auth-name"
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="auth-email">Email or Username</label>
                        <input
                            id="auth-email"
                            type="text"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder={isLogin ? "admin123 or email@example.com" : "email@example.com"}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="auth-password">Password</label>
                        <input
                            id="auth-password"
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        style={{ color: 'var(--accent-400)', background: 'none', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
