"use client";

import { Shell } from "@/components/Shell";
import { Phone, User, Video, Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export default function DashboardPage() {
  const router = useRouter();
  const [number, setNumber] = useState("0812-1122-3344");

  function goToCall(type: "call" | "video") {
    const query = new URLSearchParams({
      number,
      type,
    });

    router.push(`/dashboard/call?${query.toString()}`);
  }

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT: User Info */}
          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-blue-950/5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-brand-navy)] text-white">
                <User size={34} />
              </div>

              <div>
                <h1 className="text-2xl font-black text-[var(--color-brand-navy)]">
                  Farras
                </h1>
                <p className="text-base font-semibold text-[var(--color-brand-blue)]">
                  Kamailio SIP
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoBox label="No Telepon" value="0812-1234-5678" />
              <InfoBox label="Server" value="kamailio" />
              <InfoBox label="Extension" value="1001" />
              <InfoBox label="Protocol" value="UDP" />
            </div>
          </div>

          {/* RIGHT: DialPad */}
          <div className="rounded-2xl bg-white p-0 shadow-xl shadow-blue-950/5">
            <div className="rounded-t-2xl bg-[var(--color-brand-navy)] px-5 py-3">
              <h2 className="text-2xl font-black text-white">DialPad</h2>
            </div>

            <div className="p-6">
              <div className="mb-5 rounded-xl bg-[#d7deef] px-5 py-3 text-center text-2xl font-black tracking-wide text-black">
                {number || "Masukkan nomor"}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {keys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setNumber((prev) => prev + key)}
                    className="rounded-xl bg-[#d7deef] py-3 text-2xl font-black text-black transition hover:brightness-95"
                  >
                    {key}
                  </button>
                ))}

                <button
                  onClick={() => setNumber((prev) => prev.slice(0, -1))}
                  className="flex items-center justify-center rounded-xl bg-[#d7deef] py-3 text-black transition hover:brightness-95"
                  aria-label="hapus nomor"
                >
                  <Delete size={30} />
                </button>

                <button
                  onClick={() => goToCall("call")}
                  className="flex items-center justify-center rounded-xl bg-[#d7deef] py-3 text-black transition hover:brightness-95"
                  aria-label="mulai panggilan"
                >
                  <Phone size={30} />
                </button>

                <button
                  onClick={() => goToCall("video")}
                  className="flex items-center justify-center rounded-xl bg-[#d7deef] py-3 text-black transition hover:brightness-95"
                  aria-label="mulai video call"
                >
                  <Video size={30} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#d7deef] px-3 py-3">
      <p className="text-sm font-bold text-slate-400">{label}</p>
      <p className="text-base font-black text-black">{value}</p>
    </div>
  );
}
