'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  stock: number
  isActive: boolean
  createdAt: string
}

interface Analytics {
  metrics: {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    period: string
  }
  topProducts: Array<{
    title: string
    quantity: number
    revenue: number
  }>
  aiInsights: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    // Get token from localStorage (in real app, use proper auth)
    const storedToken = localStorage.getItem('seller-token')
    if (storedToken) {
      setToken(storedToken)
      fetchProducts(storedToken)
      fetchAnalytics(storedToken)
    }
  }, [])

  const fetchProducts = async (authToken: string) => {
    try {
      const response = await fetch('/api/seller/products', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      const data = await response.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchAnalytics = async (authToken: string) => {
    try {
      const response = await fetch('/api/seller/analytics?period=30', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      
      if (data.seller) {
        // Optionally store seller info in localStorage
        localStorage.setItem('seller', JSON.stringify(data.seller))
        window.location.href = '/admin';
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const storeName = formData.get('storeName') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          storeName, 
          phone, 
          address 
        })
      })
      const data = await response.json()
      
      if (response.ok) {
        alert('Registration successful! Please login.')
        setIsRegistering(false)
      } else {
        alert(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed')
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isRegistering ? 'Seller Registration' : 'Seller Login'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isRegistering ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="storeName"
                    placeholder="Store Name"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    placeholder="Phone (optional)"
                  />
                </div>
                <div>
                  <Input
                    name="address"
                    placeholder="Address (optional)"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsRegistering(false)}
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsRegistering(true)}
                >
                  Create New Account
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem('seller-token')
              setToken('')
            }}
          >
            Logout
          </Button>
        </div>
        
        {/* Analytics Section */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.metrics?.totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Last {analytics.metrics?.period}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.metrics?.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Last {analytics.metrics?.period}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.metrics?.averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Per order
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.filter(p => p.isActive).length}</div>
                <p className="text-xs text-muted-foreground">
                  Currently listed
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Insights */}
        {analytics?.aiInsights && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Sales Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {analytics.aiInsights}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Top Products */}
        {analytics?.topProducts && analytics.topProducts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-500">
                        {product.quantity} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Products</CardTitle>
              <Button 
                onClick={() => window.location.href = '/admin/products/new'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create New Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.description.substring(0, 100)}...
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gray-600">${product.price}</span>
                        <span className="text-gray-600">Stock: {product.stock}</span>
                        <span className="text-gray-600">{product.category}</span>
                        <span className={`${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 