import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().min(0).default(0),
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
    const { title, description, price, category, images, stock } = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        images: JSON.stringify(images || []),
        stock,
        sellerId,
      },
      include: {
        seller: {
          select: {
            name: true,
            storeName: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Product created successfully',
      product
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const where: any = { sellerId }
    
    if (category) {
      where.category = category
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            name: true,
            storeName: true,
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 