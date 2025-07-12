import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  storeName: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, storeName, phone, address } = registerSchema.parse(body)

    // Check if seller already exists
    const existingSeller = await prisma.seller.findUnique({
      where: { email }
    })

    if (existingSeller) {
      return NextResponse.json(
        { error: 'Seller with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create seller
    const seller = await prisma.seller.create({
      data: {
        email,
        password: hashedPassword,
        name,
        storeName,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        name: true,
        storeName: true,
        phone: true,
        address: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      message: 'Seller registered successfully',
      seller
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    
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