export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-8 text-center text-slate-400">
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
