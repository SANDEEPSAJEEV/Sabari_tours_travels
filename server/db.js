import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'sabari_tours',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    ssl: process.env.NODE_ENV === 'production' || process.env.DB_HOST?.includes('render.com')
        ? { rejectUnauthorized: false }
        : false
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL connection failed:', err.message);
        console.error('   Check your .env file credentials and make sure PostgreSQL is running.');
    } else {
        console.log('✅ Connected to PostgreSQL database:', process.env.DB_NAME || 'sabari_tours');
        release();
    }
});

export default pool;
