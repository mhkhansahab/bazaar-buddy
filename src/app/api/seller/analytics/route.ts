import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { analyzeSalesData } from '@/lib/ai'

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
    const period = searchParams.get('period') || '30' // days

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get sales data
    const orders = await prisma.order.findMany({
      where: {
        sellerId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                category: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate basic metrics
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    // Get top selling products
    const productSales = new Map<string, { title: string; quantity: number; revenue: number }>()
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.productId
        const existing = productSales.get(productId)
        
        if (existing) {
          existing.quantity += item.quantity
          existing.revenue += item.price * item.quantity
        } else {
          productSales.set(productId, {
            title: item.product.title,
            quantity: item.quantity,
            revenue: item.price * item.quantity
          })
        }
      })
    })

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Get category performance
    const categorySales = new Map<string, number>()
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category
        categorySales.set(category, (categorySales.get(category) || 0) + item.price * item.quantity)
      })
    })

    const topCategories = Array.from(categorySales.entries())
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue)

    // Generate AI insights
    const salesData = {
      totalSales,
      totalOrders,
      averageOrderValue,
      topProducts,
      topCategories,
      period: `${period} days`
    }

    const aiInsights = await analyzeSalesData(salesData)

    return NextResponse.json({
      metrics: {
        totalSales,
        totalOrders,
        averageOrderValue,
        period: `${period} days`
      },
      topProducts,
      topCategories,
      aiInsights,
      orders: orders.map(order => ({
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        customerName: order.customerName,
        itemCount: order.items.length
      }))
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 