import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  is_active?: boolean;
  seller_id: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category || !body.seller_id) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, category, seller_id" },
        { status: 400 }
      );
    }

    // Validate price
    if (body.price < 0) {
      return NextResponse.json(
        { error: "Price must be greater than or equal to 0" },
        { status: 400 }
      );
    }

    // Validate stock quantity
    if (body.stock_quantity < 0) {
      return NextResponse.json(
        { error: "Stock quantity must be greater than or equal to 0" },
        { status: 400 }
      );
    }

    // Check if seller exists
    const { data: seller, error: sellerError } = await supabase
      .from("sellers")
      .select("id")
      .eq("id", body.seller_id)
      .single();

    if (sellerError || !seller) {
      return NextResponse.json({ error: "Invalid seller_id" }, { status: 400 });
    }

    // Check if category exists
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("name")
      .eq("name", body.category)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Insert the product
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        description: body.description || null,
        price: body.price,
        category: body.category,
        image_url: body.image_url || null,
        stock_quantity: body.stock_quantity,
        is_active: body.is_active !== undefined ? body.is_active : true,
        seller_id: body.seller_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create product", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seller_id = searchParams.get("seller_id");
    const category = searchParams.get("category");
    const is_active = searchParams.get("is_active");
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

    let query = supabase.from("products").select(`
        *,
        sellers (
          id,
          name,
          store_name
        ),
        categories (
          id,
          name
        )
      `);

    // Apply filters
    if (seller_id) {
      // For now, we'll use seller_id = 1 for all requests since we don't have UUID mapping
      // TODO: Implement proper seller authentication with UUID to integer mapping
      query = query.eq("seller_id", 1);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (is_active !== null) {
      query = query.eq("is_active", is_active === "true");
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    // Apply same filters to count query
    if (seller_id) {
      countQuery = countQuery.eq("seller_id", 1);
    }
    if (category) {
      countQuery = countQuery.eq("category", category);
    }
    if (is_active !== null) {
      countQuery = countQuery.eq("is_active", is_active === "true");
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      return NextResponse.json(
        {
          error: "Failed to fetch products count",
          details: countError.message,
        },
        { status: 500 }
      );
    }

    // Apply pagination and ordering
    query = query.order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data: products, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products", details: error.message },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      data: products || [],
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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
