import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import StatisticsCards from "./dashboard/StatisticsCards";
import ParticipantManagement from "./participants/ParticipantManagement";
import HostFamilyManagement from "./host-families/HostFamilyManagement";
import AssignmentInterface from "./assignments/AssignmentInterface";
import PaymentTracking from "./payments/PaymentTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Settings, Menu, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const renderContent = () => {
    // Only render dashboard content if we're at the root path
    if (location.pathname !== "/") {
      return <Outlet />;
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate("/calendar")}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <StatisticsCards />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=participant${i}`}
                              alt="Avatar"
                              className="h-10 w-10 rounded-full"
                            />
                          </div>
                          <div>
                            <p className="font-medium">Participant {i}</p>
                            <p className="text-sm text-gray-500">
                              Registered {i} day{i !== 1 ? "s" : ""} ago
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Review new registrations",
                      "Confirm host family assignments",
                      "Process pending payments",
                      "Send reminder emails",
                      "Update trip itinerary",
                    ].map((task, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${i < 2 ? "bg-red-500" : i < 4 ? "bg-yellow-500" : "bg-green-500"}`}
                          ></div>
                          <p>{task}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {i < 2 ? "Today" : i < 4 ? "Tomorrow" : "Next week"}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "participants":
        return <ParticipantManagement />;
      case "host-families":
        return <HostFamilyManagement />;
      case "assignments":
        return <AssignmentInterface />;
      case "payments":
        return <PaymentTracking />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="flex-1 overflow-auto p-6 pl-16">
        {location.pathname === "/" ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="host-families">Host Families</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              {renderContent()}
            </TabsContent>
          </Tabs>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default Home;
