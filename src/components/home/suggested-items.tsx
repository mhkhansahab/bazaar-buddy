"use client";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

// Mock data for suggested products
const SUGGESTED_PRODUCTS = [
  {
    id: "1",
    title: "Wireless Bluetooth Headphones with Noise Cancellation",
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviewCount: 1250,
    image: "/placeholder-image.svg",
    isNew: false,
    discount: 35,
    category: "Electronics"
  },
  {
    id: "2",
    title: "Organic Cotton T-Shirt - Premium Quality",
    price: 29.99,
    rating: 4.3,
    reviewCount: 890,
    image: "/placeholder-image.svg",
    isNew: true,
    category: "Fashion"
  },
  {
    id: "3",
    title: "Smart Home LED Light Bulb with App Control",
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviewCount: 2100,
    image: "/placeholder-image.svg",
    discount: 38,
    category: "Home & Garden"
  },
  {
    id: "4",
    title: "Premium Coffee Beans - Single Origin",
    price: 18.99,
    rating: 4.8,
    reviewCount: 650,
    image: "/placeholder-image.svg",
    isNew: true,
    category: "Food & Beverages"
  },
  {
    id: "5",
    title: "Fitness Tracker with Heart Rate Monitor",
    price: 89.99,
    originalPrice: 149.99,
    rating: 4.4,
    reviewCount: 1800,
    image: "/placeholder-image.svg",
    discount: 40,
    category: "Sports & Fitness"
  },
  {
    id: "6",
    title: "Minimalist Desk Organizer Set",
    price: 34.99,
    rating: 4.6,
    reviewCount: 420,
    image: "/placeholder-image.svg",
    category: "Office Supplies"
  }
];

export function SuggestedItems() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                AI Recommended for You
              </h2>
              <p className="text-gray-600 mt-1">
                Personalized suggestions based on your preferences
              </p>
            </div>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Suggestions
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SUGGESTED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="px-8 py-3">
            View More Recommendations
          </Button>
        </div>
      </div>
    </section>
  );
}
