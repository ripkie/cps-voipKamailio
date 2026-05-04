import { DialPad } from "@/components/DialPad";
import { Shell } from "@/components/Shell";

export default function DialPadPage() {
  return (
    <Shell>
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brand-blue)]">Dial Pad</p>
          <h1 className="mt-3 text-4xl font-black text-gradient md:text-5xl">Buat Panggilan</h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Masukkan nomor tujuan, lalu mulai panggilan. Status realtime masih mock dan siap diganti ke event SIP.js/JsSIP.
          </p>
        </div>

        <DialPad />
      </section>
    </Shell>
  );
}
