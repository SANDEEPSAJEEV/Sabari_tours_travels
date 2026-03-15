import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { API_BASE_URL } from '../config';

export default function ContactSection() {
    const { settings, getWhatsAppLink } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    source: 'Contact Form'
                })
            });

            if (!res.ok) throw new Error('Failed to send enquiry. Please try again.');

            setStatus({ type: 'success', message: 'Thank you! Your enquiry has been sent successfully.' });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact-section" id="contact">
            <div className="container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Get In Touch</h2>
                        <p className="section-subtitle" style={{ textAlign: 'left', margin: '10px 0 30px' }}>
                            Have questions about our tour packages? We're here to help you plan your perfect journey.
                        </p>

                        <div className="contact-methods">
                            <div className="contact-method">
                                <div className="method-icon">📍</div>
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>{settings.address}</p>
                                </div>
                            </div>
                            <div className="contact-method">
                                <div className="method-icon">📞</div>
                                <div>
                                    <h4>Call Us</h4>
                                    <p><a href={`tel:${settings.phone_display?.replace(/\D/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{settings.phone_display}</a></p>
                                </div>
                            </div>
                            {settings.whatsapp_number && (
                                <div className="contact-method">
                                    <div className="method-icon" style={{ background: 'linear-gradient(135deg, #128C7E, #25D366)' }}>💬</div>
                                    <div>
                                        <h4>WhatsApp Us</h4>
                                        <p><a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>+{settings.whatsapp_number}</a></p>
                                    </div>
                                </div>
                            )}
                            <div className="contact-method">
                                <div className="method-icon">✉️</div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p><a href={`mailto:${settings.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{settings.email}</a></p>
                                </div>
                            </div>
                        </div>

                        <div className="wa-promo">
                            <p>For instant booking & support:</p>
                            <a
                                href={getWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-wa"
                            >
                                💬 WhatsApp Us Now
                            </a>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <form onSubmit={handleSubmit} className="enquiry-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="E.g., Munnar Trip"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Your Message / Requirements</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your travel plans..."
                                ></textarea>
                            </div>

                            {status.message && (
                                <div className={`form-status ${status.type}`}>
                                    {status.message}
                                </div>
                            )}

                            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Sending...' : '🚀 Send Enquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .contact-section {
                    padding: var(--section-padding) 0;
                    background: var(--bg-950);
                    position: relative;
                }
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.2fr;
                    gap: 60px;
                    align-items: center;
                }
                .contact-methods {
                    display: grid;
                    gap: 25px;
                    margin-bottom: 30px;
                }
                .contact-method {
                    display: flex;
                    gap: 15px;
                    align-items: flex-start;
                }
                .method-icon {
                    width: 45px;
                    height: 45px;
                    background: var(--accent-gradient);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                .contact-method h4 {
                    margin: 0 0 5px 0;
                    color: white;
                }
                .contact-method p {
                    margin: 0;
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.95rem;
                }
                .contact-method p a:hover {
                    color: var(--accent-400) !important;
                }
                .wa-promo {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    padding: 20px;
                    border-radius: 16px;
                }
                .wa-promo p { margin: 0 0 12px 0; color: #22c55e; font-weight: 500; }
                .btn-wa {
                    display: inline-block;
                    background: #22c55e;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: 0.3s;
                }
                .btn-wa:hover { background: #16a34a; transform: translateY(-2px); }

                .contact-form-card {
                    background: var(--bg-glass);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--border-color);
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 12px 16px;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    transition: 0.3s;
                    box-sizing: border-box;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--accent-500);
                    outline: none;
                    background: rgba(0, 0, 0, 0.4);
                }
                .form-status {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    text-align: center;
                }
                .form-status.success {
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }
                .form-status.error {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }
                    .form-row { 
                        grid-template-columns: 1fr; 
                        gap: 0; 
                    }
                    .section-title, .section-subtitle {
                        text-align: center !important;
                    }
                }
                @media (max-width: 480px) {
                    .contact-section { padding: 40px 0; }
                    .form-row { grid-template-columns: 1fr; gap: 0; }
                    .contact-form-card { padding: 25px 20px; border-radius: 16px; }
                    .contact-method h4 { font-size: 0.95rem; }
                    .contact-method p { font-size: 0.85rem; }
                    .wa-promo { padding: 15px; }
                    .section-title { font-size: 2rem !important; }
                    .section-subtitle { font-size: 0.9rem !important; }
                }
            `}</style>
        </section>
    );
}
