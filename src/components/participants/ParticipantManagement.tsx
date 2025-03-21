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
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import ParticipantForm from "./ParticipantForm";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  paymentStatus: "pending" | "partial" | "complete" | "refunded";
  hostFamily?: string;
  documents: {
    id: boolean;
    payment: boolean;
    medical: boolean;
    consent: boolean;
  };
}

interface ParticipantManagementProps {
  participants?: Participant[];
  onAddParticipant?: (participant: Omit<Participant, "id">) => void;
  onEditParticipant?: (participant: Participant) => void;
  onDeleteParticipant?: (id: string) => void;
  onViewParticipant?: (id: string) => void;
}

const ParticipantManagement = ({
  participants = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      dateOfBirth: "1990-01-15",
      paymentStatus: "complete" as const,
      hostFamily: "Smith Family",
      documents: {
        id: true,
        payment: true,
        medical: true,
        consent: true,
      },
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "(234) 567-8901",
      dateOfBirth: "1992-05-20",
      paymentStatus: "partial" as const,
      hostFamily: "Johnson Family",
      documents: {
        id: true,
        payment: true,
        medical: false,
        consent: false,
      },
    },
    {
      id: "3",
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      phone: "(345) 678-9012",
      dateOfBirth: "1985-11-08",
      paymentStatus: "pending" as const,
      documents: {
        id: true,
        payment: false,
        medical: false,
        consent: true,
      },
    },
    {
      id: "4",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      phone: "(456) 789-0123",
      dateOfBirth: "1995-03-25",
      paymentStatus: "refunded" as const,
      hostFamily: "Williams Family",
      documents: {
        id: true,
        payment: true,
        medical: true,
        consent: true,
      },
    },
    {
      id: "5",
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
      phone: "(567) 890-1234",
      dateOfBirth: "1988-07-12",
      paymentStatus: "complete" as const,
      hostFamily: "Davis Family",
      documents: {
        id: true,
        payment: true,
        medical: true,
        consent: false,
      },
    },
  ],
  onAddParticipant = (participant) =>
    console.log("Add participant:", participant),
  onEditParticipant = (participant) =>
    console.log("Edit participant:", participant),
  onDeleteParticipant = (id) => console.log("Delete participant:", id),
  onViewParticipant = (id) => console.log("View participant:", id),
}: ParticipantManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentParticipant, setCurrentParticipant] =
    useState<Participant | null>(null);

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
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
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
