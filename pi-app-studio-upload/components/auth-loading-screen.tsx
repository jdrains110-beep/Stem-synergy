"use client";

import { usePiAuth } from "@/contexts/pi-auth-context";

export function AuthLoadingScreen() {
  const { authMessage, reinitialize } = usePiAuth();
  const isError = authMessage.toLowerCase().includes("failed") || 
                  authMessage.toLowerCase().includes("timeout") ||
                  authMessage.toLowerCase().includes("error");

  const goToSetup = () => {
    window.location.href = '/setup';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full px-6 text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20" />
            {!isError && (
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            )}
            {isError && (
              <div className="absolute inset-0 w-20 h-20 rounded-full flex items-center justify-center text-4xl">
                ⚠️
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Stem Synergy</h2>
          <p className="text-sm text-muted-foreground">Pi Network Authentication</p>
          <p
            className={`text-sm font-medium ${
              isError ? "text-destructive" : "text-primary"
            }`}
          >
            {authMessage}
          </p>
        </div>

        {isError && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={reinitialize}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={goToSetup}
                className="flex-1 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-colors"
              >
                Go to Setup
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              If authentication keeps failing, visit the Setup page to configure the app
            </p>
          </div>
        )}

        {!isError && (
          <button
            onClick={goToSetup}
            className="text-sm text-muted-foreground hover:text-primary underline"
          >
            Taking too long? Go to Setup
          </button>
        )}
      </div>
    </div>
  );
}
