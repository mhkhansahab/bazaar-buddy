// Test script for Supabase NLP search integration
const { parseNaturalLanguageQuery } = require('./src/lib/nlp-search.ts');

// Test the API endpoint with Supabase
async function testSupabaseNLP() {
    const testQueries = [
        "black t-shirt under $40",
        "red Nike sneakers",
        "cotton dress between $50 and $100",
        "gaming laptop under $1000"
    ];

    console.log("Testing Supabase NLP Search Integration\n");

    for (let i = 0; i < testQueries.length; i++) {
        const query = testQueries[i];
        console.log(`Test ${i + 1}: "${query}"`);

        // Parse the query
        const filters = parseNaturalLanguageQuery(query);

        console.log("Parsed filters:", JSON.stringify(filters, null, 2));

        // Simulate the API call payload
        const payload = {
            query: query,
            filters: filters
        };

        console.log("API Payload:", JSON.stringify(payload, null, 2));
        console.log("---");
    }

    console.log("Supabase NLP Search test completed!");
    console.log("\nTo test the actual API:");
    console.log("1. Start your Next.js server: npm run dev");
    console.log("2. Send POST request to http://localhost:3000/api/search/nlp");
    console.log("3. Use the payload above in the request body");
    console.log("4. Check the response for filtered products from Supabase");
}

testSupabaseNLP().catch(console.error); 