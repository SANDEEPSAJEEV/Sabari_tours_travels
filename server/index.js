import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import packagesRouter from './routes/packages.js';
import enquiriesRouter from './routes/enquiries.js';
import settingsRouter from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
    origin: '*', // Allow Vercel or any other deployed frontend to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Allow large base64 images (up to 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/packages', packagesRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 Sabari Tours API Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Packages API: http://localhost:${PORT}/api/packages\n`);
});
