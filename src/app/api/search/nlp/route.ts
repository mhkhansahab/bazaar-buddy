import { NextRequest, NextResponse } from "next/server";
import { parseNaturalLanguageQuery, searchProducts } from "@/lib/nlp-search";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // Parse the natural language query
    const filters = parseNaturalLanguageQuery(query);

    // Get all products from the database using Prisma
    const products = await prisma.product.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Apply NLP filters to the products
    const filteredProducts = searchProducts(filters, products);

    // Return the filtered products with search metadata
    return NextResponse.json({
      products: filteredProducts,
      searchMetadata: {
        originalQuery: query,
        parsedFilters: filters,
        totalResults: filteredProducts.length,
        appliedFilters: {
          category: filters.category,
          color: filters.color,
          priceRange: filters.priceRange,
          size: filters.size,
          brand: filters.brand,
          material: filters.material,
          keywords: filters.keywords,
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

    // Parse the natural language query
    const filters = parseNaturalLanguageQuery(query);

    // Get all products from the database using Prisma
    const products = await prisma.product.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Apply NLP filters to the products
    const filteredProducts = searchProducts(filters, products);

    // Return the filtered products with search metadata
    return NextResponse.json({
      products: filteredProducts,
      searchMetadata: {
        originalQuery: query,
        parsedFilters: filters,
        totalResults: filteredProducts.length,
        appliedFilters: {
          category: filters.category,
          color: filters.color,
          priceRange: filters.priceRange,
          size: filters.size,
          brand: filters.brand,
          material: filters.material,
          keywords: filters.keywords,
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
