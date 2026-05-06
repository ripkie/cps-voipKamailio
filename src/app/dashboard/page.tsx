"use client";

import { Shell } from "@/components/Shell";
import { Phone, User, Video, Delete } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JsSIP from "jssip";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

type VoipUser = {
  name?: string;
  phone_number?: string;
  sip_username?: string;
  sip_domain?: string;
  sip_password?: string;
};


function formatPhone(num: string) {
  const cleaned = num.replace(/\D/g, "");
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1-");
}

export default function DashboardPage() {
  const router = useRouter();
  const [number, setNumber] = useState("");
  const [user, setUser] = useState<VoipUser | null>(null);

  useEffect(() => {
  const stored = localStorage.getItem("voip_user");

  if (stored) {
    const parsedUser = JSON.parse(stored);

    setUser(parsedUser);

    const socket = new JsSIP.WebSocketInterface(
      "ws://104.208.67.198:8080/ws"
    );

    const configuration = {
      sockets: [socket],
      uri: `sip:${parsedUser.sip_username}@${parsedUser.sip_domain}`,
      password: parsedUser.sip_password,
    };

    const ua = new JsSIP.UA(configuration);

    ua.start();

    ua.on("registered", () => {
      console.log("SIP REGISTERED");
    });

    ua.on("registrationFailed", (e: any) => {
      console.log("REGISTER FAILED", e);
    });
  }
}, []);

  function goToCall(type: "call" | "video") {
    const query = new URLSearchParams({
      number,
      type,
    });
    if (!number) {
      alert("Masukkan nomor tujuan terlebih dahulu");
      return;
    }
    router.push(`/dashboard/call?${query.toString()}`);
  }

  const activeUser = {
    name: user?.name || "Unknown",
    phone: user?.phone_number || "-",
    extension: user?.sip_username || "-",
    server: user?.sip_domain || "kamailio",
  };

  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          

          <div className="rounded-2xl bg-white p-6 shadow-xl shadow-blue-950/5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy text-white">
                <User size={34} />
              </div>

              <div>
                <h1 className="text-2xl font-black text-brand-navy">
                  {activeUser.name}
                </h1>
                <p className="text-base font-semibold text-brand-blue">
                  Kamailio SIP
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <InfoBox label="No Telepon" value={activeUser.phone} />
              <InfoBox label="Server" value={activeUser.server} />
              <InfoBox label="Extension" value={activeUser.extension} />
              <InfoBox label="Protocol" value="UDP" />
            </div>
          </div>


          <div className="rounded-2xl bg-white p-0 shadow-xl shadow-blue-950/5">
            <div className="rounded-t-2xl bg-brand-navy px-5 py-3">
              <h2 className="text-2xl font-black text-white">DialPad</h2>
            </div>

            <div className="p-6">

              <div
                className={`mb-5 rounded-xl bg-[#d7deef] px-5 py-3 text-center text-2xl font-black tracking-wide ${
                  number ? "text-black" : "text-gray-400"
                }`}
              >
                {number ? formatPhone(number) : "Masukkan nomor"}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {keys.map((key) => (
                  <button
                    key={key}
                    onClick={() =>
                      setNumber((prev) => prev.replace(/\D/g, "") + key)
                    }
                    className="rounded-xl bg-[#d7deef] py-3 text-2xl font-black text-black transition hover:brightness-95"
                  >
                    {key}
                  </button>
                ))}


                <button
                  onClick={() =>
                    setNumber((prev) =>
                      prev.replace(/\D/g, "").slice(0, -1)
                    )
                  }
                  className="flex items-center justify-center rounded-xl bg-[#d7deef] py-3 text-black transition hover:brightness-95"
                >
                  <Delete size={30} />
                </button>


                <button
                  onClick={() => goToCall("call")}
                  className="flex items-center justify-center rounded-xl bg-[#d7deef] py-3 text-black transition hover:brightness-95"
                >
                  <Phone size={30} />
                </button>


                <button
                  onClick={() => goToCall("video")}
                  className="flex items-center justify-center rounded-xl bg-[#d7deef] py-3 text-black transition hover:brightness-95"
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
      <p></p>
    </div>
  );
}
