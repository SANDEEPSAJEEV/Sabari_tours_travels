import { useState, useEffect } from 'react';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
    text: '',
    rating: 5,
    location: ''
};

export default function ReviewFormModal({ isOpen, onClose, editingReview }) {
    const { addReview, updateReview } = useReviews();
    const { currentUser } = useAuth();
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (editingReview) {
            setForm({
                text: editingReview.text || '',
                rating: editingReview.rating || 5,
                location: editingReview.location || ''
            });
        } else {
            setForm(emptyForm);
        }
    }, [editingReview, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const reviewData = {
            ...form,
            name: editingReview ? editingReview.name : (currentUser?.name || 'Anonymous User'),
            userId: editingReview ? editingReview.userId : currentUser?.id,
        };

        if (editingReview) {
            updateReview(editingReview.id, reviewData);
        } else {
            addReview(reviewData);
        }

        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <button className="modal-close" onClick={onClose}>×</button>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div className="navbar-logo-icon" style={{ margin: '0 auto 16px' }}>⭐</div>
                    <h3>{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Share your experience traveling with Sabari Tours.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="rev-rating">Rating</label>
                        <select
                            id="rev-rating"
                            value={form.rating}
                            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        >
                            <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                            <option value="4">⭐⭐⭐⭐ (Good)</option>
                            <option value="3">⭐⭐⭐ (Average)</option>
                            <option value="2">⭐⭐ (Poor)</option>
                            <option value="1">⭐ (Terrible)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="rev-location">Location (optional)</label>
                        <input
                            id="rev-location"
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            placeholder="e.g., Kochi, Kerala"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rev-text">Your Review *</label>
                        <textarea
                            id="rev-text"
                            value={form.text}
                            onChange={(e) => setForm({ ...form, text: e.target.value })}
                            placeholder="Tell us about your trip details, the package selected, and the service you received."
                            required
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                        {editingReview ? '💾 Update Review' : '🚀 Submit Review'}
                    </button>
                </form>
            </div>
        </div>
    );
}
