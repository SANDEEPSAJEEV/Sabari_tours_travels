import { useState, useEffect, useRef } from 'react';
import { usePackages } from '../context/PackageContext';

const emptyForm = {
    title: '',
    description: '',
    duration: '',
    price: '',
    category: 'kerala',
    image: '',
    imageData: null,
    highlights: [],
    places: []
};

export default function PackageFormModal({ isOpen, onClose, editingPkg }) {
    const { addPackage, updatePackage } = usePackages();
    const [form, setForm] = useState(emptyForm);
    const [highlightInput, setHighlightInput] = useState('');
    const [placeInput, setPlaceInput] = useState('');
    const [imgPreview, setImgPreview] = useState('');
    const [imgMode, setImgMode] = useState('upload'); // 'upload' | 'url'
    const [saving, setSaving] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        if (!isOpen) return;
        if (editingPkg) {
            const highlights = Array.isArray(editingPkg.highlights)
                ? editingPkg.highlights
                : (editingPkg.highlights ? editingPkg.highlights.split(',').map(h => h.trim()).filter(Boolean) : []);
            const places = Array.isArray(editingPkg.places) ? editingPkg.places : [];
            setForm({
                title: editingPkg.title || '',
                description: editingPkg.description || '',
                duration: editingPkg.duration || '',
                price: editingPkg.price || '',
                category: editingPkg.category || 'kerala',
                image: editingPkg.image || '',
                imageData: editingPkg.imageData || null,
                highlights,
                places
            });
            setImgPreview(editingPkg.imageData || editingPkg.image || '');
            setImgMode(editingPkg.imageData ? 'upload' : 'url');
        } else {
            setForm(emptyForm);
            setImgPreview('');
            setImgMode('upload');
        }
        setHighlightInput('');
        setPlaceInput('');
    }, [editingPkg, isOpen]);

    if (!isOpen) return null;

    // Image file pick → base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const b64 = ev.target.result;
            setForm(f => ({ ...f, imageData: b64, image: '' }));
            setImgPreview(b64);
        };
        reader.readAsDataURL(file);
    };

    // Highlights tag add
    const addHighlight = () => {
        const val = highlightInput.trim();
        if (val && !form.highlights.includes(val)) {
            setForm(f => ({ ...f, highlights: [...f.highlights, val] }));
        }
        setHighlightInput('');
    };
    const removeHighlight = (h) => setForm(f => ({ ...f, highlights: f.highlights.filter(x => x !== h) }));

    // Places tag add
    const addPlace = () => {
        const val = placeInput.trim();
        if (val && !form.places.includes(val)) {
            setForm(f => ({ ...f, places: [...f.places, val] }));
        }
        setPlaceInput('');
    };
    const removePlace = (pl) => setForm(f => ({ ...f, places: f.places.filter(x => x !== pl) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await new Promise(r => setTimeout(r, 300));

        const pkgData = {
            title: form.title,
            description: form.description,
            duration: form.duration,
            price: form.price,
            category: form.category,
            image: form.imageData ? '' : form.image,
            imageData: form.imageData || null,
            highlights: form.highlights,
            places: form.places
        };

        if (editingPkg) {
            updatePackage(editingPkg.id, pkgData);
        } else {
            addPackage(pkgData);
        }

        setSaving(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="pkg-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="pkg-modal-header">
                    <h2>{editingPkg ? '✏️ Edit Tour Package' : '➕ Add New Package'}</h2>
                    <button className="pkg-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="pkg-modal-body">
                    <form onSubmit={handleSubmit} className="pkg-modal-form">

                        {/* Two-column layout */}
                        <div className="pkg-modal-cols">
                            {/* LEFT: main info */}
                            <div className="pkg-modal-col">
                                <div className="pkg-field">
                                    <label>Package Title *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        placeholder="e.g., Munnar Hill Station Retreat"
                                        required
                                    />
                                </div>

                                <div className="pkg-field">
                                    <label>Description *</label>
                                    <textarea
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Describe this tour package in detail..."
                                        required
                                        rows={4}
                                    />
                                </div>

                                <div className="pkg-row">
                                    <div className="pkg-field">
                                        <label>Duration *</label>
                                        <input
                                            type="text"
                                            value={form.duration}
                                            onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                            placeholder="e.g., 3 Days / 2 Nights"
                                            required
                                        />
                                    </div>
                                    <div className="pkg-field">
                                        <label>Tariff / Price *</label>
                                        <input
                                            type="text"
                                            value={form.price}
                                            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                            placeholder="e.g., ₹8,999"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pkg-field">
                                    <label>Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    >
                                        <option value="kerala">🌴 Kerala</option>
                                        <option value="outside">✈️ Outside Kerala</option>
                                        <option value="pilgrim">🙏 Pilgrimage</option>
                                    </select>
                                </div>

                                {/* Places Included */}
                                <div className="pkg-field">
                                    <label>Places Included</label>
                                    <div className="pkg-tag-input">
                                        <input
                                            type="text"
                                            value={placeInput}
                                            onChange={e => setPlaceInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addPlace(); } }}
                                            placeholder="Type place & press Enter..."
                                        />
                                        <button type="button" className="pkg-tag-add-btn" onClick={addPlace}>+ Add</button>
                                    </div>
                                    <div className="pkg-tags">
                                        {form.places.map((pl, i) => (
                                            <span key={i} className="pkg-place-chip">
                                                📍 {pl}
                                                <button type="button" onClick={() => removePlace(pl)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Highlights */}
                                <div className="pkg-field">
                                    <label>Highlights / Inclusions</label>
                                    <div className="pkg-tag-input">
                                        <input
                                            type="text"
                                            value={highlightInput}
                                            onChange={e => setHighlightInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addHighlight(); } }}
                                            placeholder="Type highlight & press Enter..."
                                        />
                                        <button type="button" className="pkg-tag-add-btn" onClick={addHighlight}>+ Add</button>
                                    </div>
                                    <div className="pkg-tags">
                                        {form.highlights.map((h, i) => (
                                            <span key={i} className="pkg-highlight-chip">
                                                ✓ {h}
                                                <button type="button" onClick={() => removeHighlight(h)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: image */}
                            <div className="pkg-modal-col">
                                <div className="pkg-field">
                                    <label>Package Image</label>
                                    <div className="pkg-img-tabs">
                                        <button type="button" className={`pkg-img-tab ${imgMode === 'upload' ? 'active' : ''}`} onClick={() => setImgMode('upload')}>📁 Upload File</button>
                                        <button type="button" className={`pkg-img-tab ${imgMode === 'url' ? 'active' : ''}`} onClick={() => setImgMode('url')}>🔗 Image URL</button>
                                    </div>

                                    {imgMode === 'upload' ? (
                                        <div className="pkg-upload-zone" onClick={() => fileRef.current?.click()}>
                                            {imgPreview && form.imageData ? (
                                                <img src={imgPreview} alt="Preview" className="pkg-upload-preview" />
                                            ) : (
                                                <div className="pkg-upload-placeholder">
                                                    <span>📸</span>
                                                    <span>Click to upload photo</span>
                                                    <span className="pkg-upload-hint">JPG, PNG, WEBP</span>
                                                </div>
                                            )}
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                type="url"
                                                value={form.image}
                                                onChange={e => {
                                                    setForm(f => ({ ...f, image: e.target.value, imageData: null }));
                                                    setImgPreview(e.target.value);
                                                }}
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </>
                                    )}

                                    {imgPreview && (
                                        <div className="pkg-img-preview-box">
                                            <img src={imgPreview} alt="Preview" />
                                            {form.imageData && (
                                                <button
                                                    type="button"
                                                    className="pkg-img-remove"
                                                    onClick={() => { setForm(f => ({ ...f, imageData: null })); setImgPreview(form.image || ''); }}
                                                >
                                                    ✕ Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pkg-modal-footer">
                            <button type="button" className="adm-btn adm-btn-reset" onClick={onClose}>Cancel</button>
                            <button type="submit" className="adm-btn adm-btn-add" disabled={saving}>
                                {saving ? 'Saving...' : (editingPkg ? '💾 Save Changes' : '➕ Add Package')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
