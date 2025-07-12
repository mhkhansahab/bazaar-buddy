import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { TableNames } from '@/lib/types/database'

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from(TableNames.CATEGORIES)
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      data: categories,
      message: 'Categories fetched successfully' 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 