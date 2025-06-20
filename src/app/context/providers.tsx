"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { AuthProvider } from "./auth-context";
import Loading from "../components/loading";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, show loading state
  if (!mounted) {
    return <Loading />;
  }

  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
