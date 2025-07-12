import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { hash } from 'bcryptjs'
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
  let body = null;
  try {
    body = await request.json()
    const { email, password, name, storeName, phone, address } = registerSchema.parse(body)

    // Check if seller already exists
    const { data: existing, error: findError } = await supabase
      .from('sellers')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Seller with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create seller
    const { data, error } = await supabase.from('sellers').insert([
      {
        email,
        password: hashedPassword,
        name,
        store_name: storeName,
        phone,
        address,
      }
    ]).select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Supabase insert error', details: error.message, supabaseError: error, requestBody: body },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Seller registered successfully',
      seller: data[0]
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error, 'Request body:', body)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors, requestBody: body },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.stack || error.message : error, requestBody: body },
      { status: 500 }
    )
  }
} 