-- Supabase Database Schema for Products
-- Run this SQL in your Supabase SQL editor to create the required tables

-- Create sellers table
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

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(255) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  seller_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional)
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (since no auth)
CREATE POLICY "Allow all operations on sellers" ON sellers
FOR ALL USING (true);

CREATE POLICY "Allow all operations on categories" ON categories
FOR ALL USING (true);

CREATE POLICY "Allow all operations on products" ON products
FOR ALL USING (true);

-- Insert sample sellers
INSERT INTO sellers (email, password, name, store_name, phone, address) VALUES
('john@techstore.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6', 'John Smith', 'TechStore Pro', '+1234567890', '123 Tech Street, Silicon Valley'),
('sarah@fashionhub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6', 'Sarah Johnson', 'Fashion Hub', '+1234567891', '456 Fashion Ave, New York'),
('mike@bookworld.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6', 'Mike Wilson', 'Book World', '+1234567892', '789 Book Lane, Seattle'),
('emma@homeplus.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6', 'Emma Davis', 'Home Plus', '+1234567893', '321 Home Street, Austin'),
('alex@sportszone.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDXO1VYmcWDhKa6', 'Alex Brown', 'Sports Zone', '+1234567894', '654 Sports Blvd, Miami')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and educational materials'),
('Home & Garden', 'Home improvement and gardening supplies'),
('Sports', 'Sports equipment and accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products (will be updated with seller_id later)
INSERT INTO products (name, description, price, category, image_url, stock_quantity, is_active, seller_id) VALUES
('Laptop', 'High-performance laptop for work and gaming', 999.99, 'Electronics', NULL, 50, true, 1),
('Smartphone', 'Latest model smartphone with advanced features', 699.99, 'Electronics', NULL, 100, true, 1),
('T-Shirt', 'Comfortable cotton t-shirt in various colors', 19.99, 'Clothing', NULL, 200, true, 2),
('Jeans', 'Classic denim jeans for everyday wear', 59.99, 'Clothing', NULL, 150, true, 2),
('Programming Book', 'Learn modern web development techniques', 39.99, 'Books', NULL, 75, true, 3),
('Garden Tool Set', 'Complete set of gardening tools', 89.99, 'Home & Garden', NULL, 30, true, 4),
('Tennis Racket', 'Professional tennis racket for serious players', 129.99, 'Sports', NULL, 25, true, 5),
('Running Shoes', 'Lightweight running shoes for athletes', 79.99, 'Sports', NULL, 80, true, 5);

-- SQL to update existing products with random seller IDs (run this if you have existing products without seller_id)
-- This will randomly assign seller IDs from the available sellers
UPDATE products 
SET seller_id = (
  SELECT id 
  FROM sellers 
  ORDER BY RANDOM() 
  LIMIT 1
) 
WHERE seller_id IS NULL; 