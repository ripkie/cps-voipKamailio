import Link from "next/link";
import { PhoneCall } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center px-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-blue-950/10 lg:grid-cols-2">
        <section className="glass-dark noise relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[var(--color-brand-navy)] p-10 text-white lg:flex">
          <div className="relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <PhoneCall />
            </div>
            <h1 className="mt-10 text-5xl font-black leading-tight">
              Web VoIP modern untuk Kamailio.
            </h1>
            <p className="mt-5 max-w-md text-blue-100">
              Login dengan nomor handphone, lakukan panggilan SIP, tampilkan status realtime, dan simpan call log.
            </p>
          </div>

          <div className="relative z-10 rounded-[2rem] bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-blue-100">Status ready</p>
            <p className="mt-2 text-2xl font-bold">UDP SIP · WebRTC · Supabase</p>
          </div>
        </section>

        <section className="p-8 md:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brand-blue)]">
              Welcome Back
            </p>
            <h2 className="mt-4 text-4xl font-black text-gradient">Login VoIP</h2>
            <p className="mt-3 text-slate-500">
              Masukkan nomor handphone yang sudah terdaftar di sistem.
            </p>

            <form className="mt-10 space-y-5">
              <div>
                <label className="text-sm font-bold text-[var(--color-brand-navy)]">Nomor Handphone</label>
                <input
                  placeholder="Contoh: 08123456789"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[var(--color-brand-light)] px-5 py-4 text-[var(--color-brand-navy)] outline-none transition focus:border-[var(--color-brand-blue)] focus:bg-white"
                />
              </div>

              <Link
                href="/dashboard"
                className="block rounded-2xl bg-[var(--color-brand-navy)] px-5 py-4 text-center font-bold text-white shadow-xl shadow-blue-950/20 transition hover:bg-[#0f2b73]"
              >
                Masuk Dashboard
              </Link>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Demo login belum memakai Supabase Auth. Integrasi DB akan dibuat di step berikutnya.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
