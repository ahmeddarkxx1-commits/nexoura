"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/admin/Sidebar";
import { redirect, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Only require auth if not on the login page
  const { status } = useSession({
    required: !isLoginPage,
    onUnauthenticated() {
      if (!isLoginPage) {
        redirect("/admin/login");
      }
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
