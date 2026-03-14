import { useState } from 'react';
import { useReviews } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import ReviewFormModal from './ReviewFormModal';

export default function TestimonialsSection() {
    const { reviews, deleteReview } = useReviews();
    const { currentUser, isAdmin } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    const handleAddClick = () => {
        setEditingReview(null);
        setModalOpen(true);
    };

    const handleEditClick = (review) => {
        setEditingReview(review);
        setModalOpen(true);
    };

    return (
        <section className="testimonials-section" id="testimonials">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 className="section-title" style={{ margin: 0 }}>What Our Travelers Say</h2>
                    {currentUser && (
                        <button onClick={handleAddClick} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            ⭐ Write a Review
                        </button>
                    )}
                </div>
                <p className="section-subtitle">
                    Don't just take our word for it — hear from thousands of happy travelers
                    who explored the world with Sabari Tours.
                </p>

                <div className="testimonials-grid">
                    {reviews.map(t => {
                        const isOwner = currentUser?.id === t.userId;
                        const canEdit = isOwner || isAdmin;

                        return (
                            <div className="testimonial-card glass-card" key={t.id} style={{ position: 'relative' }}>
                                {canEdit && (
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEditClick(t)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}
                                            title="Edit Review"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => window.confirm('Delete this review?') && deleteReview(t.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}
                                            title="Delete Review"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}

                                <div className="testimonial-stars">
                                    {Array.from({ length: t.rating }, (_, i) => (
                                        <span key={i} className="star">⭐</span>
                                    ))}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-author-avatar">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="testimonial-author-name">{t.name}</div>
                                        {t.location && <div className="testimonial-author-location">{t.location}</div>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {reviews.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            <ReviewFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                editingReview={editingReview}
            />
        </section>
    );
}
