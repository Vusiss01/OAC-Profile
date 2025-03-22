import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HostFamilyManagement } from "@/components/host-families/HostFamilyManagement";
import { Home, Users, CheckCircle } from "lucide-react";

const hostFamiliesData = [
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
    verificationStatus: "verified" as const,
    preferredGender: "any" as const,
    languagesSpoken: ["English", "Spanish"],
    dietaryAccommodations: true,
    hasChildren: true,
    hasPets: false,
  },
  {
    id: "2",
    familyName: "Johnson Family",
    primaryContact: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(234) 567-8901",
    address: "456 Oak Ave",
    city: "Springfield",
    state: "IL",
    zipCode: "62702",
    capacity: 4,
    currentAssignments: 2,
    verificationStatus: "verified" as const,
    preferredGender: "female" as const,
    languagesSpoken: ["English", "French"],
    dietaryAccommodations: false,
    hasChildren: true,
    hasPets: true,
  },
  {
    id: "3",
    familyName: "Williams Family",
    primaryContact: "Michael Williams",
    email: "michael.williams@example.com",
    phone: "(345) 678-9012",
    address: "789 Pine St",
    city: "Springfield",
    state: "IL",
    zipCode: "62703",
    capacity: 3,
    currentAssignments: 0,
    verificationStatus: "pending" as const,
    preferredGender: "male" as const,
    languagesSpoken: ["English"],
    dietaryAccommodations: true,
    hasChildren: false,
    hasPets: false,
  },
];

export default function HostFamiliesPage() {
  const totalCapacity = hostFamiliesData.reduce((sum, family) => sum + family.capacity, 0);
  const totalAssignments = hostFamiliesData.reduce((sum, family) => sum + family.currentAssignments, 0);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Host Families</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hostFamiliesData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Assignments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
          </CardContent>
        </Card>
      </div>

      <HostFamilyManagement hostFamilies={hostFamiliesData} />
    </div>
  );
} 