import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import PaymentForm from "./PaymentForm";

interface PaymentData {
  id: string;
  participantName: string;
  amount: number;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
  hasProof: boolean;
}

interface PaymentTrackingProps {
  payments?: PaymentData[];
  totalExpected?: number;
  totalReceived?: number;
}

const PaymentTracking = ({
  payments = [
    {
      id: "1",
      participantName: "John Doe",
      amount: 250,
      date: "2023-06-15",
      method: "Bank Transfer",
      status: "completed" as const,
      hasProof: true,
    },
    {
      id: "2",
      participantName: "Jane Smith",
      amount: 250,
      date: "2023-06-14",
      method: "Credit Card",
      status: "completed" as const,
      hasProof: true,
    },
    {
      id: "3",
      participantName: "Michael Johnson",
      amount: 250,
      date: "2023-06-10",
      method: "Cash",
      status: "completed" as const,
      hasProof: false,
    },
    {
      id: "4",
      participantName: "Sarah Williams",
      amount: 250,
      date: "2023-06-18",
      method: "Check",
      status: "pending" as const,
      hasProof: true,
    },
    {
      id: "5",
      participantName: "David Brown",
      amount: 250,
      date: "2023-06-05",
      method: "Bank Transfer",
      status: "failed" as const,
      hasProof: false,
    },
  ],
  totalExpected = 75000,
  totalReceived = 45250,
}: PaymentTrackingProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.participantName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const completedPayments = payments.filter(
    (payment) => payment.status === "completed",
  ).length;
  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending",
  ).length;
  const failedPayments = payments.filter(
    (payment) => payment.status === "failed",
  ).length;

  const percentReceived = Math.round((totalReceived / totalExpected) * 100);

  const handleAddPayment = () => {
    setIsPaymentFormOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="flex flex-col space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    ${totalReceived.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    of ${totalExpected.toLocaleString()} expected
                  </p>
                </div>
                <div className="w-16 h-16">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Progress
                      value={percentReceived}
                      className="h-16 w-16 rounded-full"
                    />
                    <span className="absolute text-sm font-medium">
                      {percentReceived}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold text-green-500">
                    {completedPayments}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-yellow-500">
                    {pendingPayments}
                  </p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-red-500">
                    {failedPayments}
                  </p>
                  <p className="text-xs text-gray-500">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleAddPayment}
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Record New Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export Payment Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Payment Tracking</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search participants..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog
                    open={isPaymentFormOpen}
                    onOpenChange={setIsPaymentFormOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <PaymentForm
                        onSubmit={() => setIsPaymentFormOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Payments</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Proof</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length > 0 ? (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.participantName}
                            </TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                {new Date(payment.date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>
                              {payment.hasProof ? (
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  None
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No payments found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Proof</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                        )
                        .slice(0, 5)
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.participantName}
                            </TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                {new Date(payment.date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>
                              {payment.hasProof ? (
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  None
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Proof</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments
                        .filter((payment) => payment.status === "pending")
                        .map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                              {payment.participantName}
                            </TableCell>
                            <TableCell>${payment.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                {new Date(payment.date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              {getStatusBadge(payment.status)}
                            </TableCell>
                            <TableCell>
                              {payment.hasProof ? (
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  None
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Edit Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTracking;
