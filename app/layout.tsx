import type { Metadata, Viewport } from "next";

import { GaitaPwaRegistration } from "./components/GaitaPwaRegistration";
import "./globals.css";

const appleWebAppCapable = "yes";
const appleWebAppStatusBarStyle = "black-translucent";

export const metadata: Metadata = {
  title: "GAITA Credit Pool",
  description: "Proof of Ship credit reputation flow for Celo.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GAITA",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content={appleWebAppCapable} />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={appleWebAppStatusBarStyle}
        />
      </head>
      <body>
        <GaitaPwaRegistration />
        {children}
      </body>
    </html>
  );
}
