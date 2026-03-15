import { Router } from 'express';
const router = Router();
import db from '../db.js';

// GET all settings as an object { key: value }
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT key, value FROM settings');
        const settings = {};
        result.rows.forEach(row => { settings[row.key] = row.value; });
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT update one or many settings { key: value, key2: value2 }
router.put('/', async (req, res) => {
    const updates = req.body;
    console.log('--- Incoming Settings Update ---');
    console.log(updates);

    if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ error: 'Invalid settings data' });
    }
    try {
        const promises = Object.entries(updates).map(([key, value]) =>
            db.query(
                `INSERT INTO settings (key, value) VALUES ($1, $2)
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
                [key, value]
            )
        );
        await Promise.all(promises);

        // Return updated settings
        const result = await db.query('SELECT key, value FROM settings');
        const settings = {};
        result.rows.forEach(row => { settings[row.key] = row.value; });
        console.log('Updated DB settings:', settings);
        res.json(settings);
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
