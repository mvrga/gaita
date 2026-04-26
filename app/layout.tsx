import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "GAITA Credit Pool",
  description: "Proof of Ship credit reputation flow for Celo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
