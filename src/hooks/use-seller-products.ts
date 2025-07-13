"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types/database";
import { getSellerFromStorage } from "@/lib/seller-auth";

interface ProductsApiResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message: string;
}

interface UseSellerProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  pagination: ProductsApiResponse["pagination"] | null;
}

export function useSellerProducts(): UseSellerProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    ProductsApiResponse["pagination"] | null
  >(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const seller = getSellerFromStorage();

      const sellerId = seller?.id ?? "1";

      const searchParams = new URLSearchParams({
        seller_id: sellerId,
        limit: "20", // Get more products for dashboard
        page: "1",
      });

      const response = await fetch(`/api/products?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: ProductsApiResponse = await response.json();
      setProducts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProducts([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    pagination,
  };
}
