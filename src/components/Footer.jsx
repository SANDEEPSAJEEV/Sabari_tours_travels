import { useSettings } from '../context/SettingsContext';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { settings, getWhatsAppLink } = useSettings();

    return (
        <footer className="footer" id="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="navbar-logo" style={{ marginBottom: '4px' }}>
                            <div className="navbar-logo-icon">🌴</div>
                            <span>Sabari Tours</span>
                        </div>
                        <p>
                            Your trusted travel partner for Kerala and all-India tour packages.
                            Creating unforgettable journeys since 2012.
                        </p>
                    </div>

                    <div>
                        <h4 className="footer-heading">Quick Links</h4>
                        <div className="footer-links">
                            <a href="#hero" onClick={(e) => { e.preventDefault(); document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); }}>Home</a>
                            <a href="#packages" onClick={(e) => { e.preventDefault(); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }); }}>Packages</a>
                            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About Us</a>
                            <a href="#testimonials" onClick={(e) => { e.preventDefault(); document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }); }}>Reviews</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-heading">Destinations</h4>
                        <div className="footer-links">
                            <a href="#packages">Munnar</a>
                            <a href="#packages">Alleppey</a>
                            <a href="#packages">Wayanad</a>
                            <a href="#packages">Goa</a>
                            <a href="#packages">Ooty</a>
                            <a href="#packages">Rameswaram</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-heading">Contact Us</h4>
                        <div className="footer-contact-item">
                            <span className="icon">📍</span>
                            <span>{settings.address}</span>
                        </div>
                        <div className="footer-contact-item">
                            <span className="icon">📞</span>
                            <span>{settings.phone_display}</span>
                        </div>
                        <div className="footer-contact-item">
                            <span className="icon">✉️</span>
                            <span>{settings.email}</span>
                        </div>
                        {settings.whatsapp_number && (
                            <div className="footer-contact-item">
                                <span className="icon">💬</span>
                                <span>+{settings.whatsapp_number}</span>
                            </div>
                        )}
                        <div className="footer-contact-item">
                            <span className="icon">⏰</span>
                            <span>Mon - Sat: 9AM - 8PM</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {currentYear} Sabari Tours and Travels. All Rights Reserved.</p>
                    <div className="footer-socials">
                        <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-social"
                            title="WhatsApp"
                        >
                            💬
                        </a>
                        <a href="#" className="footer-social" title="Facebook">📘</a>
                        <a href="#" className="footer-social" title="Instagram">📸</a>
                        <a href="#" className="footer-social" title="YouTube">🎬</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
