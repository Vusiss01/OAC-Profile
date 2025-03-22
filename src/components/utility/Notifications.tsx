import React from "react";
import { Bell, Check, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

const demoNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Participant Registration",
    message: "John Doe has registered as a new participant.",
    time: "5 minutes ago",
    read: false,
    type: "info"
  },
  {
    id: "2",
    title: "Host Family Update",
    message: "The Smith family has updated their availability.",
    time: "1 hour ago",
    read: false,
    type: "info"
  },
  {
    id: "3",
    title: "Payment Received",
    message: "Payment of $250 received from Jane Smith.",
    time: "2 hours ago",
    read: true,
    type: "success"
  },
  {
    id: "4",
    title: "Assignment Pending",
    message: "3 participants are waiting for host family assignments.",
    time: "1 day ago",
    read: true,
    type: "warning"
  }
];

const NotificationCard = ({ notification }: { notification: NotificationItem }) => {
  const typeColors = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
  };

  return (
    <div className={`p-4 rounded-lg border ${typeColors[notification.type]} ${!notification.read ? 'shadow-sm' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            {notification.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {notification.message}
          </p>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 block">
            {notification.time}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          {notification.read ? (
            <Check className="h-4 w-4 text-slate-400" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

const Notifications = () => {
  return (
    <div className="h-full bg-white dark:bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Notifications
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your notifications and alerts
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <Separator className="my-6" />

      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="space-y-4">
          {demoNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Notifications; 