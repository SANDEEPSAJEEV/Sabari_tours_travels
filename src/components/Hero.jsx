import { useMemo } from 'react';
import busLeft from '../assets/images/sabari1.jpg';
import busRight from '../assets/images/sabari2.jpg';

export default function Hero() {
    const particles = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: `${3 + Math.random() * 5}px`,
            duration: `${8 + Math.random() * 12}s`,
            delay: `${Math.random() * 8}s`,
            opacity: 0.1 + Math.random() * 0.2
        }));
    }, []);

    return (
        <section className="hero" id="hero">
            <div className="hero-bg"></div>

            <div className="hero-visuals">
                <div className="hero-bus-wrapper left">
                    <img src={busLeft} alt="Sabari Tourist Bus Left" className="hero-bus-img" />
                </div>
                <div className="hero-bus-wrapper right">
                    <img src={busRight} alt="Sabari Tourist Bus Right" className="hero-bus-img" />
                </div>
            </div>

            <div className="hero-particles">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="hero-particle"
                        style={{
                            left: p.left,
                            width: p.size,
                            height: p.size,
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                            opacity: p.opacity
                        }}
                    />
                ))}
            </div>

            <div className="hero-content">
                <div className="hero-badge">
                    ✨ Trusted by 5000+ Happy Travelers
                </div>

                <h1 className="hero-title">
                    Discover the Magic of<br />
                    <span className="highlight">God's Own Country</span>
                </h1>

                <p className="hero-subtitle">
                    Experience unforgettable journeys across Kerala and beyond with Sabari Tours and Travels.
                    Premium packages for pilgrimages, family tours, and adventure trips.
                </p>

                <div className="hero-actions">
                    <a
                        href="#packages"
                        className="btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        🗺️ Explore Packages
                    </a>
                    <a
                        href="https://wa.me/919876543210?text=Hi%20Sabari%20Tours!%20I'm%20interested%20in%20your%20tour%20packages.%20Can%20you%20help%20me%20plan%20a%20trip?"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                    >
                        💬 Chat With Us
                    </a>
                </div>

                <div className="hero-stats">
                    <div className="hero-stat">
                        <div className="hero-stat-number">5000+</div>
                        <div className="hero-stat-label">Happy Travelers</div>
                    </div>
                    <div className="hero-stat">
                        <div className="hero-stat-number">150+</div>
                        <div className="hero-stat-label">Tour Packages</div>
                    </div>
                    <div className="hero-stat">
                        <div className="hero-stat-number">50+</div>
                        <div className="hero-stat-label">Destinations</div>
                    </div>
                    <div className="hero-stat">
                        <div className="hero-stat-number">12+</div>
                        <div className="hero-stat-label">Years Experience</div>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <div></div>
            </div>
        </section>
    );
}
