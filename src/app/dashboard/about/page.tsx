import { Shell } from "@/components/Shell";
import { UserCard } from "@/components/UserCard";
import { Server, ShieldCheck, Database } from "lucide-react";

export default function AboutPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brand-blue)]">About</p>
          <h1 className="mt-3 text-4xl font-black text-gradient md:text-5xl">Tentang Aplikasi</h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Website ini disiapkan untuk integrasi dengan server VoIP Kamailio menggunakan SIP/UDP melalui jalur WebRTC/SIP WebSocket.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <UserCard />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { title: "Kamailio", desc: "SIP routing dan autentikasi VoIP.", icon: Server },
              { title: "Supabase", desc: "Database user dan call log.", icon: Database },
              { title: "Secure Flow", desc: "API route untuk validasi request.", icon: ShieldCheck },
            ].map((item) => (
              <div key={item.title} className="glass rounded-[2rem] p-6 shadow-xl shadow-blue-950/5">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-brand-light)] text-[var(--color-brand-blue)]">
                  <item.icon />
                </div>
                <h2 className="text-xl font-bold text-[var(--color-brand-navy)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
