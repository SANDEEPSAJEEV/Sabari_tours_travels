import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ── GET all packages ──────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM packages ORDER BY created_at ASC'
        );

        // Normalise column names to camelCase for the React frontend
        const packages = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            duration: row.duration,
            price: row.price,
            category: row.category,
            image: row.image || '',
            imageData: row.image_data || null,
            highlights: row.highlights || [],
            places: row.places || [],
        }));

        res.json(packages);
    } catch (err) {
        console.error('GET /api/packages error:', err);
        res.status(500).json({ error: 'Failed to fetch packages' });
    }
});

// ── POST create package ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { title, description, duration, price, category, image, imageData, highlights, places } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO packages
                (title, description, duration, price, category, image, image_data, highlights, places)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                title,
                description || '',
                duration || '',
                price || '',
                category || 'kerala',
                image || '',
                imageData || null,
                highlights || [],
                places || [],
            ]
        );

        const row = result.rows[0];
        res.status(201).json({
            id: row.id,
            title: row.title,
            description: row.description,
            duration: row.duration,
            price: row.price,
            category: row.category,
            image: row.image || '',
            imageData: row.image_data || null,
            highlights: row.highlights || [],
            places: row.places || [],
        });
    } catch (err) {
        console.error('POST /api/packages error:', err);
        res.status(500).json({ error: 'Failed to create package' });
    }
});

// ── PUT update package ────────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, duration, price, category, image, imageData, highlights, places } = req.body;

    try {
        const result = await pool.query(
            `UPDATE packages
             SET title       = $1,
                 description = $2,
                 duration    = $3,
                 price       = $4,
                 category    = $5,
                 image       = $6,
                 image_data  = $7,
                 highlights  = $8,
                 places      = $9,
                 updated_at  = NOW()
             WHERE id = $10
             RETURNING *`,
            [
                title,
                description || '',
                duration || '',
                price || '',
                category || 'kerala',
                image || '',
                imageData || null,
                highlights || [],
                places || [],
                parseInt(id),
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }

        const row = result.rows[0];
        res.json({
            id: row.id,
            title: row.title,
            description: row.description,
            duration: row.duration,
            price: row.price,
            category: row.category,
            image: row.image || '',
            imageData: row.image_data || null,
            highlights: row.highlights || [],
            places: row.places || [],
        });
    } catch (err) {
        console.error(`PUT /api/packages/${id} error:`, err);
        res.status(500).json({ error: 'Failed to update package' });
    }
});

// ── DELETE package ────────────────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM packages WHERE id = $1 RETURNING id',
            [parseInt(id)]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Package not found' });
        }

        res.json({ message: 'Package deleted successfully', id: parseInt(id) });
    } catch (err) {
        console.error(`DELETE /api/packages/${id} error:`, err);
        res.status(500).json({ error: 'Failed to delete package' });
    }
});

export default router;
