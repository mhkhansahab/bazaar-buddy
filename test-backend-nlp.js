// Test script for backend NLP search integration
const { parseNaturalLanguageQuery } = require('./src/lib/nlp-search.ts');

// Test cases with expected backend behavior
const testQueries = [
    {
        query: "I want to buy a black t-shirt under $40",
        expectedFilters: {
            category: "clothing",
            color: "black",
            priceRange: { max: 40 },
            keywords: ["t-shirt"]
        }
    },
    {
        query: "Show me red Nike sneakers",
        expectedFilters: {
            category: "sports",
            color: "red",
            brand: "nike",
            keywords: ["sneakers"]
        }
    },
    {
        query: "Cotton dress between $50 and $100",
        expectedFilters: {
            category: "clothing",
            material: "cotton",
            priceRange: { min: 50, max: 100 },
            keywords: ["dress"]
        }
    },
    {
        query: "Gaming laptop under $1000",
        expectedFilters: {
            category: "electronics",
            priceRange: { max: 1000 },
            keywords: ["gaming", "laptop"]
        }
    }
];

console.log("Testing Backend NLP Search Integration\n");

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

console.log("Backend NLP Search test completed!");
console.log("\nTo test the actual API:");
console.log("1. Start your Next.js server");
console.log("2. Send POST request to /api/search/nlp with the payload above");
console.log("3. Check the response for filtered products"); 