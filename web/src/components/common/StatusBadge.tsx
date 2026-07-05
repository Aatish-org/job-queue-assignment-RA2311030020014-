export function StatusBadge({ status }: { status?: string }) {
  const normalized = (status || "UNKNOWN").toUpperCase();
  const styles: Record<string, string> = {
    QUEUED: "bg-sky-500/15 text-sky-300",
    RUNNING: "bg-amber-500/15 text-amber-300",
    COMPLETED: "bg-emerald-500/15 text-emerald-300",
    FAILED: "bg-rose-500/15 text-rose-300",
    PAUSED: "bg-violet-500/15 text-violet-300",
    ACTIVE: "bg-emerald-500/15 text-emerald-300",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[normalized] || "bg-slate-500/15 text-slate-300"}`}>
      {normalized}
    </span>
  );
}
