"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Helper function to format description with proper line breaks and bullet points
function formatDescription(description: string) {
  if (!description) return null;

  return description.split("\n").map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return <br key={index} />;

    // Handle headings like "Key Features:" and "Perfect for:"
    if (
      trimmedLine.toLowerCase().includes("key features:") ||
      trimmedLine.toLowerCase().includes("perfect for:")
    ) {
      return (
        <div
          key={index}
          className="font-bold text-xs leading-relaxed mt-2 mb-1"
        >
          {trimmedLine}
        </div>
      );
    }

    // Handle bullet points
    if (
      trimmedLine.startsWith("•") ||
      trimmedLine.startsWith("*") ||
      trimmedLine.startsWith("-")
    ) {
      return (
        <div key={index} className="flex items-start gap-1 text-xs">
          <span className="text-primary font-bold mt-0.5">•</span>
          <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
        </div>
      );
    }

    // Handle regular lines
    return (
      <div key={index} className="text-xs leading-relaxed">
        {trimmedLine}
      </div>
    );
  });
}

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

interface ProductGridProps {
  products: Product[];
  title: string;
  description?: string;
  showScores?: boolean;
}

export default function ProductGrid({
  products,
  title,
  description,
  showScores = false,
}: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex flex-col gap-1">
                  <Badge variant="secondary">${product.price}</Badge>
                  {product.stock > 0 ? (
                    <Badge variant="default">In Stock ({product.stock})</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>
              {showScores && (
                <div className="flex gap-2">
                  {product.similarityScore !== undefined && (
                    <Badge variant="outline">
                      Score: {(product.similarityScore * 100).toFixed(1)}%
                    </Badge>
                  )}
                  {product.confidence !== undefined && (
                    <Badge variant="outline">
                      Confidence: {(product.confidence * 100).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                {formatDescription(product.description)}
              </div>
              {product.reason && (
                <div className="mt-3 p-2 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">
                    <strong>Why recommended:</strong> {product.reason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
