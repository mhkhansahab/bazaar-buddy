"use client";

import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

// Interface for API response
interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Interface for transformed product data
interface TransformedProduct {
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

interface CategoryData {
  id: number;
  name: string;
  description: string;
  products: TransformedProduct[];
}

// Helper function to transform API product to UI product
function transformProduct(apiProduct: ApiProduct): TransformedProduct {
  // Generate reasonable mock values for missing fields
  const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // 3.5-5.0 rating
  const reviewCount = Math.floor(Math.random() * 3000) + 100; // 100-3100 reviews
  const hasDiscount = Math.random() > 0.6; // 40% chance of discount
  const isNew = Math.random() > 0.8; // 20% chance of being new

  let originalPrice: number | undefined;
  let discount: number | undefined;

  if (hasDiscount) {
    discount = Math.floor(Math.random() * 40) + 10; // 10-50% discount
    originalPrice =
      Math.round(apiProduct.price * (100 / (100 - discount)) * 100) / 100;
  }

  return {
    id: apiProduct.id.toString(),
    title: apiProduct.name,
    price: apiProduct.price,
    originalPrice,
    rating,
    reviewCount,
    image: apiProduct.image_url || "/placeholder-image.svg",
    discount,
    category: apiProduct.category,
    isNew: !hasDiscount && isNew, // Don't show both new and discount
  };
}

interface CategorySectionProps {
  category: CategoryData;
}

function CategorySection({ category }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-16">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {category.name}
          </h3>
          <p className="text-gray-600">{category.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("left")}
              className="rounded-full p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("right")}
              className="rounded-full p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Link href={`/category/${encodeURIComponent(category.name)}`}>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Horizontal Scrolling Products */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {category.products.map((product) => (
          <div key={product.id} className="flex-none w-64">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategorySections() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoriesAndProducts() {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        const apiCategories: ApiCategory[] = categoriesData.data || [];

        // Fetch products for each category
        const categoriesWithProducts = await Promise.all(
          apiCategories.map(async (category) => {
            try {
              const productsResponse = await fetch(
                `/api/products?category=${encodeURIComponent(
                  category.name
                )}&is_active=true`
              );
              if (!productsResponse.ok) {
                console.warn(
                  `Failed to fetch products for category ${category.name}`
                );
                return null;
              }
              const productsData = await productsResponse.json();
              const apiProducts: ApiProduct[] = productsData.data || [];

              // Take only the first 10 products and transform them
              const transformedProducts = apiProducts
                .slice(0, 10)
                .map(transformProduct);

              // Only include categories that have products
              if (transformedProducts.length === 0) {
                return null;
              }

              return {
                id: category.id,
                name: category.name,
                description: category.description,
                products: transformedProducts,
              };
            } catch (error) {
              console.warn(
                `Error fetching products for category ${category.name}:`,
                error
              );
              return null;
            }
          })
        );

        // Filter out null values and set categories
        const validCategories = categoriesWithProducts.filter(
          (cat): cat is CategoryData => cat !== null
        );
        setCategories(validCategories);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriesAndProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover products across all categories
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover products across all categories
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover products across all categories
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">
              No products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover products across all categories
          </p>
        </div>

        {/* Category Sections */}
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
