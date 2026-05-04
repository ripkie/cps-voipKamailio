import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-brand-white)]">
      <Navbar />
      <main className="grid-bg min-h-[calc(100vh-145px)]">{children}</main>
      <Footer />
    </div>
  );
}
