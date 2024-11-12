"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install("app_9897742c74de3a2709c27ce0e7d2b759");
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
