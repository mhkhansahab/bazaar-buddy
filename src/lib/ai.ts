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

// Helper to fetch image and convert to base64
async function imageUrlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

// Generate product content based on image
export async function generateContentFromImage(imageUrl: string): Promise<GeneratedContent> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing');

    const prompt = `You are an expert e-commerce copywriter. Analyze this product image and generate a catchy, specific product title, a detailed and engaging product description (at least 50 words), and a relevant product category. The product is for an online marketplace. Output as JSON: { title, description, category, tags }. Do NOT use generic placeholders like 'Product Title' or 'General'. If you can't identify the product, say so in the description.`;

    // Fetch image and convert to base64
    const base64Image = await imageUrlToBase64(imageUrl);

    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
          ]
        }
      ]
    };

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    // Log base64 image length
    console.log('Base64 image length:', base64Image.length);
    // Log the full Gemini API response
    console.log('Gemini full response:', JSON.stringify(result, null, 2));
    // Log any error fields if present
    if (result.error) {
        console.error('Gemini API error:', result.error);
    }
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini raw content:', text);
    if (!text) throw new Error('No content generated. See logs for Gemini response and error details.');

    // Try to extract JSON from the response
    const match = text.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : '{}';
    const parsed = JSON.parse(jsonStr);
    return {
      title: parsed.title || 'Product Title',
      description: parsed.description || 'Product Description',
      category: parsed.category || 'General',
      tags: parsed.tags || []
    };
  } catch (error) {
    console.error('Error generating content from image (Gemini):', error);
    return {
      title: 'Product Title',
      description: 'Product Description',
      category: 'General',
      tags: []
    };
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