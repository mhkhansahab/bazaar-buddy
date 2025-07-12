"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus,
  Shield,
  Truck,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface QuickViewModalProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
    category: string;
  };
  children: React.ReactNode;
}

// Mock expanded product data for quick view
const getExpandedProductData = (product: QuickViewModalProps['product']) => ({
  ...product,
  images: [
    product.image,
    product.image,
    product.image,
    product.image
  ],
  brand: "Premium Brand",
  inStock: true,
  description: "Experience premium quality with this carefully curated product featuring advanced technology and superior design.",
  features: [
    "Premium quality materials",
    "Advanced technology integration",
    "Superior comfort design",
    "Durable construction",
    "User-friendly interface",
    "Warranty included"
  ],
  specifications: {
    "Material": "Premium Grade",
    "Dimensions": "Standard Size",
    "Weight": "Lightweight",
    "Warranty": "1 Year"
  },
  seller: {
    name: "Premium Store",
    rating: 4.8,
    location: "USA"
  }
});

export function QuickViewModal({ product, children }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const expandedProduct = getExpandedProductData(product);
  const discount = expandedProduct.originalPrice 
    ? Math.round(((expandedProduct.originalPrice - expandedProduct.price) / expandedProduct.originalPrice) * 100)
    : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={expandedProduct.images[selectedImage]}
                alt={expandedProduct.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {expandedProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${expandedProduct.title} ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Brand and Category */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">{expandedProduct.brand}</span> • {expandedProduct.category}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
              {expandedProduct.title}
            </h2>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(expandedProduct.rating)
                        ? 'text-orange-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-900 font-medium">{expandedProduct.rating}</span>
              <span className="text-gray-600 text-sm">({expandedProduct.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                ${expandedProduct.price.toFixed(2)}
              </span>
              {expandedProduct.originalPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    ${expandedProduct.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium text-sm">In Stock</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {expandedProduct.description}
            </p>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
              <ul className="space-y-1">
                {expandedProduct.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-3 py-1 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button className="flex-1" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`px-4 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="flex flex-col items-center text-center space-y-1">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-xs text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-xs text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-xs text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
