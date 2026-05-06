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
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

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

function formatDuration(seconds: number) {
  if (!seconds) return "00:00";

  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return `${m}:${s}`;
}

const tabs: { label: string; value: CallType }[] = [
  { label: "Semua", value: "all" },
  { label: "Masuk", value: "incoming" },
  { label: "Keluar", value: "outgoing" },
  { label: "Tidak Terjawab", value: "missed" },
];

export default function CallLogPage() {
  const [activeTab, setActiveTab] = useState<CallType>("all");
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);


  useEffect(() => {
    async function fetchLogs() {
      const user = JSON.parse(localStorage.getItem("voip_user") || "{}");

      if (!user?.id) return;

      const { data, error } = await supabase
        .from("calls")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const mapped: CallLog[] = (data || []).map((log) => ({
        id: log.id,
        phoneNumber: log.destination_number,
        direction: log.direction,
        callType: log.call_type,
        status: log.result || log.status,
        duration: formatDuration(log.duration),
        date: new Date(log.started_at).toLocaleDateString(),
        time: new Date(log.started_at).toLocaleTimeString(),
      }));

      setCallLogs(mapped);
    }

    fetchLogs();
  }, []);


  const filteredLogs = useMemo(() => {
    if (activeTab === "all") return callLogs;

    if (activeTab === "missed") {
      return callLogs.filter((log) => log.status === "missed");
    }

    return callLogs.filter((log) => log.direction === activeTab);
  }, [activeTab, callLogs]);

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-7">
          <h1 className="text-5xl font-black text-brand-navy">
            Riwayat Panggilan
          </h1>
          <p className="mt-3 max-w-4xl text-lg leading-7 text-slate-400">
            Tinjau seluruh trafik komunikasi masuk dan keluar di jaringan.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-navy bg-white shadow-xl">
          <div className="bg-brand-navy px-6 py-4 text-center">
            <h2 className="text-lg font-black text-white">
              Riwayat Panggilan
            </h2>
          </div>

          <div className="grid grid-cols-4 border-b border-slate-300">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-5 font-black ${
                  activeTab === tab.value
                    ? "text-brand-navy"
                    : "text-slate-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredLogs.length > 0 ? (
            <div className="divide-y divide-slate-300">
              {filteredLogs.map((log) => (
                <CallLogItem key={log.id} log={log} />
              ))}
            </div>
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

  const icon = isVideo ? (
    <Video size={22} />
  ) : isMissed ? (
    <PhoneMissed size={22} />
  ) : isOutgoing ? (
    <PhoneOutgoing size={22} />
  ) : (
    <PhoneIncoming size={22} />
  );

  return (
    <div className="grid grid-cols-[80px_1fr_1fr_120px] px-8 py-5">
      <div className="flex items-center justify-center">{icon}</div>

      <div>
        <p className="font-black">{log.phoneNumber}</p>
        <p className="text-sm text-slate-400">{log.callType}</p>
      </div>

      <div>
        <p>{log.date}</p>
        <p className="text-sm text-slate-400">{log.time}</p>
      </div>

      <div className="text-right">
        <p>{log.status}</p>
        <p className="font-black">{log.duration}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-40 items-center justify-center text-slate-400">
      Belum ada riwayat panggilan
    </div>
  );
}