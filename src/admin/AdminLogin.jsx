import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAdmin } = useAuth();

    // If already admin, redirect immediately
    if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Small delay for UX
        await new Promise(r => setTimeout(r, 400));

        const result = login(username, password);
        setLoading(false);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-bg"></div>
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <div className="admin-login-icon">🏢</div>
                    <h1>Sabari Tours</h1>
                    <p>Admin Management Panel</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label htmlFor="admin-username">Username</label>
                        <input
                            id="admin-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter admin username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && <div className="admin-login-error">⚠️ {error}</div>}

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? <span className="admin-spinner"></span> : '🔓 Sign In to Dashboard'}
                    </button>
                </form>

                <div className="admin-login-hint">
                    <span>Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>123</strong></span>
                </div>
            </div>
        </div>
    );
}
