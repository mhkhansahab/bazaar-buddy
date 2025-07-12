import { NextRequest, NextResponse } from 'next/server'
import { generateContentFromImage, generateImageFromText, generateProductDescription } from '@/lib/ai'
import { z } from 'zod'

const generateFromImageSchema = z.object({
  imageUrl: z.string().url(),
})

const generateFromTextSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
})

const enhanceDescriptionSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    switch (type) {
      case 'from-image':
        const { imageUrl } = generateFromImageSchema.parse(data)
        const content = await generateContentFromImage(imageUrl)
        
        return NextResponse.json({
          message: 'Content generated successfully',
          content
        })

      case 'generate-image':
        const { title: imgTitle, description: imgDesc } = generateFromTextSchema.parse(data)
        const image = await generateImageFromText(imgTitle, imgDesc)
        
        return NextResponse.json({
          message: 'Image generated successfully',
          image
        })

      case 'enhance-description':
        const { title: descTitle, category } = enhanceDescriptionSchema.parse(data)
        const enhancedDescription = await generateProductDescription(descTitle, category)
        
        return NextResponse.json({
          message: 'Description enhanced successfully',
          description: enhancedDescription
        })

      default:
        return NextResponse.json(
          { error: 'Invalid generation type. Use: from-image, generate-image, or enhance-description' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('AI generation error:', error)
    
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