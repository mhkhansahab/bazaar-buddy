"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">
              bazaar buddy
            </div>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className={`relative transition-all duration-200 ${
              isSearchFocused ? 'shadow-lg' : 'shadow-sm'
            }`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for products, brands, or categories..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Actions - Right */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Globe className="h-4 w-4 mr-2" />
              EN
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>

            {/* Account */}
            <div className="flex items-center space-x-2">
              <Link href="/seller/login">
                <Button variant="outline" size="sm">
                  Sell
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  Account
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
