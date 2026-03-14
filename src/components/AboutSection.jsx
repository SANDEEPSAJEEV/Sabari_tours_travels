import sureshImg from '../assets/images/suresh.jpg';
import sabariImg from '../assets/images/sabari.jpg';

export default function AboutSection() {
    return (
        <section className="about-section" id="about">
            <div className="container">
                <h2 className="section-title">About Sabari Tours</h2>
                <p className="section-subtitle">
                    Your trusted travel partner in Kerala for over 12 years, crafting unforgettable journeys for families, pilgrims, and adventure seekers.
                </p>

                <div className="about-content">
                    <div className="about-text">
                        <h3>Your Journey Begins With Trust</h3>
                        <p>
                            Founded with a passion for showcasing the beauty of Kerala and beyond,
                            Sabari Tours and Travels has been serving happy travelers since 2012.
                            We specialize in curated travel experiences — from the misty hills of Munnar
                            to the sacred temples of South India.
                        </p>
                        <p>
                            Our commitment to excellent service, comfortable travel, and authentic experiences
                            has made us one of the most trusted tour operators in Kerala. Whether it's a family
                            vacation, a pilgrim tour, or a corporate outing, we handle every detail with care.
                        </p>

                        <div className="about-features">
                            <div className="about-feature">
                                <span className="icon">🛡️</span>
                                <span>Safe & Secure Travel</span>
                            </div>
                            <div className="about-feature">
                                <span className="icon">💰</span>
                                <span>Best Price Guarantee</span>
                            </div>
                            <div className="about-feature">
                                <span className="icon">🚐</span>
                                <span>Comfortable Vehicles</span>
                            </div>
                            <div className="about-feature">
                                <span className="icon">📞</span>
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="about-image-grid">
                        <div className="about-img-card">
                            <img
                                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80"
                                alt="Kerala tea gardens"
                                loading="lazy"
                            />
                        </div>
                        <div className="about-img-card">
                            <img
                                src="https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80"
                                alt="Kerala backwaters"
                                loading="lazy"
                            />
                        </div>
                        <div className="about-img-card">
                            <img
                                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80"
                                alt="Beach destination"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

                {/* Owners Section */}
                <h2 className="section-title" style={{ marginTop: '40px' }}>Meet Our Team</h2>
                <p className="section-subtitle">
                    The visionary leaders behind Sabari Tours and Travels — dedicated to making every journey memorable.
                </p>

                <div className="owners-grid">
                    <div className="owner-card">
                        <div className="owner-avatar">
                            <img
                                src={sureshImg}
                                alt="Suresh Kumar - Owner & Proprietor"
                                onError={(e) => {
                                    e.target.src = "https://gemini.google.com/141/image_0.png"; // Fallback to placeholder if file not found
                                }}
                            />
                        </div>
                        <h3 className="owner-name">Suresh Kumar</h3>
                        <div className="owner-role">Owner & Proprietor</div>
                        <p className="owner-bio">
                            With over 12 years of experience in the travel industry, Suresh Kumar
                            founded Sabari Tours and Travels with a vision to provide premium travel
                            experiences at affordable prices. His passion for Kerala's culture and natural
                            beauty drives every tour package we create.
                        </p>
                    </div>

                    <div className="owner-card">
                        <div className="owner-avatar">
                            <img
                                src={sabariImg}
                                alt="Sabari S - Incharge of Tours and Travels"
                                onError={(e) => {
                                    e.target.src = "https://gemini.google.com/145/image_0.png"; // Fallback to placeholder if file not found
                                }}
                            />
                        </div>
                        <h3 className="owner-name">Sabari S</h3>
                        <div className="owner-role">Incharge of Tours & Travels</div>
                        <p className="owner-bio">
                            Sabari S brings energy and innovation to every tour operation. As the
                            Incharge of Tours and Travels, he personally oversees itinerary planning,
                            customer satisfaction, and ensures every traveler has a seamless and
                            unforgettable experience with us.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
