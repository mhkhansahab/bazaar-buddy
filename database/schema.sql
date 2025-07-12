-- Supabase Database Schema for Products
-- Run this SQL in your Supabase SQL editor to create the required tables

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE
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
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (since no auth)
CREATE POLICY "Allow all operations on categories" ON categories
FOR ALL USING (true);

CREATE POLICY "Allow all operations on products" ON products
FOR ALL USING (true);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and educational materials'),
('Home & Garden', 'Home improvement and gardening supplies'),
('Sports', 'Sports equipment and accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock_quantity, is_active) VALUES
('Laptop', 'High-performance laptop for work and gaming', 999.99, 'Electronics', NULL, 50, true),
('Smartphone', 'Latest model smartphone with advanced features', 699.99, 'Electronics', NULL, 100, true),
('T-Shirt', 'Comfortable cotton t-shirt in various colors', 19.99, 'Clothing', NULL, 200, true),
('Jeans', 'Classic denim jeans for everyday wear', 59.99, 'Clothing', NULL, 150, true),
('Programming Book', 'Learn modern web development techniques', 39.99, 'Books', NULL, 75, true),
('Garden Tool Set', 'Complete set of gardening tools', 89.99, 'Home & Garden', NULL, 30, true),
('Tennis Racket', 'Professional tennis racket for serious players', 129.99, 'Sports', NULL, 25, true),
('Running Shoes', 'Lightweight running shoes for athletes', 79.99, 'Sports', NULL, 80, true); 