import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { CreateProductData, TableNames } from "@/lib/types/database";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")
      ? decodeURIComponent(searchParams?.get("category") || "")
      : null;
    const isActive = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        { error: "Page must be greater than 0" },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    let query = supabase.from(TableNames.PRODUCTS).select("*");

    // Apply filters if provided
    if (category) {
      query = query.in("category", [category]);
    }

    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    }

    // Order by created_at descending
    query = query.order("created_at", { ascending: false });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Get total count for pagination metadata
    let countQuery = supabase
      .from(TableNames.PRODUCTS)
      .select("*", { count: "exact", head: true });

    // Apply same filters to count query
    if (category) {
      countQuery = countQuery.eq("category", category);
    }

    if (isActive !== null) {
      countQuery = countQuery.eq("is_active", isActive === "true");
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error("Error fetching products count:", countError);
      return NextResponse.json(
        { error: "Failed to fetch products count" },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: CreateProductData = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, category" },
        { status: 400 }
      );
    }

    // Validate price is positive
    if (body.price <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0" },
        { status: 400 }
      );
    }

    // Validate stock quantity is non-negative
    if (body.stock_quantity && body.stock_quantity < 0) {
      return NextResponse.json(
        { error: "Stock quantity cannot be negative" },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from(TableNames.PRODUCTS)
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        image_url: body.image_url,
        stock_quantity: body.stock_quantity || 0,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data: product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
