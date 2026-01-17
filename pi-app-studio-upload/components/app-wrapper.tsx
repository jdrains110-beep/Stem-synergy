"use client";

import type { ReactNode } from "react";
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context";
import { AuthLoadingScreen } from "./auth-loading-screen";

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = usePiAuth();
  
  if (isLoading || (!isAuthenticated && isLoading)) {
    return <AuthLoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <AuthLoadingScreen />;
  }
  
  return <>{children}</>;
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  );
}
