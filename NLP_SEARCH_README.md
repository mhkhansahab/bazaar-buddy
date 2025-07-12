# NLP-Based Search Implementation

## Overview

This implementation adds natural language processing (NLP) capabilities to the Bazaar Buddy e-commerce platform, allowing users to search for products using natural language queries instead of traditional keyword-based search.

## Features

### Natural Language Understanding

The system can understand and parse various types of natural language queries:

- **Price ranges**: "under $40", "between $50 and $100", "less than $500"
- **Colors**: "black t-shirt", "red shoes", "blue jeans"
- **Categories**: "electronics", "clothing", "shoes", "accessories", "home", "sports"
- **Sizes**: "medium", "large", "XL", "small"
- **Brands**: "Nike", "Apple", "Samsung", "Adidas"
- **Materials**: "cotton", "leather", "polyester", "denim"

### Example Queries

- "I want to buy a black t-shirt under $40"
- "Show me red Nike sneakers"
- "Cotton dress between $50 and $100"
- "Gaming laptop under $1000"
- "Blue jeans size medium"
- "Apple iPhone under $800"

## Implementation Details

### Core Components

1. **NLP Search Library** (`src/lib/nlp-search.ts`)

   - `parseNaturalLanguageQuery()`: Parses natural language into structured filters
   - `searchProducts()`: Applies filters to product data
   - `buildSearchQuery()`: Converts filters back to search query format

2. **API Endpoint** (`src/app/api/search/nlp/route.ts`)

   - Handles POST and GET requests for NLP search
   - Returns filtered products with search metadata
   - Uses Prisma for database queries

3. **Search Results Page** (`src/app/search/page.tsx`)

   - Displays search results with AI understanding
   - Shows applied filters and metadata
   - Responsive grid layout for products

4. **Updated Hero Section** (`src/components/home/hero-section.tsx`)
   - Enhanced search input with NLP examples
   - Loading states and error handling
   - Navigation to search results

### Search Filters

The system extracts the following filters from natural language:

```typescript
interface SearchFilters {
  category?: string; // Product category
  color?: string; // Product color
  priceRange?: {
    // Price range
    min?: number;
    max?: number;
  };
  keywords: string[]; // Main search keywords
  size?: string; // Product size
  brand?: string; // Brand name
  material?: string; // Material type
}
```

### Supported Categories

- **Electronics**: phone, laptop, computer, tablet, headphones, camera, tv
- **Clothing**: shirt, t-shirt, pants, jeans, dress, skirt, jacket, hoodie
- **Shoes**: shoes, sneakers, boots, sandals, heels, flats
- **Accessories**: bag, purse, wallet, watch, jewelry, belt, scarf
- **Home**: furniture, sofa, chair, table, bed, lamp, mirror
- **Sports**: gym, fitness, running, basketball, soccer, tennis, yoga

### Supported Colors

black, white, red, blue, green, yellow, purple, pink, orange, brown, gray, grey, navy, maroon, teal, coral, beige, cream, gold, silver, bronze, transparent, clear

### Supported Brands

nike, adidas, apple, samsung, sony, lg, hp, dell

### Supported Materials

cotton, polyester, wool, silk, leather, denim, linen

## Usage

### Frontend Integration

```typescript
import { parseNaturalLanguageQuery } from "@/lib/nlp-search";

// Parse a natural language query
const filters = parseNaturalLanguageQuery("black t-shirt under $40");
console.log(filters);
// Output: {
//   category: "clothing",
//   color: "black",
//   priceRange: { max: 40 },
//   keywords: ["t-shirt"]
// }
```

### API Usage

```javascript
// GET request
const response = await fetch("/api/search/nlp?q=black t-shirt under $40");

// POST request
const response = await fetch("/api/search/nlp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "black t-shirt under $40" }),
});

const data = await response.json();
console.log(data.products); // Filtered products
console.log(data.searchMetadata); // Search analysis
```

## Custom Hook

A custom hook is provided for easy integration:

```typescript
import { useNLPSearch } from '@/hooks/use-nlp-search';

function MyComponent() {
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    performSearch,
    parsedFilters
  } = useNLPSearch();

  const handleSearch = async () => {
    await performSearch(searchQuery);
  };

  return (
    // Your search UI
  );
}
```

## Error Handling

The system includes comprehensive error handling:

- Invalid queries return appropriate error messages
- Network errors are caught and displayed to users
- Loading states prevent multiple simultaneous requests
- Graceful fallbacks for missing data

## Performance Considerations

- NLP parsing is done client-side for immediate feedback
- Database queries are optimized with proper indexing
- Results are cached to improve response times
- Pagination support for large result sets

## Future Enhancements

1. **Machine Learning Integration**: Use ML models for better query understanding
2. **Synonyms Support**: Handle variations in product names and descriptions
3. **Voice Search**: Add speech-to-text capabilities
4. **Search Suggestions**: Provide real-time search suggestions
5. **Advanced Filters**: Support for more complex queries and filters
6. **Search Analytics**: Track and analyze search patterns

## Testing

A test script is included (`test-nlp-search.js`) to verify the NLP functionality:

```bash
node test-nlp-search.js
```

This will test various query types and show the parsed filters for each.

## Dependencies

- Next.js 14+ for API routes and server-side rendering
- Prisma for database operations
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons
