"use client";

import { supabase } from "@/lib/supabase";
import { AlertCircle, PhoneCall } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/call-log", label: "Call Log" },
  { href: "/dashboard/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  function isActive(href: string) {
    return pathname === href;
  }

  async function handleLogout() {
    setLoading(true);

    // Logout Supabase Auth kalau nanti dipakai
    await supabase.auth.signOut();

    // Logout custom login yang sekarang kamu pakai
    localStorage.removeItem("voip_user");

    setLoading(false);
    router.push("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[rgba(111,150,209,0.18)] bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-brand-navy)] text-white shadow-lg shadow-blue-900/20">
              <PhoneCall size={20} />
            </span>

            <div>
              <p className="font-bold leading-none text-[var(--color-brand-navy)]">
                VoIP Web
              </p>
              <p className="text-xs text-slate-500">Kamailio Integration</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full bg-[var(--color-brand-light)] p-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive(link.href)
                    ? "bg-[var(--color-brand-navy)] text-white shadow-md shadow-blue-950/10"
                    : "text-[var(--color-brand-navy)] hover:bg-white hover:shadow-sm"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="rounded-full bg-[var(--color-brand-navy)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2b73]"
          >
            Logout
          </button>
        </nav>
      </header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--color-brand-navy)] p-8 text-center text-white shadow-2xl shadow-blue-950/30">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white text-[var(--color-brand-navy)]">
              <AlertCircle size={64} strokeWidth={2.5} />
            </div>

            <h2 className="text-lg font-black leading-6">
              Apakah Anda Yakin Ingin Keluar?
            </h2>

            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loading}
                className="rounded-full bg-white py-3 font-black text-[var(--color-brand-navy)] transition hover:bg-slate-100 disabled:opacity-60"
              >
                Tidak
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="rounded-full border border-white/70 py-3 font-black text-white transition hover:bg-white hover:text-[var(--color-brand-navy)] disabled:opacity-60"
              >
                {loading ? "Keluar..." : "Ya"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}