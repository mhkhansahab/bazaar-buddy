import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { UpdateProductData, TableNames } from '@/lib/types/database'

// GET /api/products/[id] - Get a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    const { data: product, error } = await supabase
      .from(TableNames.PRODUCTS)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: product,
      message: 'Product fetched successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a specific product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    const body: UpdateProductData = await request.json()
    
    // Validate price if provided
    if (body.price !== undefined && body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }
    
    // Validate stock quantity if provided
    if (body.stock_quantity !== undefined && body.stock_quantity < 0) {
      return NextResponse.json(
        { error: 'Stock quantity cannot be negative' },
        { status: 400 }
      )
    }
    
    const { data: product, error } = await supabase
      .from(TableNames.PRODUCTS)
      .update(body)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      data: product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a specific product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from(TableNames.PRODUCTS)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 