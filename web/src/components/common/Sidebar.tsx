"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderKanban, Layers3, BriefcaseBusiness, HardHat, ScrollText, ShieldAlert, Settings, UserCircle2 } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/queues", label: "Queues", icon: Layers3 },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/workers", label: "Workers", icon: HardHat },
  { href: "/execution-logs", label: "Execution Logs", icon: ScrollText },
  { href: "/dlq", label: "DLQ", icon: ShieldAlert },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 flex-col justify-between rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex">
      <div>
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <Layers3 size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">QueueOS</p>
            <p className="text-xs text-slate-400">Distributed Scheduling</p>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${active ? "bg-white/10 text-white shadow-lg shadow-indigo-500/10" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <UserCircle2 size={18} className="text-cyan-400" />
          <div>
            <p className="text-sm font-semibold text-white">Operations</p>
            <p className="text-xs text-slate-400">Secure control plane</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
