import { createContext, useContext, useState, useEffect } from 'react';
import { testimonials as defaultTestimonials } from '../data/data';

const ReviewContext = createContext();
const STORAGE_KEY = 'sabari-reviews';

export function ReviewProvider({ children }) {
    const [reviews, setReviews] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error('Error reading reviews from localStorage:', e);
        }
        return defaultTestimonials;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }, [reviews]);

    const addReview = (reviewData) => {
        const newReview = {
            ...reviewData,
            id: Date.now().toString(),
        };
        setReviews([newReview, ...reviews]);
    };

    const updateReview = (id, updatedData) => {
        setReviews(reviews.map(r => r.id === id ? { ...r, ...updatedData } : r));
    };

    const deleteReview = (id) => {
        setReviews(reviews.filter(r => r.id !== id));
    };

    return (
        <ReviewContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
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
