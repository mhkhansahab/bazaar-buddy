"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickViewModal } from "@/components/products/quick-view-modal";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  discount?: number;
  category: string;
}

export function ProductCard({
  id,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  isNew,
  discount,
  category
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isLoading } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addToCart({
      id,
      title,
      price,
      originalPrice,
      image,
      category,
    });

    addToast('success', `${title} added to cart!`);
  };
  const [imageError, setImageError] = useState(false);

  return (
    <Card 
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isLoading ? 'opacity-75 pointer-events-none' : ''
      }`}
      onMouseEnter={() => !isLoading && setIsHovered(true)}
      onMouseLeave={() => !isLoading && setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
            NEW
          </span>
        )}
        {discount && (
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="sm"
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 bg-white/80 backdrop-blur-sm`}
        onClick={() => setIsWishlisted(!isWishlisted)}
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${id}`}>
          <Image
            src={imageError || !image ? "/placeholder-image.svg" : image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </Link>
        
        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity ${
          isHovered && !isLoading ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <QuickViewModal 
              product={{
                id,
                title,
                price,
                originalPrice,
                rating,
                reviewCount,
                image,
                category
              }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full px-3 py-2 bg-white/90 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            </QuickViewModal>
            <Button
              size="sm"
              className="rounded-full px-3 py-2"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4 mr-1" />
              )}
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* Category */}
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {category}
          </p>

          {/* Title */}
          <Link href={`/product/${id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(rating)
                      ? 'text-orange-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
