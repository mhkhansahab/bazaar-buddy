"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Upload, 
  Sparkles, 
  Save, 
  Eye,
  X,
  Camera,
  FileImage,
  Loader2
} from "lucide-react";

export function AddProductPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "ai">("ai");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    title: string;
    description: string;
    category: string;
    suggestedPrice: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    sku: "",
    brand: "",
    tags: ""
  });

  const categories = [
    "Automotive",
    "Beauty & Personal Care",
    "Books",
    "Clothing",
    "Electronics",
    "Health & Wellness",
    "Home & Garden",
    "Kitchen & Dining",
    "Sports",
    "Toys & Games"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImages(prev => [...prev, reader.result as string]);
          
          // Simulate AI processing when first image is uploaded
          if (uploadedImages.length === 0 && activeTab === "ai") {
            setIsAIProcessing(true);
            setTimeout(() => {
              setAiSuggestions({
                title: "Wireless Bluetooth Headphones - Premium Sound Quality",
                description: "High-quality wireless headphones featuring advanced Bluetooth technology, premium drivers for exceptional sound quality, comfortable over-ear design with soft padding, and long-lasting battery life. Perfect for music enthusiasts, gamers, and professionals who demand superior audio performance.",
                category: "Electronics",
                suggestedPrice: 89.99
              });
              setIsAIProcessing(false);
            }, 2000);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const applyAISuggestions = () => {
    if (aiSuggestions) {
      setFormData({
        ...formData,
        title: aiSuggestions.title,
        description: aiSuggestions.description,
        category: aiSuggestions.category,
        price: aiSuggestions.suggestedPrice.toString()
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement product creation
    console.log("Creating product:", { ...formData, images: uploadedImages });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/seller/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button form="product-form" type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Method Selection Tabs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Choose Your Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={activeTab === "ai" ? "default" : "outline"}
                onClick={() => setActiveTab("ai")}
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Listing (Recommended)
              </Button>
              <Button
                variant={activeTab === "manual" ? "default" : "outline"}
                onClick={() => setActiveTab("manual")}
                className="flex-1"
              >
                <FileImage className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {activeTab === "ai" 
                  ? "Upload product images and let our AI suggest titles, descriptions, and categories automatically."
                  : "Fill in all product details manually for complete control over your listing."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload Product Images
                  </p>
                  <p className="text-gray-600">
                    Drag and drop images here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG up to 10MB each (Max 10 images)
                  </p>
                </label>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Uploaded Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Suggestions (only show when AI tab is active and we have suggestions) */}
          {activeTab === "ai" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAIProcessing ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600">Analyzing your images...</span>
                  </div>
                ) : aiSuggestions ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">AI Analysis Complete!</h4>
                      <p className="text-sm text-green-700">
                        Based on your uploaded images, here are our suggestions:
                      </p>
                    </div>
                    
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suggested Title
                        </label>
                        <p className="p-3 bg-gray-50 rounded border text-gray-900">
                          {aiSuggestions.title}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Suggested Description
                        </label>
                        <p className="p-3 bg-gray-50 rounded border text-gray-900 text-sm leading-relaxed">
                          {aiSuggestions.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <p className="p-3 bg-gray-50 rounded border text-gray-900">
                            {aiSuggestions.category}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Suggested Price
                          </label>
                          <p className="p-3 bg-gray-50 rounded border text-gray-900">
                            ${aiSuggestions.suggestedPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={applyAISuggestions} className="w-full">
                      Apply AI Suggestions
                    </Button>
                  </div>
                ) : uploadedImages.length > 0 ? (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Upload an image to get AI suggestions</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Upload product images to see AI suggestions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Product Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter product title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your product in detail"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Stock and SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU (Optional)
                  </label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="Product SKU"
                  />
                </div>
              </div>

              {/* Brand and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand (Optional)
                  </label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="comma, separated, tags"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
