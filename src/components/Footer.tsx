export function Footer() {
  return (
    <footer className="border-t border-[rgba(111,150,209,0.18)] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 VoIP Web. Built with Next.js, Supabase, and Kamailio.</p>
        <p className="font-medium text-[var(--color-brand-navy)]">UDP SIP ready · WebRTC prepared</p>
      </div>
    </footer>
  );
}
