import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function AdminSettings() {
    const { settings, updateSettings } = useSettings();
    const [form, setForm] = useState({
        whatsapp_number: settings.whatsapp_number || '',
        phone_display: settings.phone_display || '',
        email: settings.email || '',
        address: settings.address || '',
        wa_message: settings.wa_message || ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setStatus({ type: '', message: '' });
        const result = await updateSettings(form);
        if (result.success) {
            setStatus({ type: 'success', message: '✅ Settings saved successfully!' });
        } else {
            setStatus({ type: 'error', message: `❌ Error: ${result.error}` });
        }
        setLoading(false);
    };

    // Generate live preview of the WhatsApp link
    const previewLink = `https://wa.me/${form.whatsapp_number}`;

    return (
        <div className="admin-packages-container">
            <div className="admin-header">
                <div>
                    <h2 className="admin-title">⚙️ Business Settings</h2>
                    <p className="admin-subtitle">Update your contact details and WhatsApp number. Changes reflect site-wide instantly.</p>
                </div>
                <button
                    className="adm-btn adm-btn-add"
                    onClick={handleSave}
                    disabled={loading}
                    style={{ padding: '10px 24px' }}
                >
                    {loading ? '💾 Saving...' : '💾 Save Settings'}
                </button>
            </div>

            {status.message && (
                <div style={{
                    padding: '14px 20px',
                    borderRadius: '10px',
                    marginBottom: '24px',
                    background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: status.type === 'success' ? '#22c55e' : '#ef4444',
                    border: `1px solid ${status.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    fontWeight: 500
                }}>
                    {status.message}
                </div>
            )}

            <div className="settings-grid">

                {/* WhatsApp Section */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <span className="settings-icon">💬</span>
                        <div>
                            <h3>WhatsApp Number</h3>
                            <p>This number is used for all WhatsApp chat links on the site</p>
                        </div>
                    </div>
                    <div className="settings-field">
                        <label>WhatsApp Number (international format, no + or spaces)</label>
                        <input
                            type="text"
                            name="whatsapp_number"
                            value={form.whatsapp_number}
                            onChange={handleChange}
                            placeholder="e.g., 919876543210"
                        />
                        <div className="settings-hint">
                            🔗 Preview link: <a href={previewLink} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e' }}>{previewLink}</a>
                        </div>
                    </div>
                    <div className="settings-field">
                        <label>Default WhatsApp Message (when user clicks the button)</label>
                        <textarea
                            name="wa_message"
                            value={form.wa_message}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Hi Sabari Tours! I'm interested in your packages..."
                        />
                    </div>
                </div>

                {/* Contact Info Section */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <span className="settings-icon">📞</span>
                        <div>
                            <h3>Contact Information</h3>
                            <p>Displayed in the "Get In Touch" section and footer</p>
                        </div>
                    </div>
                    <div className="settings-field">
                        <label>Phone Number (display text)</label>
                        <input
                            type="text"
                            name="phone_display"
                            value={form.phone_display}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div className="settings-field">
                        <label>Email Address</label>
                        <input
                            type="text"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="info@sabaritours.com"
                        />
                    </div>
                    <div className="settings-field">
                        <label>Business Address</label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Sabari Tours, Aluva, Kerala"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .settings-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    margin-top: 20px;
                }
                .settings-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 28px;
                }
                .settings-card-header {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                    margin-bottom: 24px;
                    padding-bottom: 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }
                .settings-icon {
                    font-size: 2rem;
                    line-height: 1;
                }
                .settings-card-header h3 {
                    margin: 0 0 4px 0;
                    color: white;
                    font-size: 1.1rem;
                }
                .settings-card-header p {
                    margin: 0;
                    color: rgba(255,255,255,0.5);
                    font-size: 0.85rem;
                }
                .settings-field {
                    margin-bottom: 20px;
                }
                .settings-field label {
                    display: block;
                    color: rgba(255,255,255,0.6);
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .settings-field input, .settings-field textarea {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: 0.2s;
                    box-sizing: border-box;
                    resize: vertical;
                }
                .settings-field input:focus, .settings-field textarea:focus {
                    outline: none;
                    border-color: rgba(99, 102, 241, 0.5);
                    background: rgba(0, 0, 0, 0.4);
                }
                .settings-hint {
                    margin-top: 8px;
                    font-size: 0.82rem;
                    color: rgba(255,255,255,0.4);
                }
                @media (max-width: 768px) {
                    .settings-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
