"use client";

import { Delete, Phone } from "lucide-react";
import { useState } from "react";
import { CallStatusCard } from "./CallStatusCard";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export function DialPad() {
  const [number, setNumber] = useState("");

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="glass rounded-[2.25rem] p-6 shadow-2xl shadow-blue-950/10">
        <div className="mb-6 rounded-[1.75rem] bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-400">Nomor Tujuan</p>
          <p className="mt-2 min-h-10 text-3xl font-bold tracking-widest text-[var(--color-brand-navy)]">
            {number || "—"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => setNumber((prev) => prev + key)}
              className="rounded-3xl bg-white py-5 text-2xl font-bold text-[var(--color-brand-navy)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setNumber((prev) => prev.slice(0, -1))}
            className="flex items-center justify-center gap-2 rounded-3xl bg-[var(--color-brand-light)] py-4 font-bold text-[var(--color-brand-navy)]"
          >
            <Delete size={18} /> Hapus
          </button>
          <button className="flex items-center justify-center gap-2 rounded-3xl bg-[var(--color-brand-blue)] py-4 font-bold text-white shadow-lg shadow-blue-900/20">
            <Phone size={18} /> Call
          </button>
        </div>
      </div>

      <CallStatusCard number={number} />
    </div>
  );
}
