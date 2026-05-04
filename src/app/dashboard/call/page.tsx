"use client";

import { Shell } from "@/components/Shell";
import {
  CircleDot,
  Grid3X3,
  MicOff,
  Phone,
  PlusCircle,
  Repeat2,
  Volume2,
  Delete,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function formatTime(seconds: number) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function CallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const number = searchParams.get("number") || "+62 821 9876 5432";
  const type = searchParams.get("type") || "call";

  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [hold, setHold] = useState(false);
  const [record, setRecord] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [transferNumber, setTransferNumber] = useState("");
  const [dtmfNumber, setDtmfNumber] = useState("");

  useEffect(() => {
    if (hold) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hold]);

  function endCall() {
    router.push("/dashboard");
  }

  return (
    <Shell>
      <section className="flex min-h-[calc(100vh-150px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-5xl rounded-[1.75rem] bg-[var(--color-brand-navy)] px-8 py-8 text-white shadow-2xl shadow-blue-950/20">
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-4xl font-black text-white">
              RD
            </div>

            <h1 className="mt-6 text-xl font-black">{number}</h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/30">
              {hold ? "ON HOLD" : "IN CALL"} · via Kamailio SIP ·{" "}
              {type === "video" ? "Video Call" : "Voice Call"}
            </p>

            <p className="mt-6 font-mono text-3xl font-black">
              {formatTime(seconds)}
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <CallAction
              icon={<MicOff size={22} />}
              label={muted ? "Muted" : "Mute"}
              active={muted}
              onClick={() => setMuted(!muted)}
            />

            <CallAction
              icon={<Volume2 size={22} />}
              label={speaker ? "Speaker On" : "Speaker"}
              active={speaker}
              onClick={() => setSpeaker(!speaker)}
            />

            <CallAction
              icon={<PlusCircle size={22} />}
              label={hold ? "Resume" : "Hold"}
              active={hold}
              onClick={() => setHold(!hold)}
            />

            <CallAction
              icon={<CircleDot size={22} />}
              label={record ? "Recording" : "Record"}
              active={record}
              onClick={() => setRecord(!record)}
            />

            <CallAction
              icon={<Repeat2 size={22} />}
              label="Transfer"
              active={showTransfer}
              onClick={() => setShowTransfer(!showTransfer)}
            />

            <CallAction
              icon={<Grid3X3 size={22} />}
              label="Keypad"
              active={showKeypad}
              onClick={() => setShowKeypad(!showKeypad)}
            />
          </div>

          {showTransfer && (
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl bg-white/10 p-4">
              <p className="mb-2 text-sm font-bold text-white/70">
                Transfer ke nomor:
              </p>
              <div className="flex gap-3">
                <input
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  placeholder="Contoh: 1002"
                  className="flex-1 rounded-xl bg-white px-4 py-3 font-bold text-[var(--color-brand-navy)] outline-none"
                />
                <button
                  onClick={() => {
                    alert(`Panggilan ditransfer ke ${transferNumber}`);
                    setShowTransfer(false);
                  }}
                  className="rounded-xl bg-[var(--color-brand-blue)] px-5 py-3 font-black text-white"
                >
                  Transfer
                </button>
              </div>
            </div>
          )}

          {showKeypad && (
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl bg-white/10 p-4">
              <div className="mb-4 rounded-xl bg-white/15 px-4 py-3 text-center font-mono text-xl font-black">
                {dtmfNumber || "DTMF Keypad"}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {keypad.map((key) => (
                  <button
                    key={key}
                    onClick={() => setDtmfNumber((prev) => prev + key)}
                    className="rounded-xl bg-white/15 py-3 text-xl font-black text-white hover:bg-white/25"
                  >
                    {key}
                  </button>
                ))}

                <button
                  onClick={() => setDtmfNumber((prev) => prev.slice(0, -1))}
                  className="col-span-3 flex items-center justify-center gap-2 rounded-xl bg-white/15 py-3 font-bold text-white hover:bg-white/25"
                >
                  <Delete size={18} />
                  Hapus
                </button>
              </div>
            </div>
          )}

          <button
            onClick={endCall}
            className="mx-auto mt-6 flex w-full max-w-3xl items-center justify-center gap-3 rounded-full bg-red-500 px-6 py-4 text-base font-black text-white transition hover:bg-red-600"
          >
            <Phone size={18} />
            Akhiri Panggilan
          </button>
        </div>
      </section>
    </Shell>
  );
}

function CallAction({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-5 py-4 text-sm font-bold transition ${active
          ? "bg-white text-[var(--color-brand-navy)] ring-4 ring-[var(--color-brand-blue)]"
          : "bg-white/15 text-white hover:bg-white/25"
        }`}
    >
      <span className="mx-auto mb-1 flex justify-center">{icon}</span>
      {label}
    </button>
  );
}