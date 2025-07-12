"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal
} from "lucide-react";

// Mock data for all products by category
const ALL_PRODUCTS = {
  electronics: [
    {
      id: "e1",
      title: "Latest Smartphone with 5G",
      price: 699.99,
      originalPrice: 899.99,
      rating: 4.6,
      reviewCount: 3200,
      image: "/placeholder-image.svg",
      discount: 22,
      category: "Electronics",
      isNew: false
    },
    {
      id: "e2",
      title: "Gaming Laptop - High Performance",
      price: 1299.99,
      rating: 4.8,
      reviewCount: 850,
      image: "/placeholder-image.svg",
      isNew: true,
      category: "Electronics"
    },
    {
      id: "e3",
      title: "Wireless Charging Pad",
      price: 39.99,
      originalPrice: 59.99,
      rating: 4.4,
      reviewCount: 1200,
      image: "/placeholder-image.svg",
      discount: 33,
      category: "Electronics"
    },
    {
      id: "e4",
      title: "Smart Watch Series 9",
      price: 399.99,
      rating: 4.7,
      reviewCount: 2500,
      image: "/placeholder-image.svg",
      category: "Electronics"
    },
    {
      id: "e5",
      title: "Bluetooth Speaker - Premium Sound",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.5,
      reviewCount: 890,
      image: "/placeholder-image.svg",
      discount: 25,
      category: "Electronics"
    },
    {
      id: "e6",
      title: "Wireless Bluetooth Headphones",
      price: 129.99,
      originalPrice: 199.99,
      rating: 4.5,
      reviewCount: 1250,
      image: "/placeholder-image.svg",
      discount: 35,
      category: "Electronics"
    },
    {
      id: "e7",
      title: "4K Action Camera",
      price: 249.99,
      rating: 4.6,
      reviewCount: 680,
      image: "/placeholder-image.svg",
      isNew: true,
      category: "Electronics"
    },
    {
      id: "e8",
      title: "Smart Home Hub",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.3,
      reviewCount: 540,
      image: "/placeholder-image.svg",
      discount: 31,
      category: "Electronics"
    }
  ],
  fashion: [
    {
      id: "f1",
      title: "Designer Jeans - Premium Denim",
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.4,
      reviewCount: 650,
      image: "/placeholder-image.svg",
      discount: 31,
      category: "Fashion"
    },
    {
      id: "f2",
      title: "Elegant Evening Dress",
      price: 159.99,
      rating: 4.7,
      reviewCount: 420,
      image: "/placeholder-image.svg",
      isNew: true,
      category: "Fashion"
    },
    {
      id: "f3",
      title: "Casual Summer Sneakers",
      price: 79.99,
      rating: 4.6,
      reviewCount: 1100,
      image: "/placeholder-image.svg",
      category: "Fashion"
    },
    {
      id: "f4",
      title: "Leather Handbag - Vintage Style",
      price: 199.99,
      originalPrice: 299.99,
      rating: 4.8,
      reviewCount: 350,
      image: "/placeholder-image.svg",
      discount: 33,
      category: "Fashion"
    },
    {
      id: "f5",
      title: "Wool Winter Coat",
      price: 249.99,
      rating: 4.5,
      reviewCount: 290,
      image: "/placeholder-image.svg",
      category: "Fashion"
    },
    {
      id: "f6",
      title: "Cotton T-Shirt - Premium Quality",
      price: 29.99,
      rating: 4.3,
      reviewCount: 890,
      image: "/placeholder-image.svg",
      isNew: true,
      category: "Fashion"
    },
    {
      id: "f7",
      title: "Running Shoes - Professional",
      price: 119.99,
      originalPrice: 159.99,
      rating: 4.7,
      reviewCount: 1300,
      image: "/placeholder-image.svg",
      discount: 25,
      category: "Fashion"
    },
    {
      id: "f8",
      title: "Summer Dress - Floral Print",
      price: 69.99,
      rating: 4.4,
      reviewCount: 520,
      image: "/placeholder-image.svg",
      category: "Fashion"
    }
  ],
  home: [
    {
      id: "h1",
      title: "Smart Thermostat with WiFi",
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.6,
      reviewCount: 1800,
      image: "/placeholder-image.svg",
      discount: 28,
      category: "Home & Garden"
    },
    {
      id: "h2",
      title: "Indoor Plant Collection Set",
      price: 49.99,
      rating: 4.7,
      reviewCount: 920,
      image: "/placeholder-image.svg",
      isNew: true,
      category: "Home & Garden"
    },
    {
      id: "h3",
      title: "Modern Table Lamp",
      price: 89.99,
      rating: 4.4,
      reviewCount: 560,
      image: "/placeholder-image.svg",
      category: "Home & Garden"
    },
    {
      id: "h4",
      title: "Ergonomic Office Chair",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      reviewCount: 740,
      image: "/placeholder-image.svg",
      discount: 25,
      category: "Home & Garden"
    },
    {
      id: "h5",
      title: "Kitchen Appliance Set",
      price: 199.99,
      rating: 4.5,
      reviewCount: 450,
      image: "/placeholder-image.svg",
      category: "Home & Garden"
    },
    {
      id: "h6",
      title: "Decorative Wall Art",
      price: 79.99,
      originalPrice: 119.99,
      rating: 4.3,
      reviewCount: 320,
      image: "/placeholder-image.svg",
      discount: 33,
      category: "Home & Garden"
    }
  ],
  sports: [
    {
      id: "s1",
      title: "Professional Yoga Mat",
      price: 49.99,
      originalPrice: 79.99,
      rating: 4.7,
      reviewCount: 1200,
      image: "/placeholder-image.svg",
      discount: 38,
      category: "Sports & Fitness"
    },
    {
      id: "s2",
      title: "Adjustable Dumbbells Set",
      price: 299.99,
      rating: 4.8,
      reviewCount: 650,
      image: "/placeholder-image.svg",
      isNew: true,
      category: "Sports & Fitness"
    },
    {
      id: "s3",
      title: "Running Shoes - Ultra Comfort",
      price: 129.99,
      originalPrice: 179.99,
      rating: 4.6,
      reviewCount: 2100,
      image: "/placeholder-image.svg",
      discount: 28,
      category: "Sports & Fitness"
    },
    {
      id: "s4",
      title: "Protein Shake Bottle",
      price: 24.99,
      rating: 4.4,
      reviewCount: 890,
      image: "/placeholder-image.svg",
      category: "Sports & Fitness"
    },
    {
      id: "s5",
      title: "Resistance Bands Set",
      price: 39.99,
      rating: 4.5,
      reviewCount: 750,
      image: "/placeholder-image.svg",
      category: "Sports & Fitness"
    },
    {
      id: "s6",
      title: "Fitness Tracker Watch",
      price: 89.99,
      originalPrice: 149.99,
      rating: 4.4,
      reviewCount: 1800,
      image: "/placeholder-image.svg",
      discount: 40,
      category: "Sports & Fitness"
    }
  ]
};

const CATEGORY_INFO = {
  all: {
    name: "All Categories",
    description: "Browse our complete collection of products across all categories",
    totalProducts: 69
  },
  electronics: {
    name: "Electronics",
    description: "Discover the latest gadgets, smartphones, laptops, and tech accessories",
    totalProducts: 24
  },
  fashion: {
    name: "Fashion",
    description: "Trendy clothing, shoes, accessories for every style and occasion",
    totalProducts: 18
  },
  home: {
    name: "Home & Garden",
    description: "Transform your living space with furniture, decor, and garden essentials",
    totalProducts: 15
  },
  sports: {
    name: "Sports & Fitness",
    description: "Gear up for your active lifestyle with fitness equipment and sportswear",
    totalProducts: 12
  }
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "popularity", label: "Most Popular" }
];

const FILTER_OPTIONS = {
  priceRanges: [
    { min: 0, max: 50, label: "Under $50" },
    { min: 50, max: 100, label: "$50 - $100" },
    { min: 100, max: 200, label: "$100 - $200" },
    { min: 200, max: 500, label: "$200 - $500" },
    { min: 500, max: Infinity, label: "Over $500" }
  ],
  ratings: [
    { value: 4.5, label: "4.5 stars & up" },
    { value: 4, label: "4 stars & up" },
    { value: 3.5, label: "3.5 stars & up" },
    { value: 3, label: "3 stars & up" }
  ]
};

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
  const products = category === "all" 
    ? [...ALL_PRODUCTS.electronics, ...ALL_PRODUCTS.fashion, ...ALL_PRODUCTS.home, ...ALL_PRODUCTS.sports]
    : ALL_PRODUCTS[category as keyof typeof ALL_PRODUCTS] || [];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply price filters
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        return selectedPriceRanges.some(index => {
          const range = FILTER_OPTIONS.priceRanges[index];
          return product.price >= range.min && product.price <= range.max;
        });
      });
    }

    // Apply rating filters
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product => {
        return selectedRatings.some(rating => product.rating >= rating);
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
    setSelectedPriceRanges(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const toggleRatingFilter = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
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
          <Link href="/" className="hover:text-blue-600">Home</Link>
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
                {filteredAndSortedProducts.length} of {categoryInfo.totalProducts} products
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
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SORT_OPTIONS.map(option => (
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
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`} />
              </Button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.priceRanges.map((range, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPriceRanges.includes(index)}
                          onChange={() => togglePriceFilter(index)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Customer Rating</h3>
                  <div className="space-y-2">
                    {FILTER_OPTIONS.ratings.map((rating, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating.value)}
                          onChange={() => toggleRatingFilter(rating.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{rating.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">On Sale</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">New Arrivals</span>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedPriceRanges([]);
              setSelectedRatings([]);
            }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id} className={viewMode === "list" ? "bg-white rounded-lg border" : ""}>
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
