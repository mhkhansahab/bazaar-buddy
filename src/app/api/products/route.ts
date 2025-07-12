import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { CreateProductData, TableNames } from '@/lib/types/database'

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('active')
    
    let query = supabase.from(TableNames.PRODUCTS).select('*')
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category)
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }
    
    // Order by created_at descending
    query = query.order('created_at', { ascending: false })
    
    const { data: products, error } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      data: products,
      message: 'Products fetched successfully' 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductData = await request.json()
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category' },
        { status: 400 }
      )
    }
    
    // Validate price is positive
    if (body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }
    
    // Validate stock quantity is non-negative
    if (body.stock_quantity && body.stock_quantity < 0) {
      return NextResponse.json(
        { error: 'Stock quantity cannot be negative' },
        { status: 400 }
      )
    }
    
    const { data: product, error } = await supabase
      .from(TableNames.PRODUCTS)
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        image_url: body.image_url,
        stock_quantity: body.stock_quantity || 0,
        is_active: body.is_active ?? true
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        data: product,
        message: 'Product created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 