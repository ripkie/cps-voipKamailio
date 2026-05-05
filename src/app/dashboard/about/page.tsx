"use client";

import { Shell } from "@/components/Shell";
import {
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { useEffect, useState } from "react";

type VoipUser = {
  id?: string;
  name?: string;
  phone_number?: string;
  sip_username?: string;
  sip_domain?: string;
};

const mockAccounts = [
  {
    name: "Farras Digidaw",
    phone: "+62 812 3456 7890",
    extension: "1001",
    voip: "192.0.0.0",
    status: "Online",
    color: "FD",
  },
  {
    name: "Kanzler Sosis",
    phone: "+62 812 1111 2222",
    extension: "1004",
    voip: "192.0.0.4",
    status: "Offline",
    color: "KS",
  },
  {
    name: "Ray Kicaw",
    phone: "+62 812 2222 3333",
    extension: "1005",
    voip: "192.0.0.5",
    status: "Online",
    color: "RK",
  },
  {
    name: "Nora Ihiy",
    phone: "+62 812 3333 4444",
    extension: "1006",
    voip: "192.0.0.6",
    status: "Online",
    color: "NI",
  },
];

export default function AboutPage() {
  const [user, setUser] = useState<VoipUser | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("voip_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const activeUser = {
    name: user?.name || "Farras",
    phone: user?.phone_number || "+62 812 3456 7890",
    extension: user?.sip_username || "1001",
    server: user?.sip_domain || "Kamailio",
  };

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="mb-4 text-xl font-black text-slate-400">About Web</p>

        <InfoSection title="Koneksi SIP">
          <InfoRow label="Server" value={activeUser.server} />
          <InfoRow
            label="SIP Address"
            value={`${activeUser.extension}@${activeUser.server}`}
          />
          <InfoRow label="Protokol" value="UDP" strong />
          <InfoRow label="Latensi" value="< 20ms" success />
          <InfoRow label="Codec Audio" value="G.711" badge />
          <InfoRow label="Status Koneksi" value="Terhubung" success />
        </InfoSection>

        <InfoSection title="Tentang Website">
          <InfoRow
            label="Deskripsi"
            value="Website VoIP terintegrasi dengan server Kamailio untuk komunikasi suara real-time."
          />
          <InfoRow label="Server VoIP" value="Kamailio SIP Server" />
          <InfoRow label="Protokol Komunikasi" value="UDP/SIP" strong />
          <InfoRow label="Codec" value="G.711 PCMU / PCMA" />
        </InfoSection>

        <InfoSection title="Fitur Utama">
          <Feature
            number="1"
            title="Dial Pad & Panggilan Suara"
            text="Melakukan panggilan suara via jaringan VoIP Kamailio menggunakan protokol UDP."
          />
          <Feature
            number="2"
            title="Riwayat Panggilan (Call Log)"
            text="Menampilkan log panggilan lengkap: jenis, waktu, status, durasi, dan nomor tujuan."
          />
          <Feature
            number="3"
            title="Status Panggilan Real-time"
            text="Menampilkan status langsung: Calling, Ringing, In Call, dan Call Ended."
          />
          <Feature
            number="4"
            title="Autentikasi SIP"
            text="Login menggunakan nomor handphone yang terdaftar di server VoIP Kamailio."
          />
          <Feature
            number="5"
            title="Kontrol Panggilan"
            text="Fitur Mute, Speaker, Hold, Record, Video Call, dan Keypad saat panggilan aktif."
          />
        </InfoSection>

        <InfoSection title="Detail Akun">
          <div className="divide-y divide-slate-200">
            {mockAccounts.map((account, index) => {
              const isOpen = openIndex === index;
              const online = account.status === "Online";

              return (
                <div key={account.extension} className="py-4">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-sm font-black text-white">
                        {account.color}
                      </div>

                      <div className="text-left">
                        <p className="font-black text-[var(--color-brand-navy)]">
                          {account.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Extension: {account.extension} •{" "}
                          <span
                            className={
                              online ? "text-green-600" : "text-red-600"
                            }
                          >
                            {account.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {isOpen && (
                    <div className="ml-14 mt-4 overflow-hidden rounded-xl border border-slate-300">
                      <DetailRow label="Nama Pengguna" value={account.name} />
                      <DetailRow label="Nomor HP" value={account.phone} />
                      <DetailRow
                        label="Extension"
                        value={`${account.extension} (Main HQ)`}
                      />
                      <DetailRow label="VoIP" value={account.voip} />
                      <DetailRow
                        label="Status"
                        value={account.status}
                        status={online}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </InfoSection>
      </section>
    </Shell>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-300 bg-white">
      <div className="bg-[var(--color-brand-navy)] px-6 py-4">
        <h2 className="text-lg font-black text-white">{title}</h2>
      </div>

      <div>{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  strong,
  success,
  badge,
}: {
  label: string;
  value: string;
  strong?: boolean;
  success?: boolean;
  badge?: boolean;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] border-b border-slate-200 px-6 py-3 text-sm last:border-b-0">
      <p className="font-black text-[var(--color-brand-navy)]">{label}</p>
      <p
        className={`text-right ${success
          ? "font-black text-green-500"
          : strong
            ? "font-black text-blue-600"
            : "text-slate-500"
          }`}
      >
        {badge ? (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-600">
            {value}
          </span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 border-b border-slate-200 px-6 py-4 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-navy)] text-sm font-black text-white">
        {number}
      </div>

      <div>
        <p className="font-black text-[var(--color-brand-navy)]">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: boolean;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr] border-b border-slate-300 text-sm last:border-b-0">
      <div className="bg-slate-100 px-4 py-3 font-black text-slate-600">
        {label}
      </div>

      <div className="px-4 py-3 text-right font-semibold text-slate-700">
        {typeof status === "boolean" ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              }`}
          >
            {status ? <CircleCheck size={12} /> : <CircleX size={12} />}
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}