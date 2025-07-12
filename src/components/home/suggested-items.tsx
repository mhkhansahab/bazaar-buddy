/* eslint-disable no-console */
"use client";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Product, ApiResponse } from "@/lib/types/database";

// Types for normalized product data
interface NormalizedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  discount?: number;
  category: string;
  isNew?: boolean;
}

// Utility function to normalize product data from API
function normalizeProduct(product: Product): NormalizedProduct {
  return {
    id: product.id.toString(),
    title: product.name,
    price: product.price,
    // Add mock rating and review count since they're not in DB yet
    rating: 4.0 + Math.random() * 1, // Random rating between 4.0-5.0
    reviewCount: Math.floor(Math.random() * 1000) + 100, // Random review count
    image: product.image_url || "/placeholder-image.svg",
    category: product.category,
    isNew: Math.random() > 0.8, // 20% chance of being new
  };
}

// API function to fetch suggested products
async function fetchSuggestedProducts(): Promise<Product[]> {
  const response = await fetch("/api/products?is_active=true");
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result: ApiResponse<Product[]> = await response.json();
  return result.data || [];
}

export function SuggestedItems() {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await fetchSuggestedProducts();

      // Shuffle products and take first 6 for variety
      const shuffled = productsData.sort(() => 0.5 - Math.random());
      const suggested = shuffled.slice(0, 6);

      // Normalize products data
      const normalizedProducts = suggested.map(normalizeProduct);
      setProducts(normalizedProducts);
    } catch (err) {
      console.error("Error loading suggested products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
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
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
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
          </div>

          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadProducts}>Try Again</Button>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
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
          </div>

          <div className="text-center py-12">
            <p className="text-gray-600">
              No products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

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

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={loadProducts}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Suggestions
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
