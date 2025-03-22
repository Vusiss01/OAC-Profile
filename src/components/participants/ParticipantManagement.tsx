import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import ParticipantForm from "./ParticipantForm";

interface Documents {
  id: boolean;
  payment: boolean;
  medical: boolean;
  consent: boolean;
}

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  paymentStatus: "pending" | "partial" | "complete" | "refunded";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  priestship?: string;
  eldership?: string;
  hostFamily?: string;
  documents: Documents;
}

interface FilterOptions {
  paymentStatus: Array<"pending" | "partial" | "complete" | "refunded">;
  documentStatus: Array<"none" | "partial" | "complete">;
  hostFamilyStatus: "all" | "assigned" | "unassigned";
  searchTerm: string;
}

interface ParticipantManagementProps {
  participants?: Participant[];
  onAddParticipant?: (participant: Participant) => void;
  onEditParticipant?: (participant: Participant) => void;
  onDeleteParticipant?: (id: string) => void;
  onViewParticipant?: (id: string) => void;
}

const defaultParticipants: Participant[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    dateOfBirth: "1990-01-15",
    paymentStatus: "complete",
    hostFamily: "Smith Family",
    documents: {
      id: true,
      payment: true,
      medical: true,
      consent: true,
    },
  },
];

const ParticipantManagement = ({
  participants = defaultParticipants,
  onAddParticipant = (participant) => console.log("Add participant:", participant),
  onEditParticipant = (participant) => console.log("Edit participant:", participant),
  onDeleteParticipant = (id) => console.log("Delete participant:", id),
  onViewParticipant = (id) => console.log("View participant:", id),
}: ParticipantManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    paymentStatus: [],
    documentStatus: [],
    hostFamilyStatus: "all",
    searchTerm: "",
  });
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Filter participants based on search term and active tab
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.phone.includes(searchTerm);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "incomplete-docs")
      return (
        matchesSearch &&
        Object.values(participant.documents).some((value) => !value)
      );
    if (activeTab === "pending-payment")
      return matchesSearch && participant.paymentStatus === "pending";
    if (activeTab === "assigned")
      return matchesSearch && participant.hostFamily !== undefined;
    if (activeTab === "unassigned")
      return matchesSearch && participant.hostFamily === undefined;

    return matchesSearch;
  });

  const handleEditClick = (participant: Participant) => {
    setCurrentParticipant(participant);
    setShowEditDialog(true);
  };

  const getPaymentStatusBadge = (status: Participant["paymentStatus"]) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-500">Complete</Badge>;
      case "partial":
        return <Badge className="bg-yellow-500">Partial</Badge>;
      case "pending":
        return <Badge className="bg-red-500">Pending</Badge>;
      case "refunded":
        return <Badge className="bg-gray-500">Refunded</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getDocumentStatusBadge = (participant: Participant) => {
    const totalDocs = Object.keys(participant.documents).length;
    const completedDocs = Object.values(participant.documents).filter(
      (value) => value,
    ).length;

    if (completedDocs === totalDocs) {
      return (
        <Badge className="bg-green-500">
          {completedDocs}/{totalDocs}
        </Badge>
      );
    } else if (completedDocs > 0) {
      return (
        <Badge className="bg-yellow-500">
          {completedDocs}/{totalDocs}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500">
          {completedDocs}/{totalDocs}
        </Badge>
      );
    }
  };

  const handleExport = () => {
    const filteredData = participants.filter(applyFilters);
    const csvContent = convertToCSV(filteredData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaymentStatusChange = (status: "pending" | "partial" | "complete" | "refunded", checked: boolean) => {
    setFilterOptions((prev) => ({
      ...prev,
      paymentStatus: checked
        ? [...prev.paymentStatus, status]
        : prev.paymentStatus.filter((s) => s !== status),
    }));
  };

  const handleDocumentStatusChange = (status: "none" | "partial" | "complete", checked: boolean) => {
    setFilterOptions((prev) => ({
      ...prev,
      documentStatus: checked
        ? [...prev.documentStatus, status]
        : prev.documentStatus.filter((s) => s !== status),
    }));
  };

  const handleHostFamilyStatusChange = (value: "all" | "assigned" | "unassigned") => {
    setFilterOptions((prev) => ({
      ...prev,
      hostFamilyStatus: value,
    }));
  };

  const getDocumentStatus = (documents: Documents): "none" | "partial" | "complete" => {
    const totalDocs = Object.values(documents).length;
    const completedDocs = Object.values(documents).filter(Boolean).length;
    if (completedDocs === 0) return "none";
    if (completedDocs === totalDocs) return "complete";
    return "partial";
  };

  const applyFilters = (participant: Participant): boolean => {
    const searchMatch =
      filterOptions.searchTerm === "" ||
      participant.firstName.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
      participant.lastName.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(filterOptions.searchTerm.toLowerCase());

    const paymentMatch =
      filterOptions.paymentStatus.length === 0 ||
      filterOptions.paymentStatus.includes(participant.paymentStatus);

    const documentStatus = getDocumentStatus(participant.documents);
    const documentMatch =
      filterOptions.documentStatus.length === 0 ||
      filterOptions.documentStatus.includes(documentStatus);

    const hostFamilyMatch =
      filterOptions.hostFamilyStatus === "all" ||
      (filterOptions.hostFamilyStatus === "assigned" && participant.hostFamily) ||
      (filterOptions.hostFamilyStatus === "unassigned" && !participant.hostFamily);

    return searchMatch && paymentMatch && documentMatch && hostFamilyMatch;
  };

  const convertToCSV = (data: Participant[]): string => {
    const headers = [
      "First Name",
      "Last Name",
      "Title",
      "Email",
      "Phone",
      "Date of Birth",
      "Payment Status",
      "Address",
      "City",
      "State",
      "Zip Code",
      "Priestship",
      "Eldership",
      "Host Family",
      "Documents",
    ].join(",");

    const rows = data.map((participant) => {
      const documentStatus = getDocumentStatus(participant.documents);
      return [
        participant.firstName,
        participant.lastName,
        participant.title || "",
        participant.email,
        participant.phone,
        participant.dateOfBirth,
        participant.paymentStatus,
        participant.address || "",
        participant.city || "",
        participant.state || "",
        participant.zipCode || "",
        participant.priestship || "",
        participant.eldership || "",
        participant.hostFamily || "",
        documentStatus,
      ]
        .map((value) => `"${value}"`)
        .join(",");
    });

    return [headers, ...rows].join("\n");
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Participant Management
          </h2>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Participant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Participant</DialogTitle>
              </DialogHeader>
              <ParticipantForm
                onSubmit={(data) => {
                  onAddParticipant({
                    ...data,
                    documents: {
                      id: false,
                      payment: false,
                      medical: false,
                      consent: false,
                    },
                  });
                  setShowAddDialog(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search participants..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Participants</SheetTitle>
                  <SheetDescription>
                    Set the filters to narrow down the participant list
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Status</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {(["pending", "partial", "complete", "refunded"] as const).map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`payment-${status}`}
                            checked={filterOptions.paymentStatus.includes(status)}
                            onCheckedChange={(checked) => 
                              handlePaymentStatusChange(status, checked === true)
                            }
                          />
                          <Label htmlFor={`payment-${status}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Document Status</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {(["none", "partial", "complete"] as const).map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`docs-${status}`}
                            checked={filterOptions.documentStatus.includes(status)}
                            onCheckedChange={(checked) =>
                              handleDocumentStatusChange(status, checked === true)
                            }
                          />
                          <Label htmlFor={`docs-${status}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Host Family Status</h4>
                    <Select
                      value={filterOptions.hostFamilyStatus}
                      onValueChange={handleHostFamilyStatusChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterOptions({
                        paymentStatus: [],
                        documentStatus: [],
                        hostFamilyStatus: "all",
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="incomplete-docs">Incomplete Docs</TabsTrigger>
            <TabsTrigger value="pending-payment">Pending Payment</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {activeTab === "all" && "All Participants"}
                  {activeTab === "incomplete-docs" &&
                    "Participants with Incomplete Documents"}
                  {activeTab === "pending-payment" &&
                    "Participants with Pending Payments"}
                  {activeTab === "assigned" && "Assigned Participants"}
                  {activeTab === "unassigned" && "Unassigned Participants"}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredParticipants.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="py-3 px-4 font-medium text-gray-600">
                          Name
                        </th>
                        <th className="py-3 px-4 font-medium text-gray-600">
                          Contact
                        </th>
                        <th className="py-3 px-4 font-medium text-gray-600">
                          Payment
                        </th>
                        <th className="py-3 px-4 font-medium text-gray-600">
                          Documents
                        </th>
                        <th className="py-3 px-4 font-medium text-gray-600">
                          Host Family
                        </th>
                        <th className="py-3 px-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.length > 0 ? (
                        filteredParticipants.map((participant) => (
                          <tr
                            key={participant.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="font-medium">
                                {participant.firstName} {participant.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(
                                  participant.dateOfBirth,
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>{participant.email}</div>
                              <div className="text-sm text-gray-500">
                                {participant.phone}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {getPaymentStatusBadge(participant.paymentStatus)}
                            </td>
                            <td className="py-3 px-4">
                              {getDocumentStatusBadge(participant)}
                            </td>
                            <td className="py-3 px-4">
                              {participant.hostFamily ? (
                                <span>{participant.hostFamily}</span>
                              ) : (
                                <span className="text-gray-400">
                                  Not assigned
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    onViewParticipant(participant.id)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(participant)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    onDeleteParticipant(participant.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-gray-500"
                          >
                            No participants found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Participant Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Participant</DialogTitle>
          </DialogHeader>
          {currentParticipant && (
            <ParticipantForm
              participant={{
                firstName: currentParticipant.firstName,
                lastName: currentParticipant.lastName,
                email: currentParticipant.email,
                phone: currentParticipant.phone,
                dateOfBirth: currentParticipant.dateOfBirth,
                address: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
                paymentStatus: currentParticipant.paymentStatus,
              }}
              onSubmit={(data) => {
                onEditParticipant({
                  ...currentParticipant,
                  ...data,
                });
                setShowEditDialog(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipantManagement;
