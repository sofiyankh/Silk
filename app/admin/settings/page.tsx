import React from "react";
import { db } from "@/lib/db";
import { SettingsForm } from "./settings-form";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settingsList = await db.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Store Parameters & Logistics
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Configure flat COD rates, free shipping thresholds and concierge contact
          </p>
        </div>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
