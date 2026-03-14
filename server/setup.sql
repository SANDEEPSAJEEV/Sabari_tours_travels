-- Run this script once in PostgreSQL to set up the database
-- Connect as postgres user and run: psql -U postgres -f setup.sql

-- Create the database
CREATE DATABASE sabari_tours;

-- Connect to it (\c sabari_tours in psql) then run the rest:

CREATE TABLE IF NOT EXISTS packages (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    duration    VARCHAR(100),
    price       VARCHAR(100),
    category    VARCHAR(50) DEFAULT 'kerala',
    image       TEXT,
    image_data  TEXT,
    highlights  TEXT[],
    places      TEXT[],
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Seed default packages
INSERT INTO packages (title, description, duration, price, category, image, highlights, places) VALUES
(
    'Munnar Hill Station Retreat',
    'Explore the lush tea gardens, misty mountains, and serene waterfalls of Munnar.',
    '3 Days / 2 Nights', '₹8,999', 'kerala',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    ARRAY['Tea Garden Visit', 'Eravikulam National Park', 'Mattupetty Dam', 'Echo Point'],
    ARRAY['Munnar', 'Eravikulam', 'Mattupetty']
),
(
    'Alleppey Houseboat Experience',
    'Cruise through the tranquil backwaters of Alleppey on a traditional Kerala houseboat.',
    '2 Days / 1 Night', '₹6,499', 'kerala',
    'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80',
    ARRAY['Houseboat Stay', 'Backwater Cruise', 'Kerala Cuisine', 'Sunset Views'],
    ARRAY['Alleppey', 'Kumarakom']
),
(
    'Wayanad Adventure Tour',
    'Discover the wild beauty of Wayanad with trekking, wildlife safaris, and ancient cave explorations.',
    '4 Days / 3 Nights', '₹12,999', 'kerala',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    ARRAY['Edakkal Caves', 'Banasura Dam', 'Wildlife Safari', 'Trekking'],
    ARRAY['Wayanad', 'Edakkal', 'Banasura']
),
(
    'Sabarimala Pilgrimage Package',
    'A devotional pilgrimage to Lord Ayyappa''s abode at Sabarimala.',
    '3 Days / 2 Nights', '₹5,999', 'pilgrim',
    'https://images.unsplash.com/photo-1621427642549-48b3ae5b1cc0?w=800&q=80',
    ARRAY['Sabarimala Temple', 'Pamba River', 'Guided Tour', 'Comfortable Stay'],
    ARRAY['Sabarimala', 'Pamba', 'Erumeli']
),
(
    'Goa Beach Holiday',
    'Sun, sand, and sea! Enjoy the vibrant beaches of Goa with water sports and nightlife.',
    '5 Days / 4 Nights', '₹14,999', 'outside',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    ARRAY['Beach Hopping', 'Water Sports', 'Old Goa Churches', 'Cruise Party'],
    ARRAY['Calangute', 'Baga', 'Anjuna', 'Old Goa']
);

-- ── Enquiries Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    subject         VARCHAR(255),
    message         TEXT,
    package_name    VARCHAR(255),
    source          VARCHAR(50), -- e.g., 'Registration', 'Contact Form', 'WhatsApp'
    created_at      TIMESTAMP DEFAULT NOW()
);

RAISE NOTICE 'Database setup complete! 5 default packages and enquiries table created.';
