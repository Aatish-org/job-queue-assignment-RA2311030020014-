"use client";

import { Bell, MoonStar, Search, SunMedium } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Navbar({ title }: { title: string }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-950/60 px-6 py-4 shadow-lg shadow-black/10 backdrop-blur">
      <div>
        <p className="text-sm text-slate-400">Operations Center</p>
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400">
          <Search size={16} />
          <input className="bg-transparent outline-none" placeholder="Search" />
        </label>
        <button className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300">
          <Bell size={16} />
        </button>
        <button className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300">
          <MoonStar size={16} />
        </button>
        <button onClick={logout} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
          {user?.email ?? "Account"}
        </button>
      </div>
    </header>
  );
}
