import { fetchGraphQL } from "@/lib/graphql";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Mail, Building2, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SupplierChat } from "@/components/SupplierChat";

export default async function SupplierDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // Fetch supplier details using public_id
    const data = await fetchGraphQL(
        `
    query GetUserByPublicId($public_id: String!) {
      getUserByPublicId(public_id: $public_id) {
        public_id
        company_name
        contact_person
        email
        phone_no
        role
      }
    }
    `,
        { public_id: id }
    );

    const supplier = data?.getUserByPublicId;

    if (!supplier) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    Supplier not found.
                </div>
                <Link href="/dashboard/suppliers" className="mt-4 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Suppliers
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/suppliers">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Suppliers
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <SupplierChat supplierPublicId={supplier.public_id} supplierName={supplier.company_name} />
                    <Badge variant="outline" className="px-3 py-1">
                        {supplier.role}
                    </Badge>
                </div>
            </div>

            {/* Main Profile Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Building2 className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{supplier.company_name}</CardTitle>
                            <div className="text-muted-foreground flex items-center gap-1 text-sm mt-1">
                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                                <span>Verified Supplier</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 mt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Public ID</label>
                            <div className="font-mono bg-muted p-2 rounded text-sm">
                                {supplier.public_id}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>{supplier.contact_person}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">
                                    {supplier.email}
                                </a>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <a href={`tel:${supplier.phone_no}`} className="text-blue-600 hover:underline">
                                    {supplier.phone_no}
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
