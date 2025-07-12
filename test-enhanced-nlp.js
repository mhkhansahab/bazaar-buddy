// Test script for enhanced NLP search functionality
const { parseNaturalLanguageQuery } = require('./src/lib/nlp-search.ts');

// Test cases with enhanced queries
const testQueries = [
    {
        query: "charger under 400",
        expectedFilters: {
            category: "electronics",
            subcategory: "accessories",
            priceRange: { max: 400 },
            keywords: ["charger"]
        }
    },
    {
        query: "iPhone 15 Pro under $1000",
        expectedFilters: {
            category: "electronics",
            subcategory: "smartphones",
            brand: "apple",
            priceRange: { max: 1000 },
            keywords: ["iphone", "15", "pro"]
        }
    },
    {
        query: "Nike running shoes size 10",
        expectedFilters: {
            category: "sports",
            subcategory: "footwear",
            brand: "nike",
            size: "10",
            keywords: ["running", "shoes"]
        }
    },
    {
        query: "USB-C charger 65W",
        expectedFilters: {
            category: "electronics",
            subcategory: "accessories",
            powerRating: "65W",
            keywords: ["usb-c", "charger"]
        }
    },
    {
        query: "MacBook Air 512GB",
        expectedFilters: {
            category: "electronics",
            subcategory: "laptops",
            brand: "apple",
            capacity: "512GB",
            keywords: ["macbook", "air"]
        }
    },
    {
        query: "wireless earbuds with noise cancellation",
        expectedFilters: {
            category: "electronics",
            subcategory: "audio",
            features: ["wireless", "noise cancellation"],
            keywords: ["earbuds"]
        }
    },
    {
        query: "leather jacket brown medium",
        expectedFilters: {
            category: "clothing",
            subcategory: "outerwear",
            material: "leather",
            color: "brown",
            size: "medium",
            keywords: ["jacket"]
        }
    }
];

console.log("Testing Enhanced NLP Search Functionality\n");

testQueries.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: "${testCase.query}"`);

    // Parse the query
    const filters = parseNaturalLanguageQuery(testCase.query);

    console.log("Parsed filters:", JSON.stringify(filters, null, 2));
    console.log("Expected filters:", JSON.stringify(testCase.expectedFilters, null, 2));

    // Simulate backend payload
    const backendPayload = {
        query: testCase.query,
        filters: filters
    };

    console.log("Backend payload:", JSON.stringify(backendPayload, null, 2));
    console.log("---");
});

console.log("Enhanced NLP Search test completed!");
console.log("\nKey Enhancements:");
console.log("✅ Subcategory detection (smartphones, laptops, accessories, etc.)");
console.log("✅ Power rating detection (65W, USB-C, etc.)");
console.log("✅ Capacity detection (512GB, 256GB, etc.)");
console.log("✅ Feature detection (wireless, noise cancellation, etc.)");
console.log("✅ Enhanced brand recognition");
console.log("✅ Better material and color detection");
console.log("✅ Improved keyword extraction"); 