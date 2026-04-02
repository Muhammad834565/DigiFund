
$content = @"
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCustomerMutation, useCreateInvoiceMutation, InvoiceType, InvoiceStatus } from "@/graphql/generated/graphql";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

// Helper function to format description with proper line breaks and bullet points
function formatDescription(description: string) {
  if (!description) return null;

  return description.split("\n").map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return <br key={index} />;

    if (
      trimmedLine.toLowerCase().includes("key features:") ||
      trimmedLine.toLowerCase().includes("perfect for:")
    ) {
      return (
        <div key={index} className="font-bold text-xs leading-relaxed mt-2 mb-1">
          {trimmedLine}
        </div>
      );
    }

    if (
      trimmedLine.startsWith("") ||
      trimmedLine.startsWith("*") ||
      trimmedLine.startsWith("-")
    ) {
      return (
        <div key={index} className="flex items-start gap-1 text-xs">
          <span className="text-primary font-bold mt-0.5"></span>
          <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
        </div>
      );
    }

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    quantity: 1,
  });

  const [createCustomer, { loading: creatingCustomer }] = useCreateCustomerMutation();
  const [createInvoice, { loading: creatingInvoice }] = useCreateInvoiceMutation();

  const handlePurchaseClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData({ ...formData, quantity: 1 });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // 1. Create Customer
      const customerRes = await createCustomer({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          }
        }
      });
      const customerId = customerRes.data?.createCustomer.id;
      if (!customerId) throw new Error("Failed to create customer");

      // 2. Create Invoice
      await createInvoice({
        variables: {
          input: {
            bill_to_public_id: customerId,
            invoice_type: InvoiceType.Sales,
            status: InvoiceStatus.Draft,
            items: [
              {
                inventory_id: parseFloat(selectedProduct.id),
                qty: formData.quantity,
                rate: selectedProduct.price,
                discount_percentage: 0,
              }
            ],
            issue_date: new Date().toISOString().split("T")[0],
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          }
        }
      });

      toast.success("Order placed successfully! Invoice generated.");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "", quantity: 1 });
    } catch (error: any) {
      toast.error(error.message || "Failed to process order");
    }
  };

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

            <CardFooter className="pt-0">
              <Button 
                variant="default" 
                className="w-full" 
                disabled={product.stock <= 0}
                onClick={() => handlePurchaseClick(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock > 0 ? "Purchase" : "Out of Stock"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedProduct?.stock || 1}
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creatingCustomer || creatingInvoice}>
                {creatingCustomer || creatingInvoice ? "Processing..." : "Place Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
"@
Out-File -FilePath frontend/src/components/ProductGrid.tsx -InputObject $content -Encoding UTF8

