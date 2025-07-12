import { useState, useCallback } from "react";
import { parseNaturalLanguageQuery, SearchFilters } from "@/lib/nlp-search";

interface UseNLPSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  searchResults: any[];
  searchMetadata: any;
  error: string | null;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  parsedFilters: SearchFilters | null;
}

export function useNLPSearch(): UseNLPSearchReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchMetadata, setSearchMetadata] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [parsedFilters, setParsedFilters] = useState<SearchFilters | null>(
    null
  );

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      // Parse the natural language query
      const filters = parseNaturalLanguageQuery(query);
      setParsedFilters(filters);

      // Make API call to search endpoint
      const response = await fetch(
        `/api/search/nlp?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.products);
      setSearchMetadata(data.searchMetadata);
    } catch (err) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchMetadata(null);
    setError(null);
    setParsedFilters(null);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    searchMetadata,
    error,
    performSearch,
    clearSearch,
    parsedFilters,
  };
}
