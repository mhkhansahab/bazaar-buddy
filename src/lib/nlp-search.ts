export interface SearchFilters {
  category?: string;
  subcategory?: string;
  color?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  keywords: string[];
  size?: string;
  brand?: string;
  material?: string;
  powerRating?: string;
  capacity?: string;
  features?: string[];
  tags?: string[];
}

export function parseNaturalLanguageQuery(query: string): SearchFilters {
  const filters: SearchFilters = {
    keywords: [],
  };

  const lowerQuery = query.toLowerCase();

  // Extract price range with more patterns
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

  // Extract colors with more variations
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
    "titanium",
    "space gray",
    "midnight",
    "starlight",
    "rose gold",
  ];

  for (const color of colors) {
    if (lowerQuery.includes(color)) {
      filters.color = color;
      break;
    }
  }

  // Enhanced category detection with subcategories
  const categoryKeywords = {
    electronics: {
      keywords: [
        "phone",
        "laptop",
        "computer",
        "tablet",
        "headphones",
        "camera",
        "tv",
        "television",
        "charger",
        "adapter",
        "power",
        "cable",
        "wire",
        "earbuds",
        "speaker",
        "monitor",
        "keyboard",
        "mouse",
      ],
      subcategories: {
        smartphones: ["phone", "smartphone", "iphone", "android", "mobile"],
        laptops: ["laptop", "macbook", "notebook", "computer"],
        accessories: ["charger", "adapter", "cable", "wire", "power"],
        audio: ["headphones", "earbuds", "speaker", "audio"],
        gaming: ["gaming", "game", "console", "controller"],
      },
    },
    clothing: {
      keywords: [
        "shirt",
        "t-shirt",
        "pants",
        "jeans",
        "dress",
        "skirt",
        "jacket",
        "hoodie",
        "sweater",
        "shoes",
        "sneakers",
        "boots",
        "sandals",
      ],
      subcategories: {
        tops: ["shirt", "t-shirt", "blouse", "sweater", "hoodie"],
        bottoms: ["pants", "jeans", "shorts", "skirt"],
        outerwear: ["jacket", "coat", "blazer"],
        footwear: ["shoes", "sneakers", "boots", "sandals", "heels"],
      },
    },
    sports: {
      keywords: [
        "gym",
        "fitness",
        "running",
        "basketball",
        "soccer",
        "tennis",
        "yoga",
        "workout",
        "exercise",
        "training",
      ],
      subcategories: {
        footwear: ["running", "sneakers", "athletic", "training"],
        equipment: ["racket", "ball", "equipment", "gear"],
        fitness: ["yoga", "gym", "workout", "exercise"],
      },
    },
    automotive: {
      keywords: [
        "car",
        "vehicle",
        "auto",
        "automotive",
        "dash",
        "mount",
        "holder",
      ],
      subcategories: {
        accessories: ["mount", "holder", "charger", "camera"],
        electronics: ["dash", "cam", "camera", "gps"],
        parts: ["parts", "component", "replacement"],
      },
    },
    home: {
      keywords: [
        "furniture",
        "sofa",
        "chair",
        "table",
        "bed",
        "lamp",
        "mirror",
        "garden",
        "tool",
        "lighting",
      ],
      subcategories: {
        furniture: ["sofa", "chair", "table", "bed", "furniture"],
        lighting: ["lamp", "light", "lighting", "bulb"],
        garden: ["garden", "tool", "outdoor", "plant"],
      },
    },
  };

  // Find category and subcategory
  for (const [category, categoryData] of Object.entries(categoryKeywords)) {
    for (const keyword of categoryData.keywords) {
      if (lowerQuery.includes(keyword)) {
        filters.category = category;

        // Check for subcategory
        for (const [subcategory, subcategoryKeywords] of Object.entries(
          categoryData.subcategories
        )) {
          for (const subKeyword of subcategoryKeywords) {
            if (lowerQuery.includes(subKeyword)) {
              filters.subcategory = subcategory;
              break;
            }
          }
          if (filters.subcategory) break;
        }
        break;
      }
    }
    if (filters.category) break;
  }

  // Extract sizes with more variations
  const sizes = [
    "xs",
    "s",
    "m",
    "l",
    "xl",
    "xxl",
    "small",
    "medium",
    "large",
    "extra small",
    "extra large",
  ];
  for (const size of sizes) {
    if (lowerQuery.includes(size)) {
      filters.size = size;
      break;
    }
  }

  // Extract materials with more variations
  const materials = [
    "cotton",
    "polyester",
    "wool",
    "silk",
    "leather",
    "denim",
    "linen",
    "mesh",
    "aluminum",
    "metal",
    "plastic",
    "glass",
    "graphite",
    "pvc",
  ];
  for (const material of materials) {
    if (lowerQuery.includes(material)) {
      filters.material = material;
      break;
    }
  }

  // Extract brands with more variations
  const brands = [
    "nike",
    "adidas",
    "apple",
    "samsung",
    "sony",
    "lg",
    "hp",
    "dell",
    "anker",
    "philips",
    "wilson",
    "lululemon",
    "iottie",
    "garmin",
    "fiskars",
    "schott",
  ];
  for (const brand of brands) {
    if (lowerQuery.includes(brand)) {
      filters.brand = brand;
      break;
    }
  }

  // Extract power ratings and capacity
  const powerPatterns = [
    { pattern: /(\d+)w/i, type: "power" },
    { pattern: /(\d+)watt/i, type: "power" },
    { pattern: /(\d+)gb/i, type: "capacity" },
    { pattern: /(\d+)tb/i, type: "capacity" },
    { pattern: /usb-c/i, type: "power" },
    { pattern: /(\d+)v/i, type: "power" },
  ];

  for (const pattern of powerPatterns) {
    const match = lowerQuery.match(pattern.pattern);
    if (match) {
      if (pattern.type === "power") {
        filters.powerRating = match[0];
      } else if (pattern.type === "capacity") {
        filters.capacity = match[0];
      }
    }
  }

  // Extract features and tags
  const features = [
    "wireless",
    "bluetooth",
    "fast charging",
    "noise cancellation",
    "touch controls",
    "face id",
    "fingerprint",
    "5g",
    "retina",
    "hd",
    "gps",
    "wifi",
  ];
  const foundFeatures: string[] = [];
  for (const feature of features) {
    if (lowerQuery.includes(feature)) {
      foundFeatures.push(feature);
    }
  }
  if (foundFeatures.length > 0) {
    filters.features = foundFeatures;
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
    "show",
    "me",
    "get",
    "find",
    "search",
    "look",
    "for",
  ];

  const words = query.toLowerCase().split(/\s+/);
  filters.keywords = words.filter(
    (word) =>
      !commonWords.includes(word) &&
      word.length > 2 &&
      !colors.includes(word) &&
      !sizes.includes(word) &&
      !materials.includes(word) &&
      !brands.includes(word) &&
      !features.includes(word)
  );

  return filters;
}

export function buildSearchQuery(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.category) {
    parts.push(`category:${filters.category}`);
  }

  if (filters.subcategory) {
    parts.push(`subcategory:${filters.subcategory}`);
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

  if (filters.powerRating) {
    parts.push(`power:${filters.powerRating}`);
  }

  if (filters.capacity) {
    parts.push(`capacity:${filters.capacity}`);
  }

  if (filters.features && filters.features.length > 0) {
    parts.push(`features:${filters.features.join(",")}`);
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

    // Subcategory filter
    if (
      filters.subcategory &&
      product.subcategory?.toLowerCase() !== filters.subcategory
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

    // Color filter (check in name, description, and color field)
    if (filters.color) {
      const productText = `${product.name} ${product.description} ${
        product.color || ""
      }`.toLowerCase();
      if (!productText.includes(filters.color)) {
        return false;
      }
    }

    // Size filter
    if (filters.size) {
      const productText = `${product.name} ${product.description} ${
        product.size || ""
      }`.toLowerCase();
      if (!productText.includes(filters.size)) {
        return false;
      }
    }

    // Brand filter
    if (filters.brand) {
      const productText = `${product.name} ${product.description} ${
        product.brand || ""
      }`.toLowerCase();
      if (!productText.includes(filters.brand)) {
        return false;
      }
    }

    // Material filter
    if (filters.material) {
      const productText = `${product.name} ${product.description} ${
        product.material || ""
      }`.toLowerCase();
      if (!productText.includes(filters.material)) {
        return false;
      }
    }

    // Power rating filter
    if (filters.powerRating) {
      const productText = `${product.name} ${product.description} ${
        product.power_rating || ""
      }`.toLowerCase();
      if (!productText.includes(filters.powerRating.toLowerCase())) {
        return false;
      }
    }

    // Capacity filter
    if (filters.capacity) {
      const productText = `${product.name} ${product.description} ${
        product.capacity || ""
      }`.toLowerCase();
      if (!productText.includes(filters.capacity.toLowerCase())) {
        return false;
      }
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      const productFeatures = product.features || [];
      const hasFeature = filters.features.some((feature) =>
        productFeatures.some((pf: string) =>
          pf.toLowerCase().includes(feature.toLowerCase())
        )
      );
      if (!hasFeature) {
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
