import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const createProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  image_url: z.string().url().optional(),
  stock_quantity: z.number().int().min(0).default(0),
})

export async function POST(request: NextRequest) {
  try {
    const sellerId = request.headers.get('x-seller-id')
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID not found' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, price, category, image_url, stock_quantity } = createProductSchema.parse(body)

    const { data, error } = await supabase.from('products').insert([
      {
        name: title,
        description,
        price,
        category,
        image_url: image_url || '',
        stock_quantity,
        is_active: true,
        seller_id: sellerId,
      }
    ]).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Create product error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sellerId = request.headers.get('x-seller-id')
    if (!sellerId) {
      return NextResponse.json(
        { error: 'Seller ID not found' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 