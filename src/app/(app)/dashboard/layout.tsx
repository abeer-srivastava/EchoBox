"use client";

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 bg-secondary-background min-h-screen border-l-[3px] border-border">
        {children}
      </main>
    </div>
  );
}
