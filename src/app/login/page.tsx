"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneCall } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!phone) {
      alert("Nomor handphone wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // simpan user ke localStorage
      localStorage.setItem("voip_user", JSON.stringify(data.user));

      router.push("/dashboard");
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid-bg flex min-h-screen items-center justify-center px-5">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-blue-950/10 lg:grid-cols-2">
        
        {/* LEFT SIDE (TIDAK DIUBAH) */}
        <section className="glass-dark noise relative hidden min-h-155 flex-col justify-between overflow-hidden bg-brand-navy p-10 text-white lg:flex">
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

          <div className="relative z-10 rounded-4xl bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-blue-100">Status ready</p>
            <p className="mt-2 text-2xl font-bold">UDP SIP · WebRTC · Supabase</p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="p-8 md:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
              Welcome Back
            </p>
            <h2 className="mt-4 text-4xl font-black text-gradient">Login VoIP</h2>
            <p className="mt-3 text-slate-500">
              Masukkan nomor handphone yang sudah terdaftar di sistem.
            </p>

            {/* 🔥 FORM SUDAH AKTIF */}
            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <div>
                <label className="text-sm font-bold text-brand-navy">
                  Nomor Handphone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-brand-light px-5 py-4 text-brand-navy outline-none transition focus:border-brand-blue focus:bg-white"
                />
              </div>

              {/* 🔴 INI YANG DIGANTI: LINK → BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="block w-full rounded-2xl bg-brand-navy px-5 py-4 text-center font-bold text-white shadow-xl shadow-blue-950/20 transition hover:bg-[#0f2b73]"
              >
                {loading ? "Loading..." : "Masuk Dashboard"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Login sekarang sudah terhubung ke Supabase.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}