import { UserRound, Phone, Server } from "lucide-react";

export function UserCard() {
  return (
    <div className="glass rounded-[2rem] p-6 shadow-xl shadow-blue-950/5">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-brand-navy)] text-white">
          <UserRound />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-brand-navy)]">Rifki Widya</h2>
          <p className="text-sm text-slate-500">Registered VoIP User</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
          <Phone className="text-[var(--color-brand-blue)]" size={18} />
          <span className="font-semibold">08123456789</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
          <Server className="text-[var(--color-brand-blue)]" size={18} />
          <span className="font-semibold">1001@sip.example.com</span>
        </div>
      </div>
    </div>
  );
}
