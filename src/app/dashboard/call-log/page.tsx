"use client";

import { Shell } from "@/components/Shell";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareText,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

type CallType = "all" | "incoming" | "outgoing" | "missed";

type CallLog = {
  id: string;
  phoneNumber: string;
  direction: "incoming" | "outgoing";
  callType: "voice" | "video";
  status: "ended" | "missed" | "in_call";
  duration: string;
  date: string;
  time: string;
};

const callLogs: CallLog[] = [
  {
    id: "1",
    phoneNumber: "+62 091 2345 7291",
    direction: "outgoing",
    callType: "voice",
    status: "ended",
    duration: "03:22",
    date: "Oct 24, 2030",
    time: "09.14 PM",
  },
  {
    id: "2",
    phoneNumber: "+62 091 2345 7291",
    direction: "incoming",
    callType: "voice",
    status: "missed",
    duration: "00:00",
    date: "Oct 24, 2030",
    time: "09.14 PM",
  },
  {
    id: "3",
    phoneNumber: "+62 091 2345 7291",
    direction: "incoming",
    callType: "video",
    status: "ended",
    duration: "03:22",
    date: "Oct 24, 2030",
    time: "09.14 PM",
  },
  {
    id: "4",
    phoneNumber: "+62 091 2345 7291",
    direction: "incoming",
    callType: "video",
    status: "in_call",
    duration: "03:22",
    date: "Oct 24, 2030",
    time: "09.14 PM",
  },
];

const tabs: { label: string; value: CallType }[] = [
  { label: "Semua", value: "all" },
  { label: "Masuk", value: "incoming" },
  { label: "Keluar", value: "outgoing" },
  { label: "Tidak Terjawab", value: "missed" },
];

export default function CallLogPage() {
  const [activeTab, setActiveTab] = useState<CallType>("all");

  const filteredLogs = useMemo(() => {
    if (activeTab === "all") return callLogs;

    if (activeTab === "missed") {
      return callLogs.filter((log) => log.status === "missed");
    }

    return callLogs.filter((log) => log.direction === activeTab);
  }, [activeTab]);

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-7">
          <h1 className="text-5xl font-black text-[var(--color-brand-navy)]">
            Riwayat Panggilan
          </h1>
          <p className="mt-3 max-w-4xl text-lg leading-7 text-slate-400">
            Tinjau seluruh trafik komunikasi masuk dan keluar di jaringan. Log
            berpresisi tinggi ini dikelola langsung oleh node Kamailio.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--color-brand-navy)] bg-white shadow-xl shadow-blue-950/5">
          <div className="bg-[var(--color-brand-navy)] px-6 py-4 text-center">
            <h2 className="text-lg font-black text-white">
              Riwayat Panggilan
            </h2>
          </div>

          <div className="grid grid-cols-4 border-b border-slate-300">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative px-4 py-5 text-center text-base font-black transition ${activeTab === tab.value
                  ? "text-[var(--color-brand-navy)]"
                  : "text-slate-400 hover:text-[var(--color-brand-navy)]"
                  }`}
              >
                {tab.label}

                {activeTab === tab.value && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[var(--color-brand-navy)]" />
                )}
              </button>
            ))}
          </div>

          {filteredLogs.length > 0 ? (
            <>
              <div className="divide-y divide-slate-300">
                {filteredLogs.map((log) => (
                  <CallLogItem key={log.id} log={log} />
                ))}
              </div>

              <div className="flex items-center justify-between px-8 py-5">
                <p className="text-sm font-semibold text-slate-400">
                  Showing 1 to {filteredLogs.length} records
                </p>

                <div className="flex gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-400 transition hover:bg-slate-100">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-400 transition hover:bg-slate-100">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </Shell>
  );
}

function CallLogItem({ log }: { log: CallLog }) {
  const isMissed = log.status === "missed";
  const isInCall = log.status === "in_call";
  const isOutgoing = log.direction === "outgoing";
  const isVideo = log.callType === "video";

  const colorClass = isMissed
    ? "text-red-500"
    : isInCall
      ? "text-green-500"
      : "text-[var(--color-brand-navy)]";

  const avatarClass = isMissed
    ? "bg-red-100"
    : isInCall
      ? "bg-green-100"
      : "bg-slate-100";

  const icon = isVideo ? (
    <Video size={22} />
  ) : isMissed ? (
    <PhoneMissed size={22} />
  ) : isOutgoing ? (
    <PhoneOutgoing size={22} />
  ) : (
    <PhoneIncoming size={22} />
  );

  const directionLabel = isMissed
    ? isVideo
      ? "Video Call Tidak Terjawab"
      : "Panggilan Tidak Terjawab"
    : isOutgoing
      ? isVideo
        ? "Video Call Keluar"
        : "Panggilan Keluar"
      : isVideo
        ? "Video Call Masuk"
        : "Panggilan Masuk";

  const statusLabel = isMissed
    ? "Missed"
    : isInCall
      ? "In Call"
      : "Ended";

  const badgeClass = isMissed
    ? "text-red-500"
    : isInCall
      ? "rounded-full bg-green-100 px-3 py-1 text-green-600"
      : "rounded-full bg-slate-100 px-3 py-1 text-slate-500";

  return (
    <div className="grid grid-cols-[80px_1.2fr_1fr_120px] items-center px-8 py-5">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${avatarClass}`}
      >
        <span className={colorClass}>{icon}</span>
      </div>

      <div>
        <p className={`text-lg font-black ${colorClass}`}>
          {log.phoneNumber}
        </p>

        <div
          className={`mt-1 flex items-center gap-2 text-sm font-semibold ${colorClass}`}
        >
          {icon}
          <span>{directionLabel}</span>
        </div>
      </div>

      <div>
        <p className="text-lg font-black text-slate-600">{log.date}</p>
        <p className="text-sm font-bold text-slate-400">{log.time}</p>
      </div>

      <div className="text-right">
        <p className={`text-sm font-black ${badgeClass}`}>{statusLabel}</p>
        {!isMissed && (
          <p className="mt-1 text-sm font-black text-[var(--color-brand-navy)]">
            {log.duration}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-0 rounded-[3rem] bg-blue-100 blur-sm" />
          <div className="relative rotate-[-15deg] rounded-2xl bg-blue-500 p-5 text-white shadow-xl">
            <MessageSquareText size={64} />
          </div>
          <div className="relative -ml-8 mt-16 rotate-[12deg] rounded-2xl bg-blue-300 p-4 text-white shadow-xl">
            <PhoneCall size={48} />
          </div>
        </div>

        <p className="mt-6 text-lg font-black text-slate-400">
          Belum ada riwayat panggilan
        </p>
      </div>
    </div>
  );
}