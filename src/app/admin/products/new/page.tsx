'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GeneratedContent {
  title: string
  description: string
  category: string
  tags: string[]
}

interface GeneratedImage {
  url: string
  prompt: string
}

export default function NewProduct() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const sellerStr = localStorage.getItem('seller')
      if (!sellerStr) {
        alert('Please login first')
        return
      }
      const seller = JSON.parse(sellerStr)
      const sellerId = seller.id

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-seller-id': sellerId,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock),
        })
      })

      if (response.ok) {
        alert('Product created successfully!')
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          images: []
        })
        setGeneratedContent(null)
        setGeneratedImage(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  const generateContentFromImage = async () => {
    if (!imageUrl) {
      alert('Please enter an image URL first')
      return
    }

    setGenerating(true)
    try {
      const token = localStorage.getItem('seller-token')
      const response = await fetch('/api/seller/products/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'from-image',
          imageUrl
        })
      })

      const data = await response.json()
      if (data.content) {
        setGeneratedContent(data.content)
        setFormData(prev => ({
          ...prev,
          title: data.content.title,
          description: data.content.description,
          category: data.content.category
        }))
      }
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Error generating content from image')
    } finally {
      setGenerating(false)
    }
  }

  const generateImageFromText = async () => {
    if (!formData.title || !formData.description) {
      alert('Please enter title and description first')
      return
    }

    setGenerating(true)
    try {
      const token = localStorage.getItem('seller-token')
      const response = await fetch('/api/seller/products/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'generate-image',
          title: formData.title,
          description: formData.description,
          category: formData.category
        })
      })

      const data = await response.json()
      if (data.image && data.image.url) {
        setGeneratedImage(data.image)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.image.url]
        }))
      }
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Error generating image')
    } finally {
      setGenerating(false)
    }
  }

  const enhanceDescription = async () => {
    if (!formData.title || !formData.category) {
      alert('Please enter title and category first')
      return
    }

    setGenerating(true)
    try {
      const token = localStorage.getItem('seller-token')
      const response = await fetch('/api/seller/products/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'enhance-description',
          title: formData.title,
          category: formData.category
        })
      })

      const data = await response.json()
      if (data.description) {
        setFormData(prev => ({
          ...prev,
          description: data.description
        }))
      }
    } catch (error) {
      console.error('Error enhancing description:', error)
      alert('Error enhancing description')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Product</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Product title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product description"
                    className="w-full p-3 border rounded-md"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock</label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Product category"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URLs (one per line)</label>
                  <textarea
                    name="images"
                    value={formData.images.join('\n')}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      images: e.target.value.split('\n').filter(url => url.trim())
                    }))}
                    placeholder="https://example.com/image1.jpg"
                    className="w-full p-3 border rounded-md"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <div className="space-y-6">
            {/* Generate Content from Image */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Content from Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button 
                  onClick={generateContentFromImage} 
                  disabled={generating || !imageUrl}
                  className="w-full"
                >
                  {generating ? 'Generating...' : 'Generate Content'}
                </Button>
                
                {generatedContent && (
                  <div className="mt-4 p-4 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-800">Generated Content:</h4>
                    <p className="text-sm text-green-700 mt-2">
                      <strong>Title:</strong> {generatedContent.title}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Category:</strong> {generatedContent.category}
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Tags:</strong> {generatedContent.tags.join(', ')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate Image from Text */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Image from Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={generateImageFromText} 
                  disabled={generating || !formData.title || !formData.description}
                  className="w-full"
                >
                  {generating ? 'Generating...' : 'Generate Image'}
                </Button>
                
                {generatedImage && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800">Generated Image:</h4>
                    <img 
                      src={generatedImage.url} 
                      alt="Generated product" 
                      className="w-full h-48 object-cover rounded-md mt-2"
                    />
                    <p className="text-xs text-blue-700 mt-2">
                      <strong>Prompt:</strong> {generatedImage.prompt}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhance Description */}
            <Card>
              <CardHeader>
                <CardTitle>Enhance Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={enhanceDescription} 
                  disabled={generating || !formData.title || !formData.category}
                  className="w-full"
                >
                  {generating ? 'Enhancing...' : 'Enhance Description'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 