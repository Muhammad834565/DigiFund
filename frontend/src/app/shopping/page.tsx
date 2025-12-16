"use client";

import { useState, useEffect } from "react";
import { getRecommendations } from "@/app/actions/shopping";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  similarityScore?: number;
  confidence?: number;
  reason?: string;
}

export default function ShoppingPage() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const result = await getRecommendations();
        if (result.success) {
          setRecommendations(result.data || []);
        } else {
          setError(result.error || "Failed to load recommendations");
        }
      } catch (err) {
        setError("Failed to load recommendations");
        console.error("Error loading recommendations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleSearchResults = (results: Product[]) => {
    setSearchResults(results);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Shopping</h1>
        <p className="text-lg text-muted-foreground">
          Discover products with AI-powered recommendations and semantic search
        </p>
      </div>

      {/* Search Section */}
      <SearchBar onSearchResults={handleSearchResults} />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <ProductGrid
          products={searchResults}
          title="Search Results"
          description="Products matching your search query"
          showScores={true}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <p className="text-destructive font-medium">Error: {error}</p>
        </div>
      )}

      {/* Recommendations Section */}
      {!error && (
        <ProductGrid
          products={recommendations}
          title="Recommended for You"
          description="Personalized product recommendations based on your preferences"
          showScores={true}
        />
      )}
    </div>
  );
}
