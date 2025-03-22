import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Download, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import HostFamilyForm from "./HostFamilyForm";

interface HostFamily {
  id: string;
  familyName: string;
  primaryContact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  currentAssignments: number;
  verificationStatus: "pending" | "verified" | "rejected";
  preferredGender?: "male" | "female" | "any";
  languagesSpoken: string[];
  dietaryAccommodations: boolean;
  hasChildren: boolean;
  hasPets: boolean;
}

interface FilterOptions {
  verificationStatus: Array<"pending" | "verified" | "rejected">;
  capacityStatus: Array<"available" | "full">;
  hasChildren: boolean | null;
  hasPets: boolean | null;
  dietaryAccommodations: boolean | null;
  searchTerm: string;
}

interface HostFamilyManagementProps {
  hostFamilies: HostFamily[];
}

const defaultHostFamilies: HostFamily[] = [
  {
    id: "1",
    familyName: "Smith Family",
    primaryContact: "John Smith",
    email: "john.smith@example.com",
    phone: "(123) 456-7890",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    capacity: 2,
    currentAssignments: 1,
    verificationStatus: "verified",
    preferredGender: "any",
    languagesSpoken: ["English", "Spanish"],
    dietaryAccommodations: true,
    hasChildren: true,
    hasPets: false,
  },
];

export const HostFamilyManagement = ({
  hostFamilies = defaultHostFamilies,
}: HostFamilyManagementProps) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    verificationStatus: [],
    capacityStatus: [],
    hasChildren: null,
    hasPets: null,
    dietaryAccommodations: null,
    searchTerm: "",
  });
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<HostFamily | null>(null);

  const handleVerificationStatusChange = (
    status: "pending" | "verified" | "rejected",
    checked: boolean
  ) => {
    setFilterOptions((prev) => ({
      ...prev,
      verificationStatus: checked
        ? [...prev.verificationStatus, status]
        : prev.verificationStatus.filter((s) => s !== status),
    }));
  };

  const handleCapacityStatusChange = (
    status: "available" | "full",
    checked: boolean
  ) => {
    setFilterOptions((prev) => ({
      ...prev,
      capacityStatus: checked
        ? [...prev.capacityStatus, status]
        : prev.capacityStatus.filter((s) => s !== status),
    }));
  };

  const handleBooleanFilterChange = (
    field: "hasChildren" | "hasPets" | "dietaryAccommodations",
    value: boolean | null
  ) => {
    setFilterOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = (hostFamily: HostFamily): boolean => {
    const searchMatch =
      filterOptions.searchTerm === "" ||
      hostFamily.familyName.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
      hostFamily.primaryContact.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
      hostFamily.email.toLowerCase().includes(filterOptions.searchTerm.toLowerCase());

    const verificationMatch =
      filterOptions.verificationStatus.length === 0 ||
      filterOptions.verificationStatus.includes(hostFamily.verificationStatus);

    const capacityMatch =
      filterOptions.capacityStatus.length === 0 ||
      (filterOptions.capacityStatus.includes("available") &&
        hostFamily.currentAssignments < hostFamily.capacity) ||
      (filterOptions.capacityStatus.includes("full") &&
        hostFamily.currentAssignments >= hostFamily.capacity);

    const childrenMatch =
      filterOptions.hasChildren === null ||
      filterOptions.hasChildren === hostFamily.hasChildren;

    const petsMatch =
      filterOptions.hasPets === null ||
      filterOptions.hasPets === hostFamily.hasPets;

    const dietaryMatch =
      filterOptions.dietaryAccommodations === null ||
      filterOptions.dietaryAccommodations === hostFamily.dietaryAccommodations;

    return (
      searchMatch &&
      verificationMatch &&
      capacityMatch &&
      childrenMatch &&
      petsMatch &&
      dietaryMatch
    );
  };

  const handleExport = () => {
    const filteredData = hostFamilies.filter(applyFilters);
    const headers = [
      "Family Name",
      "Primary Contact",
      "Email",
      "Phone",
      "Address",
      "City",
      "State",
      "Zip Code",
      "Capacity",
      "Current Assignments",
      "Verification Status",
      "Preferred Gender",
      "Languages Spoken",
      "Dietary Accommodations",
      "Has Children",
      "Has Pets",
    ].join(",");

    const rows = filteredData.map((family) => [
      family.familyName,
      family.primaryContact,
      family.email,
      family.phone,
      family.address,
      family.city,
      family.state,
      family.zipCode,
      family.capacity,
      family.currentAssignments,
      family.verificationStatus,
      family.preferredGender || "any",
      family.languagesSpoken.join(";"),
      family.dietaryAccommodations ? "Yes" : "No",
      family.hasChildren ? "Yes" : "No",
      family.hasPets ? "Yes" : "No",
    ].map((value) => `"${value}"`).join(","));

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "host-families.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddFamily = (data: any) => {
    console.log("Add family:", data);
    setShowAddDialog(false);
  };

  const handleEditFamily = (data: any) => {
    console.log("Edit family:", selectedFamily?.id, data);
    setShowEditDialog(false);
  };

  const handleDeleteFamily = () => {
    console.log("Delete family:", selectedFamily?.id);
    setShowDeleteDialog(false);
  };

  const filteredFamilies = hostFamilies.filter(applyFilters);

  const getVerificationBadge = (status: HostFamily["verificationStatus"]) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
    }
  };

  const getCapacityBadge = (capacity: number, currentAssignments: number) => {
    if (currentAssignments >= capacity) {
      return <Badge className="bg-red-500">Full</Badge>;
    }
    if (currentAssignments === 0) {
      return <Badge className="bg-green-500">Available</Badge>;
    }
    return (
      <Badge className="bg-yellow-500">
        {currentAssignments}/{capacity}
      </Badge>
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Search host families..."
            value={filterOptions.searchTerm}
            onChange={(e) =>
              setFilterOptions((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-4">
          <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilterSheet(true)}>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Host Families</SheetTitle>
                <SheetDescription>
                  Set the filters to narrow down the host family list
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Verification Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(["pending", "verified", "rejected"] as const).map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`verification-${status}`}
                          checked={filterOptions.verificationStatus.includes(status)}
                          onCheckedChange={(checked) =>
                            handleVerificationStatusChange(status, checked === true)
                          }
                        />
                        <Label htmlFor={`verification-${status}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Capacity Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {(["available", "full"] as const).map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`capacity-${status}`}
                          checked={filterOptions.capacityStatus.includes(status)}
                          onCheckedChange={(checked) =>
                            handleCapacityStatusChange(status, checked === true)
                          }
                        />
                        <Label htmlFor={`capacity-${status}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Additional Filters</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Select
                        value={filterOptions.hasChildren === null ? "any" : filterOptions.hasChildren.toString()}
                        onValueChange={(value) =>
                          handleBooleanFilterChange(
                            "hasChildren",
                            value === "any" ? null : value === "true"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Has Children" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label>Has Children</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={filterOptions.hasPets === null ? "any" : filterOptions.hasPets.toString()}
                        onValueChange={(value) =>
                          handleBooleanFilterChange(
                            "hasPets",
                            value === "any" ? null : value === "true"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Has Pets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label>Has Pets</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={filterOptions.dietaryAccommodations === null ? "any" : filterOptions.dietaryAccommodations.toString()}
                        onValueChange={(value) =>
                          handleBooleanFilterChange(
                            "dietaryAccommodations",
                            value === "any" ? null : value === "true"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Dietary Accommodations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label>Dietary Accommodations</Label>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterOptions({
                      verificationStatus: [],
                      capacityStatus: [],
                      hasChildren: null,
                      hasPets: null,
                      dietaryAccommodations: null,
                      searchTerm: "",
                    });
                  }}
                >
                  Reset Filters
                </Button>
                <Button onClick={() => setShowFilterSheet(false)}>
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Host Family
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Host Family</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new host family.
                </DialogDescription>
              </DialogHeader>
              <HostFamilyForm onSubmit={handleAddFamily} />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Host Families
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredFamilies.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family Details</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preferences</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFamilies.length > 0 ? (
                filteredFamilies.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell>
                      <div className="font-medium">{family.familyName}</div>
                      <div className="text-sm text-gray-500">
                        {family.address}, {family.city}, {family.state} {family.zipCode}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{family.primaryContact}</div>
                      <div className="text-sm text-gray-500">{family.email}</div>
                      <div className="text-sm text-gray-500">{family.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getVerificationBadge(family.verificationStatus)}
                        <div className="mt-1">
                          {getCapacityBadge(family.capacity, family.currentAssignments)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>
                          Preferred Gender:{" "}
                          {family.preferredGender?.charAt(0).toUpperCase() +
                            family.preferredGender?.slice(1) || "Any"}
                        </div>
                        <div>Languages: {family.languagesSpoken.join(", ")}</div>
                        <div>
                          Has Children: {family.hasChildren ? "Yes" : "No"}
                        </div>
                        <div>
                          Has Pets: {family.hasPets ? "Yes" : "No"}
                        </div>
                        <div>
                          Dietary Accommodations:{" "}
                          {family.dietaryAccommodations ? "Yes" : "No"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFamily(family);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedFamily(family);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No host families found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Host Family</DialogTitle>
            <DialogDescription>
              Update the details of the host family.
            </DialogDescription>
          </DialogHeader>
          {selectedFamily && (
            <HostFamilyForm
              initialData={{
                familyName: selectedFamily.familyName,
                primaryContact: selectedFamily.primaryContact,
                email: selectedFamily.email,
                phone: selectedFamily.phone,
                address: selectedFamily.address,
                city: selectedFamily.city,
                state: selectedFamily.state,
                zipCode: selectedFamily.zipCode,
                capacity: selectedFamily.capacity,
                preferredGender: selectedFamily.preferredGender || "any",
                languagesSpoken: selectedFamily.languagesSpoken.join(", "),
                dietaryAccommodations: selectedFamily.dietaryAccommodations,
                hasChildren: selectedFamily.hasChildren,
                hasPets: selectedFamily.hasPets,
              }}
              onSubmit={handleEditFamily}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the host family "{selectedFamily?.familyName}" and remove all their assignments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFamily}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HostFamilyManagement; 