import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { Users, CreditCard, Home, TrendingUp, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const StatCard = ({
  title = "Stat Title",
  value = "0",
  description = "Description text",
  icon,
  trend = "neutral",
  trendValue = "0%",
  className,
}: StatCardProps) => {
  const trendColor = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
  };

  const trendIcon = {
    up: <TrendingUp className="h-4 w-4" />,
    down: <TrendingUp className="h-4 w-4 rotate-180" />,
    neutral: null,
  };

  return (
    <Card className={cn("bg-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {icon && <div className="h-8 w-8 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend !== "neutral" && (
            <span
              className={`flex items-center text-xs ${trendColor[trend]} mr-1`}
            >
              {trendIcon[trend]}
              {trendValue}
            </span>
          )}
          <CardDescription className="text-xs text-gray-500">
            {description}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsCards = () => {
  // Mock data for statistics cards
  const stats = [
    {
      title: "Total Participants",
      value: "247",
      description: "Registered for the trip",
      icon: <Users className="h-6 w-6" />,
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Payment Status",
      value: "68%",
      description: "Fully paid participants",
      icon: <CreditCard className="h-6 w-6" />,
      trend: "up",
      trendValue: "+5%",
    },
    {
      title: "Host Families",
      value: "83",
      description: "Available for assignments",
      icon: <Home className="h-6 w-6" />,
      trend: "neutral",
      trendValue: "",
    },
    {
      title: "Pending Documents",
      value: "42",
      description: "Require attention",
      icon: <AlertCircle className="h-6 w-6" />,
      trend: "down",
      trendValue: "-15%",
    },
  ];

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Trip Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend as "up" | "down" | "neutral"}
            trendValue={stat.trendValue}
          />
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;
