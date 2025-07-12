"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";

interface SearchMetadata {
  originalQuery: string;
  parsedFilters: any;
  totalResults: number;
  appliedFilters: {
    category?: string;
    color?: string;
    priceRange?: {
      min?: number;
      max?: number;
    };
    size?: string;
    brand?: string;
    material?: string;
    keywords: string[];
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [searchMetadata, setSearchMetadata] = useState<SearchMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search/nlp?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        setProducts(data.products);
        setSearchMetadata(data.searchMetadata);
      } catch (err) {
        setError("Failed to perform search. Please try again.");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No search query provided
            </h1>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  AI Search Results
                </h1>
              </div>
            </div>
          </div>

          {/* Search Query Display */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Search className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Your search:
              </span>
            </div>
            <p className="text-lg text-gray-900 font-medium">"{query}"</p>
          </div>
        </div>

        {/* Search Metadata */}
        {searchMetadata && (
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Filter className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">
                    AI Understanding
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchMetadata.appliedFilters.category && (
                    <div>
                      <span className="text-xs text-gray-500">Category:</span>
                      <Badge variant="secondary" className="ml-2">
                        {searchMetadata.appliedFilters.category}
                      </Badge>
                    </div>
                  )}

                  {searchMetadata.appliedFilters.color && (
                    <div>
                      <span className="text-xs text-gray-500">Color:</span>
                      <Badge variant="secondary" className="ml-2">
                        {searchMetadata.appliedFilters.color}
                      </Badge>
                    </div>
                  )}

                  {searchMetadata.appliedFilters.priceRange && (
                    <div>
                      <span className="text-xs text-gray-500">Price:</span>
                      <Badge variant="secondary" className="ml-2">
                        {searchMetadata.appliedFilters.priceRange.min
                          ? `$${searchMetadata.appliedFilters.priceRange.min} - $${searchMetadata.appliedFilters.priceRange.max}`
                          : `Under $${searchMetadata.appliedFilters.priceRange.max}`}
                      </Badge>
                    </div>
                  )}

                  {searchMetadata.appliedFilters.size && (
                    <div>
                      <span className="text-xs text-gray-500">Size:</span>
                      <Badge variant="secondary" className="ml-2">
                        {searchMetadata.appliedFilters.size}
                      </Badge>
                    </div>
                  )}

                  {searchMetadata.appliedFilters.brand && (
                    <div>
                      <span className="text-xs text-gray-500">Brand:</span>
                      <Badge variant="secondary" className="ml-2">
                        {searchMetadata.appliedFilters.brand}
                      </Badge>
                    </div>
                  )}

                  {searchMetadata.appliedFilters.material && (
                    <div>
                      <span className="text-xs text-gray-500">Material:</span>
                      <Badge variant="secondary" className="ml-2">
                        {searchMetadata.appliedFilters.material}
                      </Badge>
                    </div>
                  )}
                </div>

                {searchMetadata.appliedFilters.keywords.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-500">Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {searchMetadata.appliedFilters.keywords.map(
                        (keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {isLoading
                ? "Searching..."
                : `${searchMetadata?.totalResults || 0} results found`}
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  price={product.price}
                  image={product.image_url}
                  category={product.category}
                  rating={4.5} // Default rating since it's not in the product data
                  reviewCount={12} // Default review count
                />
              ))}
            </div>
          ) : !error ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search terms or browse our categories
              </p>
              <Link href="/">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
