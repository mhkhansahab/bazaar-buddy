// Database table types
// Update these types based on your actual database schema

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  category: string
  image_url?: string
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

// Generic database response types
export interface DatabaseResponse<T> {
  data: T | T[] | null
  error: Error | null
}

// API Response types for frontend
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Product creation/update types
export interface CreateProductData {
  name: string
  description?: string
  price: number
  category: string
  image_url?: string
  stock_quantity: number
  is_active?: boolean
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  category?: string
  image_url?: string
  stock_quantity?: number
  is_active?: boolean
}

// Table names enum for type safety
export enum TableNames {
  PRODUCTS = 'products',
  CATEGORIES = 'categories'
} 