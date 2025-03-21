import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  UserCheck,
  Home,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";

import HostFamilyForm from "./HostFamilyForm";

interface HostFamily {
  id: string;
  familyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  capacity: string;
  currentAssignments: number;
  preferences: string;
  additionalInfo: string;
}

interface HostFamilyManagementProps {
  hostFamilies?: HostFamily[];
  onAddFamily?: (family: Omit<HostFamily, "id" | "currentAssignments">) => void;
  onEditFamily?: (
    id: string,
    family: Omit<HostFamily, "id" | "currentAssignments">,
  ) => void;
  onDeleteFamily?: (id: string) => void;
}

const HostFamilyManagement = ({
  hostFamilies = [
    {
      id: "1",
      familyName: "Smith Family",
      contactPerson: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St",
      city: "New York",
      capacity: "3",
      currentAssignments: 2,
      preferences: "Prefer female participants, ages 18-25",
      additionalInfo: "We have a dog and a cat.",
    },
    {
      id: "2",
      familyName: "Johnson Family",
      contactPerson: "Mary Johnson",
      email: "mary.johnson@example.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave",
      city: "Chicago",
      capacity: "2",
      currentAssignments: 1,
      preferences: "No preferences",
      additionalInfo: "We speak Spanish and English.",
    },
    {
      id: "3",
      familyName: "Williams Family",
      contactPerson: "Robert Williams",
      email: "robert.williams@example.com",
      phone: "(555) 456-7890",
      address: "789 Pine St",
      city: "Los Angeles",
      capacity: "4",
      currentAssignments: 0,
      preferences: "Prefer male participants, ages 20-30",
      additionalInfo: "We have a piano at home.",
    },
  ],
  onAddFamily,
  onEditFamily,
  onDeleteFamily,
}: HostFamilyManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<HostFamily | null>(null);

  const filteredFamilies = hostFamilies.filter(
    (family) =>
      family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      family.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddFamily = (
    data: Omit<HostFamily, "id" | "currentAssignments">,
  ) => {
    if (onAddFamily) {
      onAddFamily(data);
    } else {
      console.log("Add family:", data);
    }
    setOpenAddDialog(false);
  };

  const handleEditFamily = (
    data: Omit<HostFamily, "id" | "currentAssignments">,
  ) => {
    if (selectedFamily && onEditFamily) {
      onEditFamily(selectedFamily.id, data);
    } else {
      console.log("Edit family:", selectedFamily?.id, data);
    }
    setOpenEditDialog(false);
  };

  const handleDeleteFamily = () => {
    if (selectedFamily && onDeleteFamily) {
      onDeleteFamily(selectedFamily.id);
    } else {
      console.log("Delete family:", selectedFamily?.id);
    }
    setOpenDeleteDialog(false);
  };

  const openEdit = (family: HostFamily) => {
    setSelectedFamily(family);
    setOpenEditDialog(true);
  };

  const openDelete = (family: HostFamily) => {
    setSelectedFamily(family);
    setOpenDeleteDialog(true);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Host Families
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Home className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">
                  {hostFamilies.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">
                  {hostFamilies.reduce(
                    (sum, family) => sum + parseInt(family.capacity),
                    0,
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 text-primary mr-2" />
                <span className="text-2xl font-bold">
                  {hostFamilies.reduce(
                    (sum, family) => sum + family.currentAssignments,
                    0,
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-auto max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search host families..."
              className="pl-10 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Host Family
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Host Family</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new host family to the system.
                  </DialogDescription>
                </DialogHeader>
                <HostFamilyForm onSubmit={handleAddFamily} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Host families table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Family Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead className="hidden md:table-cell">City</TableHead>
                <TableHead className="hidden md:table-cell">Capacity</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFamilies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No host families found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFamilies.map((family) => (
                  <motion.tr
                    key={family.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {family.familyName}
                    </TableCell>
                    <TableCell>
                      <div>{family.contactPerson}</div>
                      <div className="text-sm text-muted-foreground">
                        {family.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {family.city}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {family.currentAssignments}/{family.capacity}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {parseInt(family.capacity) > family.currentAssignments ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Available
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                          Full
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(family)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDelete(family)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
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
                contactPerson: selectedFamily.contactPerson,
                email: selectedFamily.email,
                phone: selectedFamily.phone,
                address: selectedFamily.address,
                city: selectedFamily.city,
                capacity: selectedFamily.capacity,
                preferences: selectedFamily.preferences,
                additionalInfo: selectedFamily.additionalInfo,
              }}
              onSubmit={handleEditFamily}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the host family "
              {selectedFamily?.familyName}" and remove all their assignments.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFamily}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HostFamilyManagement;
