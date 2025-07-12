import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { compare } from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find seller by email
    const { data: seller, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !seller) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    const isValid = await compare(password, seller.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // You can generate a JWT here if needed, or just return the seller info
    return NextResponse.json({
      message: 'Login successful',
      seller: {
        id: seller.id,
        email: seller.email,
        name: seller.name,
        storeName: seller.store_name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.stack || error.message : error },
      { status: 500 }
    );
  }
} 