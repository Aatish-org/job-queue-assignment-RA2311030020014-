"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { DashboardLayout } from "../layouts/DashboardLayout";

function RouterView() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!user && pathname !== "/") {
      router.replace("/");
    }
  }, [pathname, router, user]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;

    login("demo-token", { id: "1", email: email.trim(), name: "Demo User" });
    router.push("/dashboard");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(120deg,_#050816,_#0b1020)] p-6 text-slate-100">
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  const contentMap: Record<string, { title: string; body: string }> = {
    "/dashboard": { title: "Dashboard", body: "Dashboard overview" },
    "/projects": { title: "Projects", body: "Projects overview" },
    "/queues": { title: "Queues", body: "Queues overview" },
    "/jobs": { title: "Jobs", body: "Jobs overview" },
    "/workers": { title: "Workers", body: "Workers overview" },
    "/execution-logs": { title: "Execution Logs", body: "Execution logs overview" },
    "/dlq": { title: "DLQ", body: "Dead-letter queue overview" },
    "/settings": { title: "Settings", body: "Settings overview" },
  };

  const page = contentMap[pathname] ?? contentMap["/dashboard"];

  return (
    <DashboardLayout title={page.title}>
      <div className="text-slate-300">{page.body}</div>
    </DashboardLayout>
  );
}

export function AppRouter() {
  return (
    <AuthProvider>
      <RouterView />
    </AuthProvider>
  );
}
