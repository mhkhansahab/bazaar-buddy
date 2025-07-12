// Test script for NLP search functionality
const { parseNaturalLanguageQuery } = require('./src/lib/nlp-search.ts');

// Test cases
const testQueries = [
    "I want to buy a black t-shirt under $40",
    "Show me red Nike sneakers",
    "Cotton dress between $50 and $100",
    "Gaming laptop under $1000",
    "Blue jeans size medium",
    "Apple iPhone under $800",
    "Leather wallet under $30",
    "Running shoes for men"
];

console.log("Testing NLP Search Functionality\n");

testQueries.forEach((query, index) => {
    console.log(`Test ${index + 1}: "${query}"`);
    const filters = parseNaturalLanguageQuery(query);
    console.log("Parsed filters:", JSON.stringify(filters, null, 2));
    console.log("---");
});

console.log("NLP Search test completed!"); 