import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import AuthModal from './AuthModal';
import logoImg from '../assets/images/logo.jpg.png';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const { currentUser, logout, isAdmin } = useAuth();
    const { getWhatsAppLink } = useSettings();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
                <div className="container navbar-inner">
                    <a href="#" className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={logoImg} alt="Sabari Tours" className="navbar-logo-img" />
                        <span>Sabari Tours</span>
                    </a>

                    <div className="navbar-links">
                        <a href="#packages" onClick={(e) => { e.preventDefault(); scrollTo('packages'); }}>Packages</a>
                        <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About Us</a>
                        <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>Reviews</a>
                        <a href="#footer" onClick={(e) => { e.preventDefault(); scrollTo('footer'); }}>Contact</a>

                        {currentUser ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
                                <div style={{ padding: '6px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}>
                                    👤 {currentUser.name} {isAdmin && <span style={{ color: 'var(--accent-400)', fontWeight: 'bold' }}>(Admin)</span>}
                                </div>
                                {isAdmin && (
                                    <button onClick={() => window.location.href = '/admin/dashboard'} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'var(--gradient-primary)', color: 'black', border: 'none' }}>
                                        Dashboard
                                    </button>
                                )}
                                <button onClick={logout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setAuthModalOpen(true)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', marginLeft: '8px' }}>
                                Sign In
                            </button>
                        )}

                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary navbar-cta"
                        >
                            📞 Book Now
                        </a>
                    </div>

                    <button
                        className={`hamburger ${mobileOpen ? 'active' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
                <a href="#packages" onClick={(e) => { e.preventDefault(); scrollTo('packages'); }}>Packages</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About Us</a>
                <a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo('testimonials'); }}>Reviews</a>
                <a href="#footer" onClick={(e) => { e.preventDefault(); scrollTo('footer'); }}>Contact</a>

                {currentUser ? (
                    <>
                        <div style={{ color: 'var(--accent-400)', padding: '16px 24px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                            Hello, {currentUser.name}
                        </div>
                        {isAdmin && (
                            <button onClick={() => { setMobileOpen(false); window.location.href = '/admin/dashboard'; }} className="btn-secondary" style={{ margin: '0 24px 12px', background: 'var(--gradient-primary)', color: 'black', border: 'none' }}>
                                Admin Dashboard
                            </button>
                        )}
                        <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-secondary" style={{ margin: '0 24px 16px' }}>Logout</button>
                    </>
                ) : (
                    <button onClick={() => { setAuthModalOpen(true); setMobileOpen(false); }} className="btn-secondary" style={{ margin: '16px 24px' }}>
                        Sign In
                    </button>
                )}

                <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ margin: '0 24px' }}
                >
                    📞 Book Now
                </a>
            </div>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
