import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Search, UserPlus, Users, Home, RefreshCw } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  age: number;
  gender: string;
  specialNeeds?: string;
  paymentStatus: "paid" | "pending" | "unpaid";
}

interface HostFamily {
  id: string;
  name: string;
  capacity: number;
  currentAssignments: number;
  preferences?: {
    gender?: "male" | "female" | "any";
    ageRange?: [number, number];
    specialNeeds?: boolean;
  };
  address: string;
}

interface AssignmentInterfaceProps {
  participants?: Participant[];
  hostFamilies?: HostFamily[];
  onAssignmentSave?: (
    assignments: { participantId: string; hostFamilyId: string }[],
  ) => void;
}

const AssignmentInterface: React.FC<AssignmentInterfaceProps> = ({
  participants = [
    {
      id: "p1",
      name: "John Smith",
      age: 17,
      gender: "male",
      paymentStatus: "paid",
    },
    {
      id: "p2",
      name: "Sarah Johnson",
      age: 16,
      gender: "female",
      specialNeeds: "Dietary restrictions",
      paymentStatus: "paid",
    },
    {
      id: "p3",
      name: "Michael Brown",
      age: 15,
      gender: "male",
      paymentStatus: "pending",
    },
    {
      id: "p4",
      name: "Emily Davis",
      age: 16,
      gender: "female",
      paymentStatus: "unpaid",
    },
    {
      id: "p5",
      name: "David Wilson",
      age: 17,
      gender: "male",
      paymentStatus: "paid",
    },
  ],
  hostFamilies = [
    {
      id: "h1",
      name: "Anderson Family",
      capacity: 3,
      currentAssignments: 1,
      preferences: { gender: "any", ageRange: [15, 18] },
      address: "123 Main St",
    },
    {
      id: "h2",
      name: "Martinez Family",
      capacity: 2,
      currentAssignments: 0,
      preferences: { gender: "female", ageRange: [16, 18] },
      address: "456 Oak Ave",
    },
    {
      id: "h3",
      name: "Thompson Family",
      capacity: 4,
      currentAssignments: 2,
      preferences: { gender: "male", ageRange: [14, 17] },
      address: "789 Pine Rd",
    },
    {
      id: "h4",
      name: "Garcia Family",
      capacity: 2,
      currentAssignments: 0,
      preferences: { gender: "any", specialNeeds: true },
      address: "101 Cedar Ln",
    },
  ],
  onAssignmentSave = () => {},
}) => {
  const [unassignedParticipants, setUnassignedParticipants] =
    useState<Participant[]>(participants);
  const [families, setFamilies] = useState<HostFamily[]>(hostFamilies);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAssignments, setPendingAssignments] = useState<
    { participantId: string; hostFamilyId: string }[]
  >([]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const participantId = result.draggableId;

    // If dropping in a host family
    if (destination.droppableId.startsWith("family-")) {
      const hostFamilyId = destination.droppableId.replace("family-", "");
      const participant = unassignedParticipants.find(
        (p) => p.id === participantId,
      );
      const hostFamily = families.find((f) => f.id === hostFamilyId);

      if (participant && hostFamily) {
        // Check if family has capacity
        if (hostFamily.currentAssignments < hostFamily.capacity) {
          // Add to assignments
          const newAssignments = { ...assignments };
          if (!newAssignments[hostFamilyId]) {
            newAssignments[hostFamilyId] = [];
          }
          newAssignments[hostFamilyId].push(participantId);

          // Update host family current assignments
          const updatedFamilies = families.map((f) => {
            if (f.id === hostFamilyId) {
              return { ...f, currentAssignments: f.currentAssignments + 1 };
            }
            return f;
          });

          // Remove from unassigned participants
          const updatedParticipants = unassignedParticipants.filter(
            (p) => p.id !== participantId,
          );

          setAssignments(newAssignments);
          setFamilies(updatedFamilies);
          setUnassignedParticipants(updatedParticipants);

          // Add to pending assignments
          setPendingAssignments([
            ...pendingAssignments,
            { participantId, hostFamilyId },
          ]);
        }
      }
    }
  };

  const handleAutoAssign = () => {
    // Simple auto-assignment algorithm based on preferences
    const newAssignments = { ...assignments };
    const updatedFamilies = [...families];
    const remainingParticipants = [...unassignedParticipants];
    const newPendingAssignments = [...pendingAssignments];

    // Sort families by available capacity
    updatedFamilies.sort((a, b) => {
      const aAvailable = a.capacity - a.currentAssignments;
      const bAvailable = b.capacity - b.currentAssignments;
      return bAvailable - aAvailable; // Descending order
    });

    // Try to assign participants to families
    for (const family of updatedFamilies) {
      const availableCapacity = family.capacity - family.currentAssignments;
      if (availableCapacity <= 0) continue;

      // Find matching participants based on preferences
      const matchingParticipants = remainingParticipants
        .filter((p) => {
          if (
            family.preferences?.gender &&
            family.preferences.gender !== "any"
          ) {
            if (p.gender !== family.preferences.gender) return false;
          }
          if (family.preferences?.ageRange) {
            const [min, max] = family.preferences.ageRange;
            if (p.age < min || p.age > max) return false;
          }
          if (family.preferences?.specialNeeds === true) {
            return !!p.specialNeeds;
          }
          return true;
        })
        .slice(0, availableCapacity);

      // Assign matching participants to this family
      if (matchingParticipants.length > 0) {
        if (!newAssignments[family.id]) {
          newAssignments[family.id] = [];
        }

        for (const participant of matchingParticipants) {
          newAssignments[family.id].push(participant.id);
          newPendingAssignments.push({
            participantId: participant.id,
            hostFamilyId: family.id,
          });
        }

        // Update family's current assignments
        const familyIndex = updatedFamilies.findIndex(
          (f) => f.id === family.id,
        );
        if (familyIndex !== -1) {
          updatedFamilies[familyIndex] = {
            ...family,
            currentAssignments:
              family.currentAssignments + matchingParticipants.length,
          };
        }

        // Remove assigned participants from remaining list
        const assignedIds = matchingParticipants.map((p) => p.id);
        for (let i = remainingParticipants.length - 1; i >= 0; i--) {
          if (assignedIds.includes(remainingParticipants[i].id)) {
            remainingParticipants.splice(i, 1);
          }
        }
      }
    }

    setAssignments(newAssignments);
    setFamilies(updatedFamilies);
    setUnassignedParticipants(remainingParticipants);
    setPendingAssignments(newPendingAssignments);
    setShowConfirmDialog(true);
  };

  const handleSaveAssignments = () => {
    onAssignmentSave(pendingAssignments);
    setPendingAssignments([]);
    setShowConfirmDialog(false);
  };

  const filteredParticipants = unassignedParticipants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredFamilies = families.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Participant Assignment Interface</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search participants or families..."
              className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAutoAssign}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Auto-Assign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unassigned Participants */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Card className="bg-gray-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Unassigned Participants
                </CardTitle>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {filteredParticipants.length}
                </span>
              </div>
              <CardDescription>
                Drag participants to assign them to host families
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <Droppable droppableId="unassigned-participants">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {filteredParticipants.map((participant, index) => (
                      <Draggable
                        key={participant.id}
                        draggableId={participant.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">
                                  {participant.name}
                                </h3>
                                <div className="text-sm text-gray-500">
                                  {participant.age} years • {participant.gender}
                                  {participant.specialNeeds && (
                                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                                      Special Needs
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${participant.paymentStatus === "paid" ? "bg-green-100 text-green-800" : participant.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                >
                                  {participant.paymentStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {filteredParticipants.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No unassigned participants found
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Host Families */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Home size={20} />
                Host Families
              </h2>
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus size={16} />
                Add Family
              </Button>
            </div>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {filteredFamilies.map((family) => {
                const familyAssignments = assignments[family.id] || [];
                const assignedParticipants = participants.filter((p) =>
                  familyAssignments.includes(p.id),
                );
                const availableCapacity =
                  family.capacity - family.currentAssignments;

                return (
                  <Card
                    key={family.id}
                    className={
                      availableCapacity > 0
                        ? "border-green-200"
                        : "border-gray-200"
                    }
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{family.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${availableCapacity > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {family.currentAssignments}/{family.capacity}{" "}
                            assigned
                          </span>
                        </div>
                      </div>
                      <CardDescription className="text-sm">
                        {family.address} •
                        {family.preferences?.gender &&
                        family.preferences.gender !== "any"
                          ? `Prefers ${family.preferences.gender}`
                          : "No gender preference"}
                        {family.preferences?.ageRange &&
                          ` • Ages ${family.preferences.ageRange[0]}-${family.preferences.ageRange[1]}`}
                        {family.preferences?.specialNeeds &&
                          " • Can accommodate special needs"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <Droppable droppableId={`family-${family.id}`}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`min-h-[100px] p-2 rounded-md ${availableCapacity > 0 ? "bg-green-50 border border-dashed border-green-200" : "bg-gray-50 border border-dashed border-gray-200"}`}
                          >
                            {assignedParticipants.length > 0 ? (
                              <div className="space-y-2">
                                {assignedParticipants.map(
                                  (participant, index) => (
                                    <div
                                      key={participant.id}
                                      className="bg-white p-2 rounded-md shadow-sm border border-gray-200"
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <h3 className="font-medium">
                                            {participant.name}
                                          </h3>
                                          <div className="text-xs text-gray-500">
                                            {participant.age} years •{" "}
                                            {participant.gender}
                                          </div>
                                        </div>
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full ${participant.paymentStatus === "paid" ? "bg-green-100 text-green-800" : participant.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                        >
                                          {participant.paymentStatus}
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                {availableCapacity > 0
                                  ? "Drop participants here to assign"
                                  : "No capacity available"}
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredFamilies.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No host families found
                </div>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Assignments</DialogTitle>
            <DialogDescription>
              {pendingAssignments.length} participants have been assigned to
              host families. Would you like to save these assignments?
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto my-4">
            <div className="space-y-2">
              {pendingAssignments.map(({ participantId, hostFamilyId }) => {
                const participant = participants.find(
                  (p) => p.id === participantId,
                );
                const family = families.find((f) => f.id === hostFamilyId);
                return (
                  <div
                    key={`${participantId}-${hostFamilyId}`}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                  >
                    <div>{participant?.name}</div>
                    <div className="text-gray-500">→</div>
                    <div>{family?.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAssignments}>Save Assignments</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentInterface;
