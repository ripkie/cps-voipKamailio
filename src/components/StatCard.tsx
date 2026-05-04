import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="glass noise relative overflow-hidden rounded-[2rem] p-6 shadow-xl shadow-blue-950/5">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-[var(--color-brand-navy)]">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-brand-light)] p-3 text-[var(--color-brand-blue)]">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
