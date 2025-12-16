"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { semanticSearch } from "@/app/actions/shopping";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  similarityScore?: number;
}

interface SearchBarProps {
  onSearchResults: (results: Product[]) => void;
}

export default function SearchBar({ onSearchResults }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const result = await semanticSearch(searchQuery);
      if (result.success) {
        onSearchResults(result.data || []);
      } else {
        console.error("Search failed:", result.error);
        onSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      onSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Product Search
        </CardTitle>
        <CardDescription>
          Search for products using semantic search
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for products (e.g., accessories for office)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
