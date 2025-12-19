"use client";

import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data, loading, error, refetch } = useGetMyProfileQuery();
  const [updateProfile, { loading: updating }] = useUpdateMyProfileMutation();
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    phone_no: "",
    address: "",
    type_of_business: "",
  });

  const profile = data?.me;

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        contact_person: profile.contact_person || "",
        phone_no: profile.phone_no || "",
        address: profile.address || "",
        type_of_business: profile.type_of_business || "",
      });
    }
  }, [profile]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        variables: { input: formData },
      });
      toast.success("Profile updated successfully");
      refetch();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!profile) return <div>No profile found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Your current account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold">Public ID:</span>
              <span>{profile.public_id}</span>

              <span className="font-semibold">Email:</span>
              <span>{profile.email}</span>

              <span className="font-semibold">Status:</span>
              <span className={`capitalize ${profile.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{profile.status}</span>

              <span className="font-semibold">Role:</span>
              <span className="capitalize">{profile.role}</span>

              <span className="font-semibold">Verified:</span>
              <span>{profile.is_verified ? "Yes" : "No"}</span>

              <span className="font-semibold">Created At:</span>
              <span>{new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your business information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="ACME Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_no">Phone Number</Label>
                <Input
                  id="phone_no"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type_of_business">Type of Business</Label>
                <Input
                  id="type_of_business"
                  name="type_of_business"
                  value={formData.type_of_business}
                  onChange={handleChange}
                  placeholder="Retail"
                />
              </div>
              <Button type="submit" className="w-full" disabled={updating}>
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
