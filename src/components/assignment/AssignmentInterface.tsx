import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  age: number;
  gender: string;
  specialNeeds?: boolean;
  paymentStatus: 'paid' | 'pending' | 'unpaid';
}

interface HostFamily {
  id: string;
  familyName: string;
  address: string;
  preferredGender?: string;
  ageRange: string;
  capacity: number;
  assignedParticipants: number;
}

const ParticipantCard = ({ participant, index }: { participant: Participant; index: number }) => {
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">pending</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500">unpaid</Badge>;
      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={participant.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-2 bg-white rounded-lg shadow-sm cursor-move border ${
            snapshot.isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{participant.name}</h3>
              <p className="text-sm text-gray-500">
                {participant.age} years • {participant.gender}
              </p>
            </div>
            <div className="flex gap-2">
              {participant.specialNeeds && (
                <Badge className="bg-yellow-100 text-yellow-800">Special Needs</Badge>
              )}
              {getPaymentBadge(participant.paymentStatus)}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const AssignmentInterface: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'John Smith',
      age: 17,
      gender: 'male',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      age: 16,
      gender: 'female',
      specialNeeds: true,
      paymentStatus: 'paid',
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 15,
      gender: 'male',
      paymentStatus: 'pending',
    },
    {
      id: '4',
      name: 'Emily Davis',
      age: 16,
      gender: 'female',
      paymentStatus: 'unpaid',
    },
    {
      id: '5',
      name: 'David Wilson',
      age: 17,
      gender: 'male',
      paymentStatus: 'paid',
    },
  ]);

  const [hostFamilies, setHostFamilies] = useState<HostFamily[]>([
    {
      id: '1',
      familyName: 'Anderson Family',
      address: '123 Main St',
      ageRange: '15-18',
      capacity: 3,
      assignedParticipants: 1,
    },
    {
      id: '2',
      familyName: 'Martinez Family',
      address: '456 Oak Ave',
      preferredGender: 'female',
      ageRange: '16-18',
      capacity: 2,
      assignedParticipants: 0,
    },
    {
      id: '3',
      familyName: 'Thompson Family',
      address: '789 Pine Rd',
      preferredGender: 'male',
      ageRange: '14-17',
      capacity: 4,
      assignedParticipants: 2,
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const family = hostFamilies.find(f => f.id === destination.droppableId);
    if (!family || family.assignedParticipants >= family.capacity) return;

    // Update the host family's assigned participants count
    setHostFamilies(prevFamilies => 
      prevFamilies.map(f => 
        f.id === destination.droppableId
          ? { ...f, assignedParticipants: f.assignedParticipants + 1 }
          : f
      )
    );
    
    // Remove the participant from the unassigned list
    setParticipants(prev => prev.filter(p => p.id !== draggableId));
  };

  const handleAutoAssign = () => {
    console.log('Auto-assigning participants...');
  };

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Unassigned Participants
              <Badge variant="secondary">{filteredParticipants.length}</Badge>
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleAutoAssign}
            >
              <RefreshCw className="h-4 w-4" />
              Auto-Assign
            </Button>
          </div>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Droppable droppableId="participants">
            {(provided, snapshot) => (
              <Card 
                className={`p-4 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredParticipants.map((participant, index) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Card>
            )}
          </Droppable>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Host Families</h2>
          {hostFamilies.map((family) => (
            <Droppable key={family.id} droppableId={family.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 mb-4 rounded-lg border-2 ${
                    snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 
                    family.assignedParticipants < family.capacity ? 'border-dashed border-gray-300' : 
                    'border-dashed border-red-300 bg-red-50'
                  }`}
                >
                  <div className="mb-2">
                    <h3 className="font-medium">{family.familyName}</h3>
                    <p className="text-sm text-gray-500">{family.address}</p>
                    <div className="flex gap-2 mt-1">
                      {family.preferredGender && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Prefers {family.preferredGender}
                        </Badge>
                      )}
                      <Badge className="bg-blue-100 text-blue-800">
                        Ages {family.ageRange}
                      </Badge>
                      <Badge className={family.assignedParticipants >= family.capacity ? 'bg-red-500' : 'bg-green-500'}>
                        {family.assignedParticipants}/{family.capacity} assigned
                      </Badge>
                    </div>
                  </div>
                  <div className="min-h-[100px] rounded-md bg-gray-50 p-2">
                    {family.assignedParticipants >= family.capacity ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Family is at capacity
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Drop participants here to assign
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default AssignmentInterface; 