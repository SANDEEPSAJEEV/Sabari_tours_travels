import express from 'express';
import pool from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const router = express.Router();

// ── Helper: Save Base64 Image to Disk ─────────────────────────────────────────
function saveImageLocally(base64Data, title) {
    if (!base64Data || !base64Data.startsWith('data:image/')) return null;

    try {
        const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return null;

        let extension = matches[1];
        if (extension === 'jpeg') extension = 'jpg';

        // Create slug from title
        const slug = (title || 'package').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const filename = `${slug}-${Date.now()}.${extension}`;
        const filepath = path.join(UPLOADS_DIR, filename);

        // Ensure directory exists
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }

        const buffer = Buffer.from(matches[2], 'base64');
        fs.writeFileSync(filepath, buffer);

        // Return the public URL path
        return `/uploads/${filename}`;
    } catch (err) {
        console.error('Error saving image locally:', err);
        return null;
    }
}

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

// ── GET all distinct categories ───────────────────────────────────────────────
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT DISTINCT category FROM packages WHERE category IS NOT NULL ORDER BY category ASC'
        );
        const categories = result.rows.map(row => row.category);
        res.json(categories);
    } catch (err) {
        console.error('GET /api/packages/categories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// ── POST create package ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    let { title, description, duration, price, category, image, imageData, highlights, places } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // Attempt to save uploaded base64 image locally
    if (imageData && imageData.startsWith('data:image/')) {
        const localPath = saveImageLocally(imageData, title);
        if (localPath) {
            image = localPath;
            imageData = null; // discard massive base64 string from DB
        }
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
    let { title, description, duration, price, category, image, imageData, highlights, places } = req.body;

    // Attempt to save uploaded base64 image locally
    if (imageData && imageData.startsWith('data:image/')) {
        const localPath = saveImageLocally(imageData, title);
        if (localPath) {
            image = localPath;
            imageData = null; // discard massive base64 string from DB
        }
    }

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
