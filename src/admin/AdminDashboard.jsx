import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '../context/PackageContext';
import { useAuth } from '../context/AuthContext';
import PackageFormModal from '../components/PackageFormModal';
import EnquiriesTable from './EnquiriesTable';
import AdminSettings from './AdminSettings';

const categoryInfo = {
    kerala: { label: '🌴 Kerala', color: '#22c55e' },
    outside: { label: '✈️ Outside Kerala', color: '#3b82f6' },
    pilgrim: { label: '🙏 Pilgrimage', color: '#f59e0b' }
};

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { packages, deletePackage, resetToDefault } = usePackages();
    const { logout, currentUser } = useAuth();
    const [currentTab, setCurrentTab] = useState('packages'); // 'packages' or 'enquiries'
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('all');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const openAdd = () => {
        setEditingPkg(null);
        setModalOpen(true);
    };

    const openEdit = (pkg) => {
        setEditingPkg(pkg);
        setModalOpen(true);
    };

    const confirmDelete = (id) => setDeleteConfirmId(id);

    const handleDelete = () => {
        deletePackage(deleteConfirmId);
        setDeleteConfirmId(null);
    };

    const handleReset = () => {
        if (window.confirm('Reset all packages to defaults? This cannot be undone.')) {
            resetToDefault();
        }
    };

    const filtered = packages.filter(p => {
        const matchCat = filterCat === 'all' || p.category === filterCat;
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const stats = {
        total: packages.length,
        kerala: packages.filter(p => p.category === 'kerala').length,
        outside: packages.filter(p => p.category === 'outside').length,
        pilgrim: packages.filter(p => p.category === 'pilgrim').length,
    };

    return (
        <div className="admindash">
            {/* Sidebar */}
            <aside className="admindash-sidebar">
                <div className="admindash-brand">
                    <div className="admindash-brand-icon">🏢</div>
                    <div>
                        <div className="admindash-brand-name">Sabari Tours</div>
                        <div className="admindash-brand-sub">Admin Panel</div>
                    </div>
                </div>

                <nav className="admindash-nav">
                    <div
                        className={`admindash-nav-item ${currentTab === 'packages' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('packages')}
                    >
                        <span>📦</span> Packages
                    </div>
                    <div
                        className={`admindash-nav-item ${currentTab === 'enquiries' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('enquiries')}
                    >
                        <span>👥</span> Enquiries
                    </div>
                    <div
                        className={`admindash-nav-item ${currentTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('settings')}
                    >
                        <span>⚙️</span> Settings
                    </div>
                </nav>

                <div className="admindash-sidebar-bottom">
                    <div className="admindash-user">
                        <div className="admindash-user-avatar">👤</div>
                        <div>
                            <div className="admindash-user-name">{currentUser?.name || 'Admin'}</div>
                            <div className="admindash-user-role">Administrator</div>
                        </div>
                    </div>
                    <button className="admindash-logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                    <a href="/" className="admindash-viewsite-btn">
                        🌐 View Live Site
                    </a>
                </div>
            </aside>

            {/* Main content */}
            <main className="admindash-main">
                {currentTab === 'packages' ? (
                    <>
                        {/* Header */}
                        <div className="admindash-topbar">
                            <div>
                                <h1 className="admindash-title">Tour Package Manager</h1>
                                <p className="admindash-subtitle">Add, edit, and manage all your tour packages</p>
                            </div>
                            <div className="admindash-topbar-actions">
                                <button className="adm-btn adm-btn-reset" onClick={handleReset}>🔄 Reset to Default</button>
                                <button className="adm-btn adm-btn-add" onClick={openAdd}>➕ Add New Package</button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="admindash-stats">
                            <div className="adm-stat-card">
                                <div className="adm-stat-num">{stats.total}</div>
                                <div className="adm-stat-label">Total Packages</div>
                            </div>
                            <div className="adm-stat-card" style={{ borderColor: '#22c55e' }}>
                                <div className="adm-stat-num" style={{ color: '#22c55e' }}>{stats.kerala}</div>
                                <div className="adm-stat-label">Kerala Tours</div>
                            </div>
                            <div className="adm-stat-card" style={{ borderColor: '#3b82f6' }}>
                                <div className="adm-stat-num" style={{ color: '#3b82f6' }}>{stats.outside}</div>
                                <div className="adm-stat-label">Outside Kerala</div>
                            </div>
                            <div className="adm-stat-card" style={{ borderColor: '#f59e0b' }}>
                                <div className="adm-stat-num" style={{ color: '#f59e0b' }}>{stats.pilgrim}</div>
                                <div className="adm-stat-label">Pilgrimage</div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="admindash-filters">
                            <input
                                className="adm-search"
                                type="text"
                                placeholder="🔍 Search packages..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <div className="adm-filter-tabs">
                                {['all', 'kerala', 'outside', 'pilgrim'].map(cat => (
                                    <button
                                        key={cat}
                                        className={`adm-filter-tab ${filterCat === cat ? 'active' : ''}`}
                                        onClick={() => setFilterCat(cat)}
                                    >
                                        {cat === 'all' ? 'All' : categoryInfo[cat]?.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Package Cards Grid */}
                        <div className="admindash-grid">
                            {filtered.map(pkg => {
                                const imgSrc = pkg.imageData || pkg.image;
                                const cat = categoryInfo[pkg.category];
                                return (
                                    <div key={pkg.id} className="adm-pkg-card">
                                        <div className="adm-pkg-img-wrapper">
                                            <img
                                                src={imgSrc}
                                                alt={pkg.title}
                                                className="adm-pkg-img"
                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=60'; }}
                                            />
                                            <div className="adm-pkg-cat-badge" style={{ background: cat?.color }}>
                                                {cat?.label}
                                            </div>
                                        </div>
                                        <div className="adm-pkg-body">
                                            <h3 className="adm-pkg-title">{pkg.title}</h3>
                                            <p className="adm-pkg-desc">{pkg.description}</p>
                                            <div className="adm-pkg-meta">
                                                <span>⏱️ {pkg.duration}</span>
                                                <span className="adm-pkg-price">{pkg.price}</span>
                                            </div>
                                            {pkg.places && pkg.places.length > 0 && (
                                                <div className="adm-pkg-places">
                                                    {pkg.places.slice(0, 3).map((pl, i) => (
                                                        <span key={i} className="adm-place-tag">📍 {pl}</span>
                                                    ))}
                                                    {pkg.places.length > 3 && <span className="adm-place-tag">+{pkg.places.length - 3} more</span>}
                                                </div>
                                            )}
                                            {pkg.highlights && pkg.highlights.length > 0 && (
                                                <div className="adm-pkg-highlights">
                                                    {pkg.highlights.slice(0, 3).map((h, i) => (
                                                        <span key={i} className="adm-highlight-tag">✓ {h}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="adm-pkg-actions">
                                                <button className="adm-edit-btn" onClick={() => openEdit(pkg)}>✏️ Edit</button>
                                                <button className="adm-delete-btn" onClick={() => confirmDelete(pkg.id)}>🗑️ Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {filtered.length === 0 && (
                                <div className="adm-empty">
                                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                                    <p>No packages found. Add your first package!</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : currentTab === 'enquiries' ? (
                    <EnquiriesTable />
                ) : (
                    <AdminSettings />
                )}
            </main>

            {/* Package Form Modal */}
            <PackageFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editingPkg={editingPkg}
            />

            {/* Delete Confirm Dialog */}
            {deleteConfirmId && (
                <div className="adm-confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
                    <div className="adm-confirm-box" onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⚠️</div>
                        <h3>Delete Package?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="adm-confirm-actions">
                            <button className="adm-btn adm-btn-reset" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                            <button className="adm-btn adm-btn-delete" onClick={handleDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
