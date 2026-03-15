import { useMemo } from 'react';
import { useSettings } from '../context/SettingsContext';
import busLeft from '../assets/images/sabari1.jpg';
import busRight from '../assets/images/sabari2.jpg';

export default function Hero() {
    const { getWhatsAppLink } = useSettings();
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
                <h1 className="hero-title">
                    Explore Kerala's Best with<br />
                    <span className="highlight">Sabari Tours</span>
                </h1>

                <p className="hero-subtitle">
                    Your trusted partner for unforgettable pilgrimages, family vacations, and adventures across God's Own Country.
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
                        href={getWhatsAppLink("Hi Sabari Tours! 👋 I'm interested in your tour packages. Can you help me plan a trip?")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                    >
                        💬 Chat With Us
                    </a>
                </div>
            </div>

            <div className="scroll-indicator">
                <div></div>
            </div>
        </section>
    );
}
