import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ── GET all reviews ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, user_id AS "userId", name, location, rating, text, created_at FROM reviews ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/reviews error:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// ── POST create review ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { location, rating, text, userId, name, role } = req.body;

    // SECURITY: Admins cannot write reviews. User must be a standard user.
    if (role === 'admin') {
        return res.status(403).json({ error: 'Admins cannot write testimonials.' });
    }

    if (!userId || !name) {
        return res.status(401).json({ error: 'You must be logged in to write a review.' });
    }

    if (!rating || !text) {
        return res.status(400).json({ error: 'Rating and text are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO reviews (user_id, name, location, rating, text)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_id AS "userId", name, location, rating, text, created_at`,
            [userId, name, location || null, rating, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/reviews error:', err);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// ── PUT update review ─────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { rating, text, userId } = req.body;

    try {
        // Step 1: Find the review
        const checkResult = await pool.query('SELECT user_id FROM reviews WHERE id = $1', [parseInt(id)]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const review = checkResult.rows[0];

        // SECURITY: ONLY the user who wrote the review can edit it.
        // Even Admins are blocked from editing someone else's review.
        if (review.user_id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to edit this review.' });
        }

        // Step 2: Update the review
        const updateResult = await pool.query(
            `UPDATE reviews 
             SET rating = COALESCE($1, rating), 
                 text = COALESCE($2, text)
             WHERE id = $3
             RETURNING id, user_id AS "userId", name, location, rating, text, created_at`,
            [rating, text, parseInt(id)]
        );

        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error(`PUT /api/reviews/${id} error:`, err);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// ── DELETE review ─────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    // We expect userId and role in headers or query, since DELETE bodies are non-standard.
    // Let's use custom headers for this simple auth model
    const userId = parseInt(req.headers['x-user-id']);
    const role = req.headers['x-user-role'];

    try {
        // Step 1: Find the review
        const checkResult = await pool.query('SELECT user_id FROM reviews WHERE id = $1', [parseInt(id)]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const review = checkResult.rows[0];

        // SECURITY: Only the author OR an Admin can delete a review.
        const isOwner = review.user_id === userId;
        const isAdmin = role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'You do not have permission to delete this review.' });
        }

        // Step 2: Delete it
        await pool.query('DELETE FROM reviews WHERE id = $1', [parseInt(id)]);
        res.json({ message: 'Review deleted successfully', id: parseInt(id) });
    } catch (err) {
        console.error(`DELETE /api/reviews/${id} error:`, err);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

export default router;
