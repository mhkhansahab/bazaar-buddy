"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logout, useSellerAuth } from "@/lib/seller-auth";
import { useConfirmationModal } from "@/components/ui/confirmation-modal";
import { useSellerProducts } from "@/hooks/use-seller-products";
import { Product } from "@/lib/types/database";
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

export function SellerDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { seller, logout } = useSellerAuth();
  const { openModal, ModalComponent } = useConfirmationModal();
  const { products, isLoading, error, refetch } = useSellerProducts();

  const handleLogout = () => {
    openModal({
      title: "Confirm Logout",
      description: "Are you sure you want to logout? You will need to sign in again to access your dashboard.",
      confirmText: "Logout",
      cancelText: "Stay Signed In",
      variant: "destructive",
      icon: <LogOut className="h-6 w-6" />,
      onConfirm: logout
    });
  };

  // Calculate stats from real products data
  const totalProducts = products.length;
  const activeListings = products.filter(product => product.is_active && product.stock_quantity > 0).length;
  // Note: sales data would need to be added to database schema
  const totalSales = 0; // placeholder until sales tracking is added
  const revenue = 0; // placeholder until sales tracking is added

  // Get unique categories from products
  const uniqueCategories = [...new Set(products.map(product => product.category))];
  
  const categories = [
    { id: "all", name: "All Products", count: totalProducts },
    ...uniqueCategories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: products.filter(product => product.category === category).length,
    }))
  ];

  const getAllProducts = () => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  };

  const filteredProducts = getAllProducts().filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Store className="h-8 w-8 text-blue-600" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">
                    {seller?.storeName || "Seller Dashboard"}
                  </span>
                  {seller && (
                    <span className="text-sm text-gray-600">
                      Welcome back, {seller.name}
                    </span>
                  )}
                </div>
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
              <Button variant="ghost" size="sm" onClick={handleLogout}>
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
                    {totalProducts}
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
                    {totalSales}
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
                    ${revenue.toLocaleString()}
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
                    {activeListings}
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
                              src={product.image_url || "/placeholder-image.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
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
                            product.stock_quantity === 0
                              ? "text-red-600"
                              : product.stock_quantity < 20
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">
                          0
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.is_active && product.stock_quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.is_active && product.stock_quantity > 0
                            ? "Active"
                            : product.stock_quantity === 0 
                            ? "Out of Stock"
                            : "Inactive"}
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

      {/* Confirmation Modal */}
      {ModalComponent}
    </div>
  );
}
