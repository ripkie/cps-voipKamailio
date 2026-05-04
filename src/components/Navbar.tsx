"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneCall } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/call-log", label: "Call Log" },
  { href: "/dashboard/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(111,150,209,0.18)] bg-white/80 backdrop-blur-xl">
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

        <Link
          href="/login"
          className="rounded-full bg-[var(--color-brand-navy)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0f2b73]"
        >
          Logout
        </Link>
      </nav>
    </header>
  );
}
