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
  imageUrl?: string;
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
          <Card
            key={product.id}
            className="group relative flex flex-col justify-between overflow-hidden bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-muted"
          >
            {product.imageUrl ? (
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-black hover:bg-white backdrop-blur-sm shadow-sm font-bold px-3 py-1"
                  >
                    ${product.price}
                  </Badge>
                  {product.stock > 0 ? (
                    <Badge
                      variant="default"
                      className="bg-green-500/90 hover:bg-green-500 text-white backdrop-blur-sm shadow-sm"
                    >
                      {product.stock} in stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="shadow-sm">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-20 w-full items-center justify-between bg-muted/50 p-4 border-b">
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary" className="font-bold px-3 py-1">
                    ${product.price}
                  </Badge>
                  {product.stock > 0 ? (
                    <Badge
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {product.stock} in stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>
            )}

            <CardHeader
              className={`relative z-10 ${product.imageUrl ? "-mt-4 pt-6 bg-card rounded-t-xl" : ""} pb-2`}
            >
              <div className="flex flex-col gap-2">
                <CardTitle className="text-xl font-bold leading-tight text-foreground line-clamp-2">
                  {product.name}
                </CardTitle>
              </div>

              {showScores && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.similarityScore !== undefined && (
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/20"
                    >
                      Match: {(product.similarityScore * 100).toFixed(0)}%
                    </Badge>
                  )}
                  {product.confidence !== undefined && (
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/20"
                    >
                      Confidence: {(product.confidence * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pb-6">
              <div className="text-sm font-medium text-muted-foreground space-y-2 mb-4">
                {formatDescription(product.description)}
              </div>
              {product.reason && (
                <div className="mt-auto border-t pt-4">
                  <div className="flex items-start gap-2 bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div className="mt-0.5">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                      <strong className="block text-blue-900 dark:text-blue-200 mb-0.5">
                        Recommended
                      </strong>
                      {product.reason}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
