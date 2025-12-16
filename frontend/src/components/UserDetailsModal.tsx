"use client";

import { useGetUserByPublicIdQuery } from "@/graphql/generated/graphql";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Building2, User, Mail, Phone, Briefcase } from "lucide-react";

interface UserDetailsModalProps {
    publicId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UserDetailsModal({ publicId, isOpen, onClose }: UserDetailsModalProps) {
    const { data, loading, error } = useGetUserByPublicIdQuery({
        variables: { public_id: publicId || "" },
        skip: !publicId,
    });

    const user = data?.getUserByPublicId;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Details
                    </DialogTitle>
                    <DialogDescription>
                        Information for {user?.company_name || publicId}
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <LoadingSpinner />
                    </div>
                )}

                {error && (
                    <div className="text-red-500 py-4">
                        Error loading user details: {error.message}
                    </div>
                )}

                {user && !loading && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            {/* Public ID */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <Label className="text-muted-foreground text-xs">Public ID</Label>
                                    <p className="font-mono text-sm font-medium mt-1">{user.public_id}</p>
                                </div>
                            </div>

                            {/* Company Name */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <Label className="text-muted-foreground text-xs">Company Name</Label>
                                    <p className="font-medium mt-1">{user.company_name}</p>
                                </div>
                            </div>

                            {/* Contact Person */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <Label className="text-muted-foreground text-xs">Contact Person</Label>
                                    <p className="font-medium mt-1">{user.contact_person}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <Label className="text-muted-foreground text-xs">Email</Label>
                                    <p className="font-medium mt-1">{user.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <Label className="text-muted-foreground text-xs">Phone Number</Label>
                                    <p className="font-medium mt-1">{user.phone_no}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="flex-1">
                                    <Label className="text-muted-foreground text-xs">Role</Label>
                                    <p className="font-medium mt-1 capitalize">{user.role?.replace("_", " ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
