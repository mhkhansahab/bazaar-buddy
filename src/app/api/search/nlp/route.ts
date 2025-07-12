import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

interface SearchFilters {
  category?: string;
  color?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  keywords: string[];
  size?: string;
  brand?: string;
  material?: string;
}

interface SearchRequest {
  query: string;
  filters?: SearchFilters;
}

export async function POST(request: NextRequest) {
  try {
    const { query, filters }: SearchRequest = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // Build Supabase query
    let supabaseQuery = supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    // Category filter
    if (filters?.category) {
      supabaseQuery = supabaseQuery.ilike("category", `%${filters.category}%`);
    }

    // Price range filter
    if (filters?.priceRange) {
      if (filters.priceRange.min !== undefined) {
        supabaseQuery = supabaseQuery.gte("price", filters.priceRange.min);
      }
      if (filters.priceRange.max !== undefined) {
        supabaseQuery = supabaseQuery.lte("price", filters.priceRange.max);
      }
    }

    // Text search for color, size, brand, material, and keywords
    const textSearchTerms: string[] = [];

    if (filters?.color) {
      textSearchTerms.push(filters.color);
    }
    if (filters?.size) {
      textSearchTerms.push(filters.size);
    }
    if (filters?.brand) {
      textSearchTerms.push(filters.brand);
    }
    if (filters?.material) {
      textSearchTerms.push(filters.material);
    }
    if (filters?.keywords && filters.keywords.length > 0) {
      textSearchTerms.push(...filters.keywords);
    }

    // Add text search if we have search terms
    if (textSearchTerms.length > 0) {
      const searchText = textSearchTerms.join(" ");
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${searchText}%,description.ilike.%${searchText}%`
      );
    }

    // Execute the query
    const { data: products, error } = await supabaseQuery.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Database query failed" },
        { status: 500 }
      );
    }

    // Return the filtered products with search metadata
    return NextResponse.json({
      products: products || [],
      searchMetadata: {
        originalQuery: query,
        parsedFilters: filters,
        totalResults: products?.length || 0,
        appliedFilters: {
          category: filters?.category,
          color: filters?.color,
          priceRange: filters?.priceRange,
          size: filters?.size,
          brand: filters?.brand,
          material: filters?.material,
          keywords: filters?.keywords || [],
        },
      },
    });
  } catch (error) {
    console.error("NLP Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // For GET requests, we'll do a simple text search
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Database query failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      searchMetadata: {
        originalQuery: query,
        parsedFilters: null,
        totalResults: products?.length || 0,
        appliedFilters: {
          keywords: [query],
        },
      },
    });
  } catch (error) {
    console.error("NLP Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
