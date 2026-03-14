import { createContext, useContext, useState, useEffect } from 'react';
import { testimonials as defaultTestimonials } from '../data/data';

import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
    const { token } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const addReview = async (reviewData) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });
            if (res.ok) {
                const newReview = await res.json();
                setReviews([newReview, ...reviews]);
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to add review');
            }
        } catch (err) {
            console.error('Add review error:', err);
            alert('Failed to add review');
        }
    };

    const updateReview = async (id, updatedData) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updated = await res.json();
                setReviews(reviews.map(r => r.id === parseInt(id) ? updated : r));
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to update review');
            }
        } catch (err) {
            console.error('Update review error:', err);
            alert('Failed to update review');
        }
    };

    const deleteReview = async (id) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== parseInt(id)));
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to delete review');
            }
        } catch (err) {
            console.error('Delete review error:', err);
            alert('Failed to delete review');
        }
    };

    return (
        <ReviewContext.Provider value={{ reviews, loading, addReview, updateReview, deleteReview }}>
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews() {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
}
