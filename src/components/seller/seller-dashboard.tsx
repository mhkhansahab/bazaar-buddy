"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Search,
  LogOut,
  Settings,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

// Mock data for seller products
const SELLER_PRODUCTS = {
  electronics: [
    {
      id: "1",
      title: "Wireless Bluetooth Headphones",
      price: 129.99,
      stock: 45,
      status: "active",
      sales: 125,
      image: "/placeholder-image.svg",
    },
    {
      id: "2",
      title: "Smart Watch Series 9",
      price: 399.99,
      stock: 0,
      status: "out_of_stock",
      sales: 89,
      image: "/placeholder-image.svg",
    },
    {
      id: "3",
      title: "Gaming Laptop - High Performance",
      price: 1299.99,
      stock: 12,
      status: "active",
      sales: 34,
      image: "/placeholder-image.svg",
    },
  ],
  fashion: [
    {
      id: "4",
      title: "Designer Jeans - Premium Denim",
      price: 89.99,
      stock: 78,
      status: "active",
      sales: 256,
      image: "/placeholder-image.svg",
    },
    {
      id: "5",
      title: "Elegant Evening Dress",
      price: 159.99,
      stock: 23,
      status: "active",
      sales: 67,
      image: "/placeholder-image.svg",
    },
  ],
  home: [
    {
      id: "6",
      title: "Smart Thermostat with WiFi",
      price: 179.99,
      stock: 34,
      status: "active",
      sales: 145,
      image: "/placeholder-image.svg",
    },
    {
      id: "7",
      title: "Modern Table Lamp",
      price: 89.99,
      stock: 56,
      status: "active",
      sales: 89,
      image: "/placeholder-image.svg",
    },
  ],
};

const DASHBOARD_STATS = {
  totalProducts: 7,
  totalSales: 865,
  revenue: 45680.5,
  activeListings: 6,
};

export function SellerDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Products", count: DASHBOARD_STATS.totalProducts },
    {
      id: "electronics",
      name: "Electronics",
      count: SELLER_PRODUCTS.electronics.length,
    },
    { id: "fashion", name: "Fashion", count: SELLER_PRODUCTS.fashion.length },
    { id: "home", name: "Home & Garden", count: SELLER_PRODUCTS.home.length },
  ];

  const getAllProducts = () => {
    if (selectedCategory === "all") {
      return [
        ...SELLER_PRODUCTS.electronics,
        ...SELLER_PRODUCTS.fashion,
        ...SELLER_PRODUCTS.home,
      ];
    }
    return (
      SELLER_PRODUCTS[selectedCategory as keyof typeof SELLER_PRODUCTS] || []
    );
  };

  const filteredProducts = getAllProducts().filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Store className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Seller Dashboard
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {DASHBOARD_STATS.totalProducts}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {DASHBOARD_STATS.totalSales}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${DASHBOARD_STATS.revenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Listings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {DASHBOARD_STATS.activeListings}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                Your Products
              </CardTitle>
              <Link href="/seller/add-product">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-sm"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md ml-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Sales
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">
                          ${product.price}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock < 20
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">
                          {product.sales}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "active"
                            ? "Active"
                            : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
