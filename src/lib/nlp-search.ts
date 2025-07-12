export interface SearchFilters {
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

export function parseNaturalLanguageQuery(query: string): SearchFilters {
  const filters: SearchFilters = {
    keywords: [],
  };

  const lowerQuery = query.toLowerCase();

  // Extract price range
  const priceMatches = lowerQuery.match(
    /(?:under|below|less than|up to|maximum|max)\s*\$?(\d+)/
  );
  if (priceMatches) {
    filters.priceRange = { max: parseInt(priceMatches[1]) };
  }

  const priceRangeMatches = lowerQuery.match(
    /(?:between|from)\s*\$?(\d+)\s*(?:and|to)\s*\$?(\d+)/
  );
  if (priceRangeMatches) {
    filters.priceRange = {
      min: parseInt(priceRangeMatches[1]),
      max: parseInt(priceRangeMatches[2]),
    };
  }

  // Extract colors
  const colors = [
    "black",
    "white",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "orange",
    "brown",
    "gray",
    "grey",
    "navy",
    "maroon",
    "teal",
    "coral",
    "beige",
    "cream",
    "gold",
    "silver",
    "bronze",
    "transparent",
    "clear",
  ];

  for (const color of colors) {
    if (lowerQuery.includes(color)) {
      filters.color = color;
      break;
    }
  }

  // Extract categories
  const categoryKeywords = {
    electronics: [
      "phone",
      "laptop",
      "computer",
      "tablet",
      "headphones",
      "camera",
      "tv",
      "television",
    ],
    clothing: [
      "shirt",
      "t-shirt",
      "pants",
      "jeans",
      "dress",
      "skirt",
      "jacket",
      "hoodie",
      "sweater",
    ],
    shoes: ["shoes", "sneakers", "boots", "sandals", "heels", "flats"],
    accessories: [
      "bag",
      "purse",
      "wallet",
      "watch",
      "jewelry",
      "belt",
      "scarf",
    ],
    home: ["furniture", "sofa", "chair", "table", "bed", "lamp", "mirror"],
    sports: [
      "gym",
      "fitness",
      "running",
      "basketball",
      "soccer",
      "tennis",
      "yoga",
    ],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        filters.category = category;
        break;
      }
    }
    if (filters.category) break;
  }

  // Extract sizes
  const sizes = ["xs", "s", "m", "l", "xl", "xxl", "small", "medium", "large"];
  for (const size of sizes) {
    if (lowerQuery.includes(size)) {
      filters.size = size;
      break;
    }
  }

  // Extract materials
  const materials = [
    "cotton",
    "polyester",
    "wool",
    "silk",
    "leather",
    "denim",
    "linen",
  ];
  for (const material of materials) {
    if (lowerQuery.includes(material)) {
      filters.material = material;
      break;
    }
  }

  // Extract brands (common brand names)
  const brands = [
    "nike",
    "adidas",
    "apple",
    "samsung",
    "sony",
    "lg",
    "hp",
    "dell",
  ];
  for (const brand of brands) {
    if (lowerQuery.includes(brand)) {
      filters.brand = brand;
      break;
    }
  }

  // Extract main keywords (remove common words and keep product-specific terms)
  const commonWords = [
    "i",
    "want",
    "to",
    "buy",
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "for",
    "of",
    "with",
    "by",
    "under",
    "below",
    "above",
    "over",
    "between",
    "from",
    "to",
    "up",
    "down",
    "out",
    "off",
    "through",
    "during",
    "before",
    "after",
    "since",
    "until",
    "while",
    "where",
    "why",
    "how",
    "what",
    "when",
    "who",
    "which",
    "that",
    "this",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "must",
    "shall",
    "dollar",
    "dollars",
    "$",
  ];

  const words = query.toLowerCase().split(/\s+/);
  filters.keywords = words.filter(
    (word) =>
      !commonWords.includes(word) &&
      word.length > 2 &&
      !colors.includes(word) &&
      !sizes.includes(word) &&
      !materials.includes(word) &&
      !brands.includes(word)
  );

  return filters;
}

export function buildSearchQuery(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.category) {
    parts.push(`category:${filters.category}`);
  }

  if (filters.color) {
    parts.push(`color:${filters.color}`);
  }

  if (filters.priceRange) {
    if (filters.priceRange.min && filters.priceRange.max) {
      parts.push(`price:${filters.priceRange.min}-${filters.priceRange.max}`);
    } else if (filters.priceRange.max) {
      parts.push(`price:0-${filters.priceRange.max}`);
    }
  }

  if (filters.size) {
    parts.push(`size:${filters.size}`);
  }

  if (filters.brand) {
    parts.push(`brand:${filters.brand}`);
  }

  if (filters.material) {
    parts.push(`material:${filters.material}`);
  }

  if (filters.keywords.length > 0) {
    parts.push(`keywords:${filters.keywords.join(" ")}`);
  }

  return parts.join(" ");
}

export function searchProducts(filters: SearchFilters, products: any[]): any[] {
  return products.filter((product) => {
    // Category filter
    if (
      filters.category &&
      product.category?.toLowerCase() !== filters.category
    ) {
      return false;
    }

    // Price filter
    if (filters.priceRange) {
      const price = parseFloat(product.price);
      if (filters.priceRange.min && price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max && price > filters.priceRange.max) {
        return false;
      }
    }

    // Color filter (check in name and description)
    if (filters.color) {
      const productText =
        `${product.name} ${product.description}`.toLowerCase();
      if (!productText.includes(filters.color)) {
        return false;
      }
    }

    // Size filter
    if (filters.size) {
      const productText =
        `${product.name} ${product.description}`.toLowerCase();
      if (!productText.includes(filters.size)) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand) {
      const productText =
        `${product.name} ${product.description}`.toLowerCase();
      if (!productText.includes(filters.brand)) {
        return false;
      }
    }

    // Material filter
    if (filters.material) {
      const productText =
        `${product.name} ${product.description}`.toLowerCase();
      if (!productText.includes(filters.material)) {
        return false;
      }
    }

    // Keywords filter
    if (filters.keywords.length > 0) {
      const productText =
        `${product.name} ${product.description}`.toLowerCase();
      const hasKeyword = filters.keywords.some((keyword) =>
        productText.includes(keyword)
      );
      if (!hasKeyword) {
        return false;
      }
    }

    return true;
  });
}
