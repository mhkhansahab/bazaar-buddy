"use client";

import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef } from "react";

// Mock data for different categories
const CATEGORIES_DATA = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest gadgets and tech accessories",
    products: [
      {
        id: "e1",
        title: "Latest Smartphone with 5G",
        price: 699.99,
        originalPrice: 899.99,
        rating: 4.6,
        reviewCount: 3200,
        image: "/placeholder-image.svg",
        discount: 22,
        category: "Electronics"
      },
      {
        id: "e2",
        title: "Gaming Laptop - High Performance",
        price: 1299.99,
        rating: 4.8,
        reviewCount: 850,
        image: "/placeholder-image.svg",
        isNew: true,
        category: "Electronics"
      },
      {
        id: "e3",
        title: "Wireless Charging Pad",
        price: 39.99,
        originalPrice: 59.99,
        rating: 4.4,
        reviewCount: 1200,
        image: "/placeholder-image.svg",
        discount: 33,
        category: "Electronics"
      },
      {
        id: "e4",
        title: "Smart Watch Series 9",
        price: 399.99,
        rating: 4.7,
        reviewCount: 2500,
        image: "/placeholder-image.svg",
        category: "Electronics"
      },
      {
        id: "e5",
        title: "Bluetooth Speaker - Premium Sound",
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.5,
        reviewCount: 890,
        image: "/placeholder-image.svg",
        discount: 25,
        category: "Electronics"
      }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Trending styles and seasonal collections",
    products: [
      {
        id: "f1",
        title: "Designer Jeans - Premium Denim",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.4,
        reviewCount: 650,
        image: "/placeholder-image.svg",
        discount: 31,
        category: "Fashion"
      },
      {
        id: "f2",
        title: "Elegant Evening Dress",
        price: 159.99,
        rating: 4.7,
        reviewCount: 420,
        image: "/placeholder-image.svg",
        isNew: true,
        category: "Fashion"
      },
      {
        id: "f3",
        title: "Casual Summer Sneakers",
        price: 79.99,
        rating: 4.6,
        reviewCount: 1100,
        image: "/placeholder-image.svg",
        category: "Fashion"
      },
      {
        id: "f4",
        title: "Leather Handbag - Vintage Style",
        price: 199.99,
        originalPrice: 299.99,
        rating: 4.8,
        reviewCount: 350,
        image: "/placeholder-image.svg",
        discount: 33,
        category: "Fashion"
      },
      {
        id: "f5",
        title: "Wool Winter Coat",
        price: 249.99,
        rating: 4.5,
        reviewCount: 290,
        image: "/placeholder-image.svg",
        category: "Fashion"
      }
    ]
  },
  {
    id: "home",
    name: "Home & Garden",
    description: "Transform your living space",
    products: [
      {
        id: "h1",
        title: "Smart Thermostat with WiFi",
        price: 179.99,
        originalPrice: 249.99,
        rating: 4.6,
        reviewCount: 1800,
        image: "/placeholder-image.svg",
        discount: 28,
        category: "Home & Garden"
      },
      {
        id: "h2",
        title: "Indoor Plant Collection Set",
        price: 49.99,
        rating: 4.7,
        reviewCount: 920,
        image: "/placeholder-image.svg",
        isNew: true,
        category: "Home & Garden"
      },
      {
        id: "h3",
        title: "Modern Table Lamp",
        price: 89.99,
        rating: 4.4,
        reviewCount: 560,
        image: "/placeholder-image.svg",
        category: "Home & Garden"
      },
      {
        id: "h4",
        title: "Ergonomic Office Chair",
        price: 299.99,
        originalPrice: 399.99,
        rating: 4.8,
        reviewCount: 740,
        image: "/placeholder-image.svg",
        discount: 25,
        category: "Home & Garden"
      },
      {
        id: "h5",
        title: "Kitchen Appliance Set",
        price: 199.99,
        rating: 4.5,
        reviewCount: 450,
        image: "/placeholder-image.svg",
        category: "Home & Garden"
      }
    ]
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Gear up for your active lifestyle",
    products: [
      {
        id: "s1",
        title: "Professional Yoga Mat",
        price: 49.99,
        originalPrice: 79.99,
        rating: 4.7,
        reviewCount: 1200,
        image: "/placeholder-image.svg",
        discount: 38,
        category: "Sports & Fitness"
      },
      {
        id: "s2",
        title: "Adjustable Dumbbells Set",
        price: 299.99,
        rating: 4.8,
        reviewCount: 650,
        image: "/placeholder-image.svg",
        isNew: true,
        category: "Sports & Fitness"
      },
      {
        id: "s3",
        title: "Running Shoes - Ultra Comfort",
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.6,
        reviewCount: 2100,
        image: "/placeholder-image.svg",
        discount: 28,
        category: "Sports & Fitness"
      },
      {
        id: "s4",
        title: "Protein Shake Bottle",
        price: 24.99,
        rating: 4.4,
        reviewCount: 890,
        image: "/placeholder-image.svg",
        category: "Sports & Fitness"
      },
      {
        id: "s5",
        title: "Resistance Bands Set",
        price: 39.99,
        rating: 4.5,
        reviewCount: 750,
        image: "/placeholder-image.svg",
        category: "Sports & Fitness"
      }
    ]
  }
];

interface CategorySectionProps {
  category: typeof CATEGORIES_DATA[0];
}

function CategorySection({ category }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-16">
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {category.name}
          </h3>
          <p className="text-gray-600">{category.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('left')}
              className="rounded-full p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('right')}
              className="rounded-full p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scrolling Products */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {category.products.map((product) => (
          <div key={product.id} className="flex-none w-64">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategorySections() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover products across all categories
          </p>
        </div>

        {/* Category Sections */}
        {CATEGORIES_DATA.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
