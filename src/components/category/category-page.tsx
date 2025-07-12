"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Grid3X3,
  List,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { Product, Category, ApiResponse } from "@/lib/types/database";

// Types for component props
interface CategoryPageProps {
  category: string;
}

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

// Types for category info
interface CategoryInfo {
  name: string;
  description: string;
  totalProducts: number;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "popularity", label: "Most Popular" },
];

const FILTER_OPTIONS = {
  priceRanges: [
    { min: 0, max: 50, label: "Under $50" },
    { min: 50, max: 100, label: "$50 - $100" },
    { min: 100, max: 200, label: "$100 - $200" },
    { min: 200, max: 500, label: "$200 - $500" },
    { min: 500, max: Infinity, label: "Over $500" },
  ],
  ratings: [
    { value: 4.5, label: "4.5 stars & up" },
    { value: 4, label: "4 stars & up" },
    { value: 3.5, label: "3.5 stars & up" },
    { value: 3, label: "3 stars & up" },
  ],
};

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
    isNew: false, // Could be calculated based on created_at
  };
}

// API functions
async function fetchProducts(category?: string): Promise<Product[]> {
  const url =
    category && category !== "all"
      ? `/api/products?category=${encodeURIComponent(category)}&active=true`
      : `/api/products?active=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result: ApiResponse<Product[]> = await response.json();
  return result.data || [];
}

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const result: ApiResponse<Category[]> = await response.json();
  return result.data || [];
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  // API state
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);

  // Fetch data on component mount and category change
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(category),
          fetchCategories(),
        ]);

        // Normalize products data
        const normalizedProducts = productsData.map(normalizeProduct);
        setProducts(normalizedProducts);

        // Set category info
        if (category === "all") {
          setCategoryInfo({
            name: "All Categories",
            description:
              "Browse our complete collection of products across all categories",
            totalProducts: normalizedProducts.length,
          });
        } else {
          const categoryData = categoriesData.find(
            (cat) =>
              cat.name.toLowerCase() ===
              (decodeURIComponent(category) || "").toLowerCase()
          );

          if (categoryData) {
            setCategoryInfo({
              name: categoryData.name,
              description:
                categoryData.description ||
                `Browse our ${categoryData.name} collection`,
              totalProducts: normalizedProducts.length,
            });
          } else {
            setCategoryInfo(null);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply price filters
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedPriceRanges.some((index) => {
          const range = FILTER_OPTIONS.priceRanges[index];
          return product.price >= range.min && product.price <= range.max;
        });
      });
    }

    // Apply rating filters
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedRatings.some((rating) => product.rating >= rating);
      });
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case "popularity":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchQuery, sortBy, selectedPriceRanges, selectedRatings]);

  const togglePriceFilter = (index: number) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleRatingFilter = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading products...
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch the latest products
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load products
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
      </div>
    );
  }

  // Category not found
  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Category Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The category you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{categoryInfo.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {categoryInfo.name}
              </h1>
              <p className="text-gray-600 mb-2">{categoryInfo.description}</p>
              <p className="text-sm text-gray-500">
                {filteredAndSortedProducts.length} of{" "}
                {categoryInfo.totalProducts} products
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Search in ${categoryInfo.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.priceRanges.map((range, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(index)}
                          onChange={() => togglePriceFilter(index)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Customer Rating
                  </h3>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.ratings.map((rating, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating.value)}
                          onChange={() => toggleRatingFilter(rating.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {rating.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Availability
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        In Stock
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        On Sale
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        New Arrivals
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedPriceRanges([]);
                setSelectedRatings([]);
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredAndSortedProducts.map((product) => (
              <div
                key={product.id}
                className={
                  viewMode === "list" ? "bg-white rounded-lg border" : ""
                }
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
