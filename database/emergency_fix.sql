-- EMERGENCY FIX - Run this in Supabase SQL Editor RIGHT NOW
-- This will fix the relationship issues immediately
-- Step 1: Drop ALL existing constraints and policies
DROP POLICY IF EXISTS "Allow all operations on sellers" ON sellers;
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_category_fkey;
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS sellers DROP CONSTRAINT IF EXISTS sellers_pkey;
ALTER TABLE IF EXISTS categories DROP CONSTRAINT IF EXISTS categories_pkey;
-- Step 2: Drop and recreate tables in correct order
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
-- Step 3: Create sellers table first
CREATE TABLE sellers (
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
-- Step 4: Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Step 5: Create products table with proper foreign keys
CREATE TABLE products (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_products_seller FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
    CONSTRAINT fk_products_category FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE
);
-- Step 6: Insert sample data
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
        'password123',
        'John Smith',
        'TechStore Pro',
        '+1234567890',
        '123 Tech Street, Silicon Valley'
    ),
    (
        'sarah@fashionhub.com',
        'password123',
        'Sarah Johnson',
        'Fashion Hub',
        '+1234567891',
        '456 Fashion Ave, New York'
    ),
    (
        'mike@bookworld.com',
        'password123',
        'Mike Wilson',
        'Book World',
        '+1234567892',
        '789 Book Lane, Seattle'
    ),
    (
        'emma@homeplus.com',
        'password123',
        'Emma Davis',
        'Home Plus',
        '+1234567893',
        '321 Home Street, Austin'
    ),
    (
        'alex@sportszone.com',
        'password123',
        'Alex Brown',
        'Sports Zone',
        '+1234567894',
        '654 Sports Blvd, Miami'
    );
INSERT INTO categories (name, description)
VALUES ('Electronics', 'Electronic devices and gadgets'),
    ('Clothing', 'Apparel and fashion items'),
    ('Books', 'Books and educational materials'),
    (
        'Home & Garden',
        'Home improvement and gardening supplies'
    ),
    ('Sports', 'Sports equipment and accessories');
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
        'Wireless Headphones',
        'Premium wireless headphones with noise cancellation',
        199.99,
        'Electronics',
        NULL,
        75,
        true,
        1
    ),
    (
        'Gaming Mouse',
        'High-precision gaming mouse with RGB lighting',
        79.99,
        'Electronics',
        NULL,
        120,
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
        'Sneakers',
        'Comfortable casual sneakers',
        89.99,
        'Clothing',
        NULL,
        80,
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
        'Design Patterns Book',
        'Essential design patterns for developers',
        49.99,
        'Books',
        NULL,
        60,
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
        'Plant Pots',
        'Decorative ceramic plant pots',
        24.99,
        'Home & Garden',
        NULL,
        45,
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
    ),
    (
        'Basketball',
        'Official size basketball',
        34.99,
        'Sports',
        NULL,
        40,
        true,
        5
    );
-- Step 7: Disable RLS for now (we'll enable it later)
ALTER TABLE sellers DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- Step 8: Test the relationships
SELECT p.id,
    p.name,
    p.price,
    p.category,
    s.name as seller_name,
    s.store_name
FROM products p
    JOIN sellers s ON p.seller_id = s.id
LIMIT 5;
-- Step 9: Force PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
-- Step 10: Verify tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('sellers', 'categories', 'products');
-- Step 11: Verify foreign keys exist
SELECT tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'products';
-- SUCCESS MESSAGE
SELECT 'Database relationships fixed successfully!' as status;