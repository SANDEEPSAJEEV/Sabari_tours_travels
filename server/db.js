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

// Test connection on startup and initialize schema
pool.connect(async (err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL connection failed:', err.message);
        console.error('   Check your .env file credentials and make sure PostgreSQL is running.');
    } else {
        console.log('✅ Connected to PostgreSQL database:', process.env.DB_NAME || 'sabari_tours');

        // Ensure the reviews table exists on the production database
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS reviews (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(100) NOT NULL,
                    location VARCHAR(100),
                    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                    text TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Ensure settings table exists
            await client.query(`
                CREATE TABLE IF NOT EXISTS settings (
                    key VARCHAR(255) PRIMARY KEY,
                    value TEXT
                );
            `);

            // Insert default settings if they don't exist
            await client.query(`
                INSERT INTO settings (key, value) VALUES
                ('whatsapp_number', '919876543210'),
                ('phone_display', '+91 98765 43210'),
                ('email', 'info@sabaritours.com'),
                ('address', 'Sabari Tours and Travels, Near Railway Station, Aluva, Kerala'),
                ('wa_message', 'Hi Sabari Tours! 👋 I''m interested in your tour packages. Can you help me plan a trip?')
                ON CONFLICT (key) DO NOTHING;
            `);

            console.log('✅ Production Database tables verified/created successfully.');
        } catch (tableErr) {
            console.error('❌ Error creating tables:', tableErr.message);
        } finally {
            release();
        }
    }
});

export default pool;
