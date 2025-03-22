import React from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="h-full bg-white dark:bg-slate-950 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your preferences and account settings
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifs">Email Notifications</Label>
              <Switch id="email-notifs" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifs">Push Notifications</Label>
              <Switch id="push-notifs" />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 