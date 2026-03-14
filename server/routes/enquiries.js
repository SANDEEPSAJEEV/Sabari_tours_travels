import express from 'express';
import pool from '../db.js';

const router = express.Router();

// ── GET all enquiries (Admin only - with filtering) ──────────────────────────
router.get('/', async (req, res) => {
    const { year, month, day } = req.query;

    try {
        let query = 'SELECT * FROM enquiries';
        const params = [];
        const conditions = [];

        if (year) {
            conditions.push(`EXTRACT(YEAR FROM created_at) = $${params.length + 1}`);
            params.push(parseInt(year));
        }
        if (month) {
            conditions.push(`EXTRACT(MONTH FROM created_at) = $${params.length + 1}`);
            params.push(parseInt(month));
        }
        if (day) {
            conditions.push(`EXTRACT(DAY FROM created_at) = $${params.length + 1}`);
            params.push(parseInt(day));
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/enquiries error:', err);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

// ── POST create enquiry (Public) ─────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { name, email, phone, subject, message, package_name, source } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO enquiries
                (name, email, phone, subject, message, package_name, source)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                name,
                email,
                phone || null,
                subject || null,
                message || null,
                package_name || null,
                source || 'Contact Form'
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('POST /api/enquiries error:', err);
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
});

// ── DELETE enquiry (Admin only) ──────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM enquiries WHERE id = $1 RETURNING id',
            [parseInt(id)]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }

        res.json({ message: 'Enquiry deleted successfully', id: parseInt(id) });
    } catch (err) {
        console.error(`DELETE /api/enquiries/${id} error:`, err);
        res.status(500).json({ error: 'Failed to delete enquiry' });
    }
});

export default router;
