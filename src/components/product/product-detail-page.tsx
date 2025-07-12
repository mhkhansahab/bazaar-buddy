"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Plus, 
  Minus,
  Shield,
  Truck,
  RotateCcw,
  ChevronRight
} from "lucide-react";

// Mock product data
const PRODUCT_DATA = {
  id: "1",
  title: "Wireless Bluetooth Headphones with Active Noise Cancellation",
  price: 129.99,
  originalPrice: 199.99,
  rating: 4.5,
  reviewCount: 1250,
  images: [
    "/placeholder-image.svg",
    "/placeholder-image.svg",
    "/placeholder-image.svg",
    "/placeholder-image.svg"
  ],
  category: "Electronics",
  brand: "TechAudio",
  inStock: true,
  description: "Experience superior sound quality with our premium wireless headphones featuring advanced noise cancellation technology, 30-hour battery life, and premium comfort design.",
  features: [
    "Active Noise Cancellation",
    "30-hour battery life",
    "Bluetooth 5.0 connectivity",
    "Premium comfort padding",
    "Quick charge - 10 min for 3 hours playback",
    "Voice assistant compatible"
  ],
  specifications: {
    "Driver Size": "40mm",
    "Frequency Response": "20Hz - 20kHz",
    "Battery Life": "30 hours",
    "Charging Time": "2 hours",
    "Weight": "250g",
    "Connectivity": "Bluetooth 5.0, 3.5mm jack"
  },
  seller: {
    name: "TechStore Pro",
    rating: 4.8,
    location: "California, USA"
  }
};

const REVIEWS = [
  {
    id: 1,
    user: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    comment: "Amazing sound quality! The noise cancellation works perfectly on my daily commute.",
    verified: true
  },
  {
    id: 2,
    user: "Mike R.",
    rating: 4,
    date: "1 week ago", 
    comment: "Great headphones, very comfortable for long listening sessions. Battery life is excellent.",
    verified: true
  },
  {
    id: 3,
    user: "Emily K.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Perfect for work from home! The noise cancellation helps me focus during calls.",
    verified: true
  }
];

export function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <ChevronRight className="h-4 w-4" />
          <span>{PRODUCT_DATA.category}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{PRODUCT_DATA.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={PRODUCT_DATA.images[selectedImage]}
                alt={PRODUCT_DATA.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {PRODUCT_DATA.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${PRODUCT_DATA.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand and Category */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">{PRODUCT_DATA.brand}</span> • {PRODUCT_DATA.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {PRODUCT_DATA.title}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(PRODUCT_DATA.rating)
                        ? 'text-orange-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-900 font-medium">{PRODUCT_DATA.rating}</span>
              <span className="text-gray-600">({PRODUCT_DATA.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ${PRODUCT_DATA.price}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ${PRODUCT_DATA.originalPrice}
              </span>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                35% OFF
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">In Stock</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {PRODUCT_DATA.description}
            </p>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {PRODUCT_DATA.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Purchase Benefits */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>2-year manufacturer warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                Specifications
              </button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium text-sm">
                Reviews ({PRODUCT_DATA.reviewCount})
              </button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700 font-medium text-sm">
                Seller Information
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Specifications Tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(PRODUCT_DATA.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {REVIEWS.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {review.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.user}</span>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-orange-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
