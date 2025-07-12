import OpenAI from 'openai'
import Replicate from 'replicate'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export interface GeneratedContent {
  title: string
  description: string
  category: string
  tags: string[]
}

export interface GeneratedImage {
  url: string
  prompt: string
}

// Generate product content based on image
export async function generateContentFromImage(imageUrl: string): Promise<GeneratedContent> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this product image and generate a compelling product listing. Return a JSON object with: title (catchy product name), description (detailed product description), category (product category), and tags (array of relevant tags). Make it engaging and sales-focused."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated')
    }

    // Parse JSON response
    const parsed = JSON.parse(content)
    return {
      title: parsed.title || 'Product Title',
      description: parsed.description || 'Product Description',
      category: parsed.category || 'General',
      tags: parsed.tags || []
    }
  } catch (error) {
    console.error('Error generating content from image:', error)
    return {
      title: 'Product Title',
      description: 'Product Description',
      category: 'General',
      tags: []
    }
  }
}

// Generate image based on title and description
export async function generateImageFromText(title: string, description: string): Promise<GeneratedImage> {
  try {
    const prompt = `Create a professional product image for: ${title}. ${description}. High quality, clean background, product-focused photography style.`

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        }
      }
    ) as string[]

    return {
      url: output[0] || '',
      prompt: prompt
    }
  } catch (error) {
    console.error('Error generating image from text:', error)
    return {
      url: '',
      prompt: ''
    }
  }
}

// Generate product description using AI
export async function generateProductDescription(title: string, category: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional product copywriter. Write compelling, detailed product descriptions that highlight features and benefits."
        },
        {
          role: "user",
          content: `Write a detailed product description for: ${title} in the ${category} category. Make it engaging, highlight key features, and include benefits. Keep it between 100-200 words.`
        }
      ],
      max_tokens: 300,
    })

    return response.choices[0]?.message?.content || 'Product description'
  } catch (error) {
    console.error('Error generating product description:', error)
    return 'Product description'
  }
}

// Analyze sales data and provide insights
export async function analyzeSalesData(salesData: any[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a business analyst. Analyze sales data and provide actionable insights and recommendations."
        },
        {
          role: "user",
          content: `Analyze this sales data and provide insights: ${JSON.stringify(salesData)}. Focus on trends, top performers, and recommendations for improvement.`
        }
      ],
      max_tokens: 500,
    })

    return response.choices[0]?.message?.content || 'Sales analysis'
  } catch (error) {
    console.error('Error analyzing sales data:', error)
    return 'Sales analysis'
  }
} 