"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Globe, ChevronDown, Grid3X3, Smartphone, Shirt, Home, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { getTotalItems } = useCart();

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
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Categories
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/category/electronics">
                  <DropdownMenuItem className="cursor-pointer">
                    <Smartphone className="h-4 w-4 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Electronics</div>
                      <div className="text-xs text-gray-500">Gadgets, phones, laptops</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/category/fashion">
                  <DropdownMenuItem className="cursor-pointer">
                    <Shirt className="h-4 w-4 mr-3 text-pink-600" />
                    <div>
                      <div className="font-medium">Fashion</div>
                      <div className="text-xs text-gray-500">Clothing, shoes, accessories</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/category/home">
                  <DropdownMenuItem className="cursor-pointer">
                    <Home className="h-4 w-4 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">Home & Garden</div>
                      <div className="text-xs text-gray-500">Furniture, decor, plants</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/category/sports">
                  <DropdownMenuItem className="cursor-pointer">
                    <Dumbbell className="h-4 w-4 mr-3 text-orange-600" />
                    <div>
                      <div className="font-medium">Sports & Fitness</div>
                      <div className="text-xs text-gray-500">Equipment, sportswear</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/category/all">
                  <DropdownMenuItem className="cursor-pointer">
                    <Grid3X3 className="h-4 w-4 mr-3 text-gray-600" />
                    <div className="font-medium">All Categories</div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <Button variant="ghost" size="sm" className="hidden lg:flex">
              <Globe className="h-4 w-4 mr-2" />
              EN
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-2">
                  <div className="text-sm font-medium text-gray-900 mb-2">Categories</div>
                </div>
                <Link href="/category/electronics">
                  <DropdownMenuItem className="cursor-pointer">
                    <Smartphone className="h-4 w-4 mr-3 text-blue-600" />
                    Electronics
                  </DropdownMenuItem>
                </Link>
                <Link href="/category/fashion">
                  <DropdownMenuItem className="cursor-pointer">
                    <Shirt className="h-4 w-4 mr-3 text-pink-600" />
                    Fashion
                  </DropdownMenuItem>
                </Link>
                <Link href="/category/home">
                  <DropdownMenuItem className="cursor-pointer">
                    <Home className="h-4 w-4 mr-3 text-green-600" />
                    Home & Garden
                  </DropdownMenuItem>
                </Link>
                <Link href="/category/sports">
                  <DropdownMenuItem className="cursor-pointer">
                    <Dumbbell className="h-4 w-4 mr-3 text-orange-600" />
                    Sports & Fitness
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/category/all">
                  <DropdownMenuItem className="cursor-pointer">
                    <Grid3X3 className="h-4 w-4 mr-3 text-gray-600" />
                    All Categories
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Globe className="h-4 w-4 mr-3" />
                  Language: EN
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
