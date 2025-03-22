import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  UserRound,
  DollarSign,
  Settings,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  variant?: "default" | "danger";
}

const SidebarLink = ({ to, icon, label, active = false, variant = "default" }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg transition-all",
          "hover:bg-primary/5 dark:hover:bg-primary/10",
          "group relative",
          variant === "danger" && "hover:bg-red-500/5 dark:hover:bg-red-500/10",
          isActive || active
            ? cn(
                "bg-primary/10 dark:bg-primary/20",
                "text-primary dark:text-primary",
                "font-medium"
              )
            : cn(
                "text-slate-600 dark:text-slate-400",
                variant === "danger" && "text-red-600 dark:text-red-400"
              )
        )
      }
    >
      <div className={cn(
        "flex justify-center items-center h-9 w-9 rounded-lg transition-all",
        "bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800",
        "group-hover:border-primary/20 dark:group-hover:border-primary/20",
        variant === "danger" && "group-hover:border-red-500/20 dark:group-hover:border-red-500/20"
      )}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      <ChevronRight className={cn(
        "ml-auto h-4 w-4 transition-transform",
        "text-slate-400 dark:text-slate-600",
        "group-hover:translate-x-0.5 group-hover:text-primary dark:group-hover:text-primary",
        variant === "danger" && "group-hover:text-red-500 dark:group-hover:text-red-500"
      )} />
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <div className="h-full bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950 dark:to-slate-900/50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <span className="text-xl font-bold text-primary">CT</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Church Trip
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Management System
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        {/* Main Navigation */}
        <div className="py-6">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Main Navigation
            </h2>
          </div>
          <div className="space-y-1">
            <SidebarLink
              to="/"
              icon={<Home size={20} strokeWidth={1.5} />}
              label="Dashboard"
              active
            />
            <SidebarLink
              to="/participants"
              icon={<UserRound size={20} strokeWidth={1.5} />}
              label="Participants"
            />
            <SidebarLink
              to="/host-families"
              icon={<Users size={20} strokeWidth={1.5} />}
              label="Host Families"
            />
            <SidebarLink
              to="/assignments"
              icon={<Users size={20} strokeWidth={1.5} />}
              label="Assignments"
            />
            <SidebarLink
              to="/payments"
              icon={<DollarSign size={20} strokeWidth={1.5} />}
              label="Payments"
            />
          </div>
        </div>

        <Separator className="my-4 opacity-50" />
        
        {/* Settings & Support */}
        <div className="py-4">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Settings & Support
            </h2>
          </div>
          <div className="space-y-1">
            <SidebarLink
              to="/settings"
              icon={<Settings size={20} strokeWidth={1.5} />}
              label="Settings"
            />
            <SidebarLink
              to="/help"
              icon={<HelpCircle size={20} strokeWidth={1.5} />}
              label="Help & Support"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <SidebarLink
          to="/logout"
          icon={<LogOut size={20} strokeWidth={1.5} />}
          label="Logout"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default Sidebar;
