import { fetchGraphQL } from "@/lib/graphql";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Layers,
  FileText,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

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
          className="font-bold text-base leading-relaxed mt-3 mb-1"
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
        <div key={index} className="flex items-start gap-2 ml-2">
          <span className="text-primary font-bold mt-1">•</span>
          <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
        </div>
      );
    }

    // Handle regular lines
    return (
      <div key={index} className="leading-relaxed">
        {trimmedLine}
      </div>
    );
  });
}

export default async function ViewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product } = await fetchGraphQL(
    `query GetProduct($id: String!) { 
      product(id: $id) { 
        id 
        name 
        description
        price 
        stock 
        createdAt 
      } 
    }`,
    { id }
  );

  if (!product) {
    return <div className="p-6 text-center">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </Link>
        <Link href={`/dashboard/products/${id}`}>
          <Button size="sm">Edit Product</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {product.description && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </div>
                  <div className="text-base space-y-2">
                    {formatDescription(product.description)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Price
                </div>
                <div className="text-base font-semibold">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Stock
                </div>
                <div className="text-base">
                  {product.stock} units
                  {product.stock < 10 && (
                    <span className="ml-2 text-xs text-red-500 font-medium">
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {product.createdAt && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Created At
                  </div>
                  <div className="text-base">
                    {new Date(product.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Product ID: {product.id}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
