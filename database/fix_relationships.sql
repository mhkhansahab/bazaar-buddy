-- Fix Database Relationships - Run this in Supabase SQL Editor
-- This script will ensure all tables and relationships are properly set up
-- First, let's check if tables exist and drop constraints if they exist
-- (This is safe because we'll recreate them)
-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_category_fkey;
-- Ensure sellers table exists with correct structure
CREATE TABLE IF NOT EXISTS sellers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Ensure categories table exists with correct structure
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Ensure products table exists with correct structure
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category VARCHAR(255) NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    seller_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Insert sample data if not exists
INSERT INTO sellers (
        email,
        password,
        name,
        store_name,
        phone,
        address
    )
VALUES (
        'john@techstore.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6',
        'John Smith',
        'TechStore Pro',
        '+1234567890',
        '123 Tech Street, Silicon Valley'
    ),
    (
        'sarah@fashionhub.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6',
        'Sarah Johnson',
        'Fashion Hub',
        '+1234567891',
        '456 Fashion Ave, New York'
    ),
    (
        'mike@bookworld.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6',
        'Mike Wilson',
        'Book World',
        '+1234567892',
        '789 Book Lane, Seattle'
    ),
    (
        'emma@homeplus.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6',
        'Emma Davis',
        'Home Plus',
        '+1234567893',
        '321 Home Street, Austin'
    ),
    (
        'alex@sportszone.com',
        '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6',
        'Alex Brown',
        'Sports Zone',
        '+1234567894',
        '654 Sports Blvd, Miami'
    ) ON CONFLICT (email) DO NOTHING;
INSERT INTO categories (name, description)
VALUES ('Electronics', 'Electronic devices and gadgets'),
    ('Clothing', 'Apparel and fashion items'),
    ('Books', 'Books and educational materials'),
    (
        'Home & Garden',
        'Home improvement and gardening supplies'
    ),
    ('Sports', 'Sports equipment and accessories') ON CONFLICT (name) DO NOTHING;
-- Clean up any invalid data first
-- Remove products with invalid seller_id
DELETE FROM products
WHERE seller_id NOT IN (
        SELECT id
        FROM sellers
    );
-- Remove products with invalid category
DELETE FROM products
WHERE category NOT IN (
        SELECT name
        FROM categories
    );
-- Now add the foreign key constraints
ALTER TABLE products
ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;
ALTER TABLE products
ADD CONSTRAINT products_category_fkey FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE;
-- Insert sample products
INSERT INTO products (
        name,
        description,
        price,
        category,
        image_url,
        stock_quantity,
        is_active,
        seller_id
    )
VALUES (
        'Laptop',
        'High-performance laptop for work and gaming',
        999.99,
        'Electronics',
        NULL,
        50,
        true,
        1
    ),
    (
        'Smartphone',
        'Latest model smartphone with advanced features',
        699.99,
        'Electronics',
        NULL,
        100,
        true,
        1
    ),
    (
        'T-Shirt',
        'Comfortable cotton t-shirt in various colors',
        19.99,
        'Clothing',
        NULL,
        200,
        true,
        2
    ),
    (
        'Jeans',
        'Classic denim jeans for everyday wear',
        59.99,
        'Clothing',
        NULL,
        150,
        true,
        2
    ),
    (
        'Programming Book',
        'Learn modern web development techniques',
        39.99,
        'Books',
        NULL,
        75,
        true,
        3
    ),
    (
        'Garden Tool Set',
        'Complete set of gardening tools',
        89.99,
        'Home & Garden',
        NULL,
        30,
        true,
        4
    ),
    (
        'Tennis Racket',
        'Professional tennis racket for serious players',
        129.99,
        'Sports',
        NULL,
        25,
        true,
        5
    ),
    (
        'Running Shoes',
        'Lightweight running shoes for athletes',
        79.99,
        'Sports',
        NULL,
        80,
        true,
        5
    ) ON CONFLICT (id) DO NOTHING;
-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::text, NOW());
RETURN NEW;
END;
$$ language 'plpgsql';
-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_sellers_updated_at ON sellers;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
-- Create triggers for updated_at
CREATE TRIGGER update_sellers_updated_at BEFORE
UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE
UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable Row Level Security
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on sellers" ON sellers;
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
-- Create policies to allow all operations for now
CREATE POLICY "Allow all operations on sellers" ON sellers FOR ALL USING (true);
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
-- Verify the relationships are working
SELECT tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('products');
-- Test the relationships with a simple join
SELECT p.id,
    p.name,
    p.price,
    p.category,
    s.name as seller_name,
    s.store_name
FROM products p
    JOIN sellers s ON p.seller_id = s.id
LIMIT 5;
-- Refresh the schema cache (this might help with Supabase)
SELECT pg_notify('pgrst', 'reload schema');