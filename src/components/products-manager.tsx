/* eslint-disable no-console */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Product,
  Category,
  CreateProductData,
  ApiResponse,
} from "@/lib/types/database";
import { getSellerFromStorage } from "@/lib/seller-auth";

interface ProductsManagerProps {
  className?: string;
}

export function ProductsManager({ className }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const seller = getSellerFromStorage();
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image_url: "",
    stock_quantity: 0,
    is_active: true,
    seller_id: seller?.id ? +seller.id : 1, // Default seller ID - you might want to make this dynamic
  });
  // Load products and categories on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/products");
      const result: ApiResponse<Product[]> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load products");
      }

      setProducts(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result: ApiResponse<Category[]> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load categories");
      }

      setCategories(result.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError(null);
      setIsLoading(true);

      if (editingProduct) {
        // Update existing product
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result: ApiResponse<Product> = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update product");
        }

        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? result.data || p : p
          )
        );
        setEditingProduct(null);
      } else {
        // Create new product
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result: ApiResponse<Product> = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to create product");
        }

        setProducts([result.data || products[0], ...products]);
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        image_url: "",
        stock_quantity: 0,
        is_active: true,
        seller_id: 1, // Default seller ID
      });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      image_url: product.image_url || "",
      stock_quantity: product.stock_quantity,
      is_active: product.is_active,
      seller_id: product.seller_id,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setError(null);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<void> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete product");
      }

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image_url: "",
      stock_quantity: 0,
      is_active: true,
      seller_id: 1, // Default seller ID
    });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>🛍️ Products Management</CardTitle>
          <CardDescription>
            Manage your product catalog with full CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add Product Button */}
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                Add New Product
              </Button>
            )}

            {/* Add/Edit Product Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name *
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          required
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Price *
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Stock Quantity
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.stock_quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              stock_quantity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Image URL
                      </label>
                      <Input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="is_active"
                        className="text-sm font-medium"
                      >
                        Active
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading
                          ? "Saving..."
                          : editingProduct
                          ? "Update"
                          : "Create"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                Error: {error}
              </div>
            )}

            {/* Loading State */}
            {isLoading && !showAddForm && (
              <div className="text-gray-500 text-sm">Loading products...</div>
            )}

            {/* Products List */}
            <div className="space-y-4">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No products found. Add your first product above!
                </p>
              ) : (
                products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">
                              {product.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                product.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="font-medium">
                              ${product.price}
                            </span>
                            <span className="text-gray-500">
                              Category: {product.category}
                            </span>
                            <span className="text-gray-500">
                              Stock: {product.stock_quantity}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={loadProducts}
              disabled={isLoading}
            >
              Refresh Products
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
