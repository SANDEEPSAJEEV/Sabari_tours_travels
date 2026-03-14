import { useAuth } from '../context/AuthContext';
import { usePackages } from '../context/PackageContext';

export default function PackageCard({ pkg, onEdit }) {
    const { isAdmin } = useAuth();
    const { deletePackage } = usePackages();

    const categoryLabel = {
        kerala: 'Kerala',
        outside: 'Outside Kerala',
        pilgrim: 'Pilgrimage'
    };

    const imgSrc = pkg.imageData || pkg.image;

    const whatsappMessage = encodeURIComponent(
        `Hi Sabari Tours! I'm interested in the "${pkg.title}" package (${pkg.duration}, ${pkg.price}). Can you share more details?`
    );

    return (
        <div className="package-card" style={{ position: 'relative' }}>
            {isAdmin && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onEdit(pkg)}
                        style={{ padding: '6px 12px', background: 'var(--accent-500)', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={() => window.confirm('Delete this package?') && deletePackage(pkg.id)}
                        style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}

            <div className="package-card-image">
                <img src={imgSrc} alt={pkg.title} loading="lazy" />
                <div className="package-card-badge">
                    {categoryLabel[pkg.category] || pkg.category}
                </div>
            </div>

            <div className="package-card-body">
                <h3 className="package-card-title">{pkg.title}</h3>
                <p className="package-card-desc">{pkg.description}</p>

                <div className="package-card-meta">
                    <div className="package-meta-item">
                        <span className="icon">⏱️</span>
                        <span>{pkg.duration}</span>
                    </div>
                    <div className="package-meta-item">
                        <span className="icon">📍</span>
                        <span>{categoryLabel[pkg.category] || pkg.category}</span>
                    </div>
                </div>

                {pkg.places && pkg.places.length > 0 && (
                    <div className="package-card-meta">
                        {pkg.places.slice(0, 2).map((pl, i) => (
                            <div key={i} className="package-meta-item">
                                <span className="icon">🗺️</span>
                                <span>{pl}</span>
                            </div>
                        ))}
                    </div>
                )}

                {pkg.highlights && pkg.highlights.length > 0 && (
                    <div className="package-card-meta">
                        {pkg.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="package-meta-item">
                                <span className="icon">✓</span>
                                <span>{h}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="package-card-footer">
                    <div className="package-price">
                        {pkg.price} <span>/ person</span>
                    </div>
                    <a
                        href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary package-book-btn"
                    >
                        Book Now
                    </a>
                </div>
            </div>
        </div>
    );
}
