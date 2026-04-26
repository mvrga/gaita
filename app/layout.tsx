import type { Metadata, Viewport } from "next";

import { GaitaPwaRegistration } from "./components/GaitaPwaRegistration";
import "./globals.css";

const appleWebAppCapable = "yes";
const appleWebAppStatusBarStyle = "black-translucent";

export const metadata: Metadata = {
  title: "GAITA Financial Reputation",
  description: "Proof of Ship financial reputation flow for Celo.",
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
        <meta
          name="talentapp:project_verification"
          content="1d779030e2b11df4a102d08b37f5f58b97efa0f499e1266d8096a18f6d055e86f72a2be3f6a9f416c4f2eb7c7f2c94956da3487bc43c5328519f7adef97bad2e"
        />
      </head>
      <body>
        <GaitaPwaRegistration />
        {children}
      </body>
    </html>
  );
}
