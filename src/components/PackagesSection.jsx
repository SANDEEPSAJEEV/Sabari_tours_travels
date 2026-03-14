import { useState } from 'react';
import { usePackages } from '../context/PackageContext';
import { useAuth } from '../context/AuthContext';
import PackageCard from './PackageCard';
import PackageFormModal from './PackageFormModal';

export default function PackagesSection() {
    const { packages, categories } = usePackages();
    const { isAdmin } = useAuth();
    const [activeFilter, setActiveFilter] = useState('all');

    // Dynamically build filter tabs based on DB categories
    const filters = [
        { key: 'all', label: 'All Packages' },
        ...categories.map(c => ({
            key: c,
            // Fallback hardcoded icons for legacy categories, generic tag for new ones
            label: c === 'kerala' ? '🌴 Kerala' :
                c === 'outside' ? '✈️ Outside Kerala' :
                    c === 'pilgrim' ? '🙏 Pilgrimage' :
                        `🏷️ ${c.charAt(0).toUpperCase() + c.slice(1)}`
        }))
    ];
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);

    const handleEdit = (pkg) => {
        setEditingPkg(pkg);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingPkg(null);
        setModalOpen(true);
    };

    const filtered = activeFilter === 'all'
        ? packages
        : packages.filter(p => p.category === activeFilter);

    return (
        <section className="packages-section" id="packages">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>Our Tour Packages</h2>
                    {isAdmin && (
                        <button onClick={handleAdd} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            ➕ Add New Package
                        </button>
                    )}
                </div>
                <p className="section-subtitle">
                    Explore our handcrafted travel experiences across Kerala and beyond.
                    From serene backwaters to sacred pilgrimages — we've got your perfect trip.
                </p>

                <div className="filter-tabs">
                    {filters.map(f => (
                        <button
                            key={f.key}
                            className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="packages-grid">
                    {filtered.map(pkg => (
                        <PackageCard key={pkg.id} pkg={pkg} onEdit={handleEdit} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                        No packages found in this category. Check back soon!
                    </p>
                )}
            </div>

            <PackageFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editingPkg={editingPkg}
            />
        </section>
    );
}
