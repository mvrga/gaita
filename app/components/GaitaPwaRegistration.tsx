"use client";

import { useEffect } from "react";

export function GaitaPwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((registrationError) => {
      console.error("GAITA service worker registration failed", registrationError);
    });
  }, []);

  return null;
}
