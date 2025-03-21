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
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink = ({ to, icon, label, active = false }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all mx-auto",
          "hover:bg-primary/10 dark:hover:bg-primary/20",
          isActive || active
            ? "bg-primary/10 dark:bg-primary/20 text-primary font-medium shadow-sm"
            : "text-slate-600 dark:text-slate-400",
        )
      }
    >
      <div className="flex justify-center items-center h-12 w-12 rounded-full bg-white dark:bg-slate-900 shadow-sm">
        {icon}
      </div>
      <span className="text-center text-sm font-medium w-full">{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-[280px] h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-md items-center">
      <div className="p-6 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 w-full">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Church Trip CRM
        </h1>
      </div>

      <nav className="flex-1 flex flex-col justify-center px-3 py-6 space-y-3 w-full items-center">
        <div className="space-y-3">
          <SidebarLink
            to="/"
            icon={<Home size={24} strokeWidth={1.5} />}
            label="Dashboard"
            active
          />
          <SidebarLink
            to="/participants"
            icon={<UserRound size={24} strokeWidth={1.5} />}
            label="Participants"
          />
          <SidebarLink
            to="/host-families"
            icon={<Users size={24} strokeWidth={1.5} />}
            label="Host Families"
          />
          <SidebarLink
            to="/assignments"
            icon={<Users size={24} strokeWidth={1.5} />}
            label="Assignments"
          />
          <SidebarLink
            to="/payments"
            icon={<DollarSign size={24} strokeWidth={1.5} />}
            label="Payments"
          />
        </div>
      </nav>

      <div className="mt-auto px-3 py-4 space-y-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-xl w-full flex flex-col items-center">
        <SidebarLink
          to="/settings"
          icon={<Settings size={24} strokeWidth={1.5} />}
          label="Settings"
        />
        <SidebarLink
          to="/help"
          icon={<HelpCircle size={24} strokeWidth={1.5} />}
          label="Help & Support"
        />
        <button className="flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-xl transition-all w-full text-slate-600 dark:text-slate-400 hover:bg-red-100/50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 mx-auto">
          <div className="flex justify-center items-center h-12 w-12 rounded-full bg-white dark:bg-slate-900 shadow-sm">
            <LogOut size={24} strokeWidth={1.5} />
          </div>
          <span className="text-center text-sm font-medium w-full">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
