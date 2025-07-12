"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

const PREDEFINED_QUERIES = [
  "Show me trending fashion items",
  "Best electronics under $500",
  "Eco-friendly home products",
  "Latest smartphone releases",
  "Comfortable running shoes",
  "Home office setup essentials"
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIMode, setIsAIMode] = useState(true);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Your Perfect
            <span className="block text-blue-600">Shopping Experience</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let AI help you find exactly what you're looking for from millions of products
          </p>
        </div>

        {/* AI Search Input */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">AI-Powered</span>
            </div>
            <Input
              placeholder="Ask me anything about products you want to find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-32 pr-20 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearch(searchQuery);
                }
              }}
            />
            <Button
              onClick={() => searchQuery.trim() && handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl px-6 py-2"
              disabled={!searchQuery.trim()}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Predefined Query Examples */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-4">Try these examples:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {PREDEFINED_QUERIES.map((query, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSearch(query)}
                className="rounded-full text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                {query}
              </Button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full mx-auto">
              <div className="w-1 h-3 bg-gray-400 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Scroll to explore</p>
        </div>
      </div>
    </section>
  );
}
