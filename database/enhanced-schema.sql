-- Enhanced Supabase Database Schema for Products with NLP Search Support
-- Run this SQL in your Supabase SQL editor to create the enhanced tables
-- Create enhanced categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_category VARCHAR(255),
    keywords TEXT [],
    -- Array of keywords for better search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Create enhanced products table with more searchable attributes
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255),
    -- For more specific categorization
    brand VARCHAR(255),
    -- Brand name for filtering
    model VARCHAR(255),
    -- Model number/name
    color VARCHAR(100),
    -- Color of the product
    size VARCHAR(50),
    -- Size (S, M, L, XL, etc.)
    material VARCHAR(100),
    -- Material (cotton, leather, etc.)
    weight DECIMAL(8, 2),
    -- Weight in grams/pounds
    dimensions VARCHAR(100),
    -- Dimensions (LxWxH)
    power_rating VARCHAR(50),
    -- For electronics (watts, voltage, etc.)
    capacity VARCHAR(50),
    -- For storage devices (GB, TB, etc.)
    compatibility TEXT [],
    -- Array of compatible devices/systems
    features TEXT [],
    -- Array of product features
    tags TEXT [],
    -- Array of search tags
    image_url TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE
);
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc'::text, NOW());
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE
UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE
UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Enable Row Level Security (optional)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Create policies to allow all operations for now (since no auth)
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
-- Insert enhanced sample categories with keywords
INSERT INTO categories (name, description, keywords)
VALUES (
        'Electronics',
        'Electronic devices and gadgets',
        ARRAY ['electronics', 'gadgets', 'devices', 'tech', 'technology']
    ),
    (
        'Clothing',
        'Apparel and fashion items',
        ARRAY ['clothing', 'apparel', 'fashion', 'wear', 'dress']
    ),
    (
        'Books',
        'Books and educational materials',
        ARRAY ['books', 'reading', 'education', 'learning', 'literature']
    ),
    (
        'Home & Garden',
        'Home improvement and gardening supplies',
        ARRAY ['home', 'garden', 'household', 'tools', 'improvement']
    ),
    (
        'Sports',
        'Sports equipment and accessories',
        ARRAY ['sports', 'fitness', 'exercise', 'athletic', 'training']
    ),
    (
        'Automotive',
        'Car parts and accessories',
        ARRAY ['automotive', 'car', 'vehicle', 'auto', 'parts']
    ),
    (
        'Beauty & Health',
        'Beauty products and health items',
        ARRAY ['beauty', 'health', 'cosmetics', 'personal care', 'wellness']
    ) ON CONFLICT (name) DO NOTHING;
-- Insert enhanced sample products with more attributes
INSERT INTO products (
        name,
        description,
        price,
        category,
        subcategory,
        brand,
        model,
        color,
        size,
        material,
        power_rating,
        capacity,
        features,
        tags,
        image_url,
        stock_quantity,
        is_active
    )
VALUES -- Electronics
    (
        'iPhone 15 Pro',
        'Latest iPhone with advanced camera system',
        999.99,
        'Electronics',
        'Smartphones',
        'Apple',
        'iPhone 15 Pro',
        'Titanium',
        'Standard',
        'Metal',
        'USB-C',
        '256GB',
        ARRAY ['5G', 'Face ID', 'Pro Camera'],
        ARRAY ['smartphone', 'iphone', 'apple', 'mobile'],
        NULL,
        50,
        true
    ),
    (
        'MacBook Air M2',
        'Ultra-thin laptop with M2 chip',
        1199.99,
        'Electronics',
        'Laptops',
        'Apple',
        'MacBook Air M2',
        'Space Gray',
        '13-inch',
        'Aluminum',
        '30W',
        '512GB',
        ARRAY ['M2 Chip', 'Retina Display', 'Touch ID'],
        ARRAY ['laptop', 'macbook', 'apple', 'computer'],
        NULL,
        30,
        true
    ),
    (
        'Samsung Galaxy S24',
        'Android flagship smartphone',
        899.99,
        'Electronics',
        'Smartphones',
        'Samsung',
        'Galaxy S24',
        'Black',
        'Standard',
        'Glass',
        'USB-C',
        '128GB',
        ARRAY ['5G', 'Fingerprint', 'AI Camera'],
        ARRAY ['smartphone', 'samsung', 'android', 'mobile'],
        NULL,
        75,
        true
    ),
    (
        'USB-C Charger',
        'Fast charging USB-C power adapter',
        29.99,
        'Electronics',
        'Accessories',
        'Anker',
        'PowerPort',
        'White',
        'Standard',
        'Plastic',
        '65W',
        'N/A',
        ARRAY ['Fast Charging', 'USB-C', 'Compact'],
        ARRAY ['charger', 'usb-c', 'power', 'adapter'],
        NULL,
        200,
        true
    ),
    (
        'Wireless Earbuds',
        'Bluetooth wireless earbuds with noise cancellation',
        159.99,
        'Electronics',
        'Audio',
        'Sony',
        'WF-1000XM4',
        'Black',
        'Standard',
        'Plastic',
        'N/A',
        'N/A',
        ARRAY ['Noise Cancellation', 'Bluetooth 5.0', 'Touch Controls'],
        ARRAY ['earbuds', 'wireless', 'bluetooth', 'audio'],
        NULL,
        100,
        true
    ),
    -- Clothing
    (
        'Nike Air Max 270',
        'Comfortable running shoes with Air Max technology',
        129.99,
        'Sports',
        'Footwear',
        'Nike',
        'Air Max 270',
        'White/Red',
        '10',
        'Mesh',
        'N/A',
        'N/A',
        ARRAY ['Air Max', 'Cushioning', 'Breathable'],
        ARRAY ['shoes', 'nike', 'running', 'sneakers'],
        NULL,
        80,
        true
    ),
    (
        'Cotton T-Shirt',
        'Comfortable cotton t-shirt in various colors',
        19.99,
        'Clothing',
        'Tops',
        'Generic',
        'Basic Tee',
        'Black',
        'L',
        'Cotton',
        'N/A',
        'N/A',
        ARRAY ['Cotton', 'Comfortable', 'Versatile'],
        ARRAY ['t-shirt', 'cotton', 'casual', 'clothing'],
        NULL,
        200,
        true
    ),
    (
        'Leather Jacket',
        'Classic leather jacket for style and protection',
        299.99,
        'Clothing',
        'Outerwear',
        'Schott',
        'Perfecto',
        'Brown',
        'M',
        'Leather',
        'N/A',
        'N/A',
        ARRAY ['Genuine Leather', 'Classic Style', 'Durable'],
        ARRAY ['jacket', 'leather', 'outerwear', 'style'],
        NULL,
        25,
        true
    ),
    -- Home & Garden
    (
        'Garden Tool Set',
        'Complete set of gardening tools',
        89.99,
        'Home & Garden',
        'Tools',
        'Fiskars',
        'Garden Set',
        'Green',
        'Standard',
        'Steel',
        'N/A',
        'N/A',
        ARRAY ['Complete Set', 'Durable', 'Ergonomic'],
        ARRAY ['garden', 'tools', 'gardening', 'outdoor'],
        NULL,
        30,
        true
    ),
    (
        'LED Desk Lamp',
        'Adjustable LED desk lamp with USB charging',
        49.99,
        'Home & Garden',
        'Lighting',
        'Philips',
        'Desk Lamp',
        'White',
        'Standard',
        'Metal',
        '10W',
        'N/A',
        ARRAY ['LED', 'Adjustable', 'USB Charging'],
        ARRAY ['lamp', 'led', 'desk', 'lighting'],
        NULL,
        60,
        true
    ),
    -- Sports
    (
        'Tennis Racket',
        'Professional tennis racket for serious players',
        129.99,
        'Sports',
        'Tennis',
        'Wilson',
        'Pro Staff',
        'Black',
        'Standard',
        'Graphite',
        'N/A',
        'N/A',
        ARRAY ['Professional', 'Graphite Frame', 'Pre-strung'],
        ARRAY ['tennis', 'racket', 'sports', 'wilson'],
        NULL,
        25,
        true
    ),
    (
        'Yoga Mat',
        'Non-slip yoga mat for home workouts',
        39.99,
        'Sports',
        'Fitness',
        'Lululemon',
        'Reversible Mat',
        'Purple',
        'Standard',
        'PVC',
        'N/A',
        'N/A',
        ARRAY ['Non-slip', 'Reversible', 'Lightweight'],
        ARRAY ['yoga', 'mat', 'fitness', 'workout'],
        NULL,
        150,
        true
    ),
    -- Automotive
    (
        'Car Phone Mount',
        'Universal car phone holder for dashboard',
        24.99,
        'Automotive',
        'Accessories',
        'iOttie',
        'Easy One Touch',
        'Black',
        'Standard',
        'Plastic',
        'N/A',
        'N/A',
        ARRAY ['Universal', 'Easy Mount', 'Secure'],
        ARRAY ['car', 'phone', 'mount', 'holder'],
        NULL,
        120,
        true
    ),
    (
        'Dash Cam',
        'HD dashboard camera for vehicle recording',
        89.99,
        'Automotive',
        'Electronics',
        'Garmin',
        'Dash Cam 56',
        'Black',
        'Standard',
        'Plastic',
        'USB',
        '32GB',
        ARRAY ['HD Recording', 'GPS', 'WiFi'],
        ARRAY ['dash', 'cam', 'camera', 'recording'],
        NULL,
        45,
        true
    ) ON CONFLICT (id) DO NOTHING;
-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_products_features ON products USING gin(features);