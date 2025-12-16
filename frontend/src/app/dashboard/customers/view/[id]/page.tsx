import { fetchGraphQL } from "@/lib/graphql";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import ChatComponent from "@/components/ChatComponent";
import { getUserId } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function ViewCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getUserId();
  
  const { customer } = await fetchGraphQL(
    `query GetCustomer($id: String!) { 
      customer(id: $id) { 
        id 
        name 
        email 
        phone 
        address 
        createdAt 
      } 
    }`,
    { id }
  );

  if (!customer) {
    return <div className="p-6 text-center">Customer not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Customers
          </Button>
        </Link>
        <Link href={`/dashboard/customers/${id}`}>
          <Button size="sm">Edit Customer</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{customer.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Email
                </div>
                <div className="text-base">{customer.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Phone
                </div>
                <div className="text-base">{customer.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Address
                </div>
                <div className="text-base">{customer.address}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Created At
                </div>
                <div className="text-base">
                  {new Date(customer.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground">
              Customer ID: {customer.id}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Component */}
      {userId && (
        <ChatComponent
          customerId={customer.id}
          customerName={customer.name}
          userId={userId}
        />
      )}
    </div>
  );
}
