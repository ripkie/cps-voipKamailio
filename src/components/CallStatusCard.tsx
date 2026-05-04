"use client";

import { Phone, PhoneOff, Radio, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

const statuses = ["Idle", "Calling", "Ringing", "In Call", "Call Ended"] as const;
type CallStatus = (typeof statuses)[number];

export function CallStatusCard({ number }: { number?: string }) {
  const [status, setStatus] = useState<CallStatus>("Idle");

  useEffect(() => {
    if (status !== "Calling") return;

    const timers = [
      setTimeout(() => setStatus("Ringing"), 1400),
      setTimeout(() => setStatus("In Call"), 3000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [status]);

  const statusColor =
    status === "In Call"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Call Ended"
      ? "bg-rose-100 text-rose-700"
      : status === "Ringing"
      ? "bg-amber-100 text-amber-700"
      : "bg-[var(--color-brand-light)] text-[var(--color-brand-navy)]";

  return (
    <div className="glass relative overflow-hidden rounded-[2.25rem] p-6 shadow-2xl shadow-blue-950/10">
      <div className="absolute right-[-5rem] top-[-5rem] h-48 w-48 rounded-full bg-[rgba(111,150,209,0.18)] blur-2xl" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Call Status</p>
            <h2 className="mt-2 text-3xl font-bold text-gradient">{status}</h2>
          </div>
          <div className={`rounded-full px-4 py-2 text-sm font-bold ${statusColor}`}>
            Realtime Mock
          </div>
        </div>

        <div className="rounded-[2rem] bg-[var(--color-brand-navy)] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Destination Number</p>
              <p className="mt-2 text-3xl font-bold">{number || "1002"}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              {status === "In Call" ? <Volume2 /> : <Radio />}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStatus("Calling")}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-brand-blue)] px-5 py-4 font-bold text-white transition hover:brightness-105"
            >
              <Phone size={18} /> Start Call
            </button>
            <button
              onClick={() => setStatus("Call Ended")}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-4 font-bold text-white transition hover:bg-white/20"
            >
              <PhoneOff size={18} /> End Call
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {["Calling", "Ringing", "In Call", "Ended"].map((item) => (
            <div key={item} className="rounded-2xl bg-white p-3 text-center text-xs font-semibold text-slate-500 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
