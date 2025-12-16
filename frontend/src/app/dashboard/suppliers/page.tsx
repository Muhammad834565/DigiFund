"use client";

import { useGetMySuppliersQuery, useGetMyRequestsQuery, useSendSupplierRequestMutation, useAcceptRequestMutation, useSearchUserQuery } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { UserDetailsModal } from "@/components/UserDetailsModal";
import { useState } from "react";
import { toast } from "sonner";
import { Search, UserPlus, CheckCircle } from "lucide-react";

type SearchType = "email" | "phone_no" | "public_id";

export default function SuppliersPage() {
  const { data: suppliersData, loading: suppliersLoading } = useGetMySuppliersQuery();
  const { data: requestsData, loading: requestsLoading } = useGetMyRequestsQuery();
  const [sendRequest] = useSendSupplierRequestMutation();
  const [acceptRequest] = useAcceptRequestMutation();

  // Search State
  const [searchType, setSearchType] = useState<SearchType>("email");
  const [searchValue, setSearchValue] = useState("");

  // Build search input dynamically based on search type
  const searchInput = {
    [searchType]: searchValue
  };

  const { data: searchData, refetch: searchRefetch, loading: searchLoading } = useSearchUserQuery({
    variables: { input: searchInput },
    skip: !searchValue,
  });

  // User Details Modal State
  const [selectedPublicId, setSelectedPublicId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue) searchRefetch();
  };

  const handleSendRequest = async (public_id: string) => {
    try {
      await sendRequest({
        variables: {
          input: {
            requested_public_id: public_id,
            relationship_type: "supplier"
          }
        }
      });
      toast.success("Connection request sent!");
    } catch (err: any) {
      toast.error("Failed to send request: " + err.message);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest({
        variables: { input: { request_id: requestId, action: "accepted" } }
      });
      toast.success("Request accepted");
    } catch (err: any) {
      toast.error("Failed to accept: " + err.message);
    }
  };

  const handleViewUser = (publicId: string) => {
    setSelectedPublicId(publicId);
    setIsModalOpen(true);
  };

  const getPlaceholder = () => {
    switch (searchType) {
      case "email":
        return "Search by email...";
      case "phone_no":
        return "Search by phone number...";
      case "public_id":
        return "Search by public ID...";
      default:
        return "Search...";
    }
  };

  if (suppliersLoading || requestsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Suppliers</h1>

      <UserDetailsModal
        publicId={selectedPublicId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPublicId(null);
        }}
      />

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">My Suppliers</TabsTrigger>
          <TabsTrigger value="requests">Requests ({requestsData?.getMyRelationshipRequests?.filter(r => r?.status === 'pending').length || 0})</TabsTrigger>
          <TabsTrigger value="add">Add Supplier</TabsTrigger>
        </TabsList>

        {/* My Suppliers List */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Public ID</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliersData?.getSuppliers?.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24">No suppliers found.</TableCell></TableRow>
                  ) : (
                    suppliersData?.getSuppliers?.map((supplier) => (
                      <TableRow key={supplier?.id}>
                        <TableCell>
                          <Link
                            href={`/dashboard/suppliers/${supplier?.supplier_public_id}`}
                            className="p-0 h-auto font-mono text-sm text-blue-600 hover:underline"
                          >
                            {supplier?.supplier_public_id}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">{supplier?.contact_person}</TableCell>
                        <TableCell>{supplier?.company_name}</TableCell>
                        <TableCell>{supplier?.email}</TableCell>
                        <TableCell>{supplier?.phone_no}</TableCell>
                        <TableCell>{supplier?.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests */}
        <TabsContent value="requests">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestsData?.getMyRelationshipRequests?.map(req => (
                    <TableRow key={req?.id}>
                      <TableCell>
                        <Link
                          href={`/dashboard/suppliers/${req?.requester_public_id}`}
                          className="p-0 h-auto font-mono text-sm text-blue-600 hover:underline"
                        >
                          {req?.requester_public_id}
                        </Link>
                      </TableCell>
                      <TableCell>{req?.relationship_type}</TableCell>
                      <TableCell className="capitalize">{req?.status}</TableCell>
                      <TableCell>
                        {req?.status === 'pending' && (
                          <Button size="sm" onClick={() => req.id && handleAccept(String(req.id))}>Accept</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Supplier Search */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Search for Suppliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="flex gap-2">
                  <Select value={searchType} onValueChange={(value) => setSearchType(value as SearchType)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Search by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone_no">Phone Number</SelectItem>
                      <SelectItem value="public_id">Public ID</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder={getPlaceholder()}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1"
                  />

                  <Button type="submit" disabled={searchLoading}>
                    {searchLoading ? <LoadingSpinner /> : <Search size={16} />} Search
                  </Button>
                </div>
              </form>

              {searchData?.searchUser && (
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold">{searchData.searchUser.company_name}</p>
                    <p className="text-sm text-muted-foreground">{searchData.searchUser.contact_person}</p>
                    <p className="text-sm">{searchData.searchUser.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {searchData.searchUser.public_id}</p>
                  </div>
                  <Button onClick={() => searchData.searchUser?.public_id && handleSendRequest(searchData.searchUser.public_id)}>
                    <UserPlus className="mr-2 h-4 w-4" /> Connect
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
