import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kamailio VoIP Web",
  description: "Next.js VoIP dashboard integrated with Kamailio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
