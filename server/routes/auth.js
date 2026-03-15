import { Router } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ error: 'Name, email, phone number, and password are required' });
    }

    try {
        // Check if email already exists
        const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkResult.rows.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Insert new user
        const result = await db.query(
            'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role',
            [name, email, phone, password]
        );

        const newUser = result.rows[0];

        // Return without password for security
        res.status(201).json({ success: true, user: newUser });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Query user by email and password (in a real app, do not store plain text passwords)
        const result = await db.query('SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2', [email, password]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Failed to process login' });
    }
});

export default router;
