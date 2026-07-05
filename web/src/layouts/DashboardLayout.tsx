"use client";

import { Sidebar } from "../components/common/Sidebar";
import { Navbar } from "../components/common/Navbar";

export function DashboardLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(120deg,_#050816,_#0b1020)] p-4 text-slate-100 md:p-6">
      <div className="mx-auto flex max-w-7xl gap-4">
        <Sidebar />
        <main className="flex-1 space-y-4">
          <Navbar title={title} />
          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
