"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";
import { api, setApiAuthToken } from "@/lib/api";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
};

interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (scopes: string[]) => Promise<PiAuthResult>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, any>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: Error, payment?: any) => void;
        }
      ) => void;
    };
  }
}

interface PiAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  authMessage: string;
  piAccessToken: string | null;
  userData: LoginDTO | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      throw new Error("SDK URL is not set");
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("✅ Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("❌ Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  const authenticateAndLogin = async (): Promise<void> => {
    try {
      setAuthMessage("Authenticating with Pi Network...");
      console.log('[Auth] Starting Pi authentication with scopes: username, payments');
      
      // Request both username and payments scopes
      const piAuthResult = await window.Pi.authenticate(["username", "payments"]);
      
      console.log('[Auth] Pi authentication successful, user:', piAuthResult.user?.username);

      if (!piAuthResult?.accessToken) {
        throw new Error('No access token received from Pi Network');
      }

      setAuthMessage("Verifying with backend...");
      console.log('[Auth] Calling login API...');
      
      const loginRes = await api.post<LoginDTO>(BACKEND_URLS.LOGIN, {
        pi_auth_token: piAuthResult.accessToken,
      });

      console.log('[Auth] Login successful:', loginRes.data.username);

      setPiAccessToken(piAuthResult.accessToken);
      setApiAuthToken(piAuthResult.accessToken);
      setUserData(loginRes.data);
      
    } catch (error) {
      console.error('[Auth] Authentication/Login failed:', error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('PI_API_KEY') || error.message.includes('Server configuration')) {
          // Redirect to setup page if API key is missing
          if (typeof window !== 'undefined') {
            window.location.href = '/setup';
          }
          throw new Error('PI_API_KEY not configured. Redirecting to setup...');
        } else if (error.message.includes('401') || error.message.includes('Invalid')) {
          throw new Error('Authentication token rejected. Please check PI_API_KEY is set correctly.');
        } else if (error.message.includes('500') || error.message.includes('Server')) {
          throw new Error('Server error. Please ensure PI_API_KEY is configured in environment variables.');
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          throw new Error('Network error. Check your connection and try again.');
        }
      }
      
      throw error;
    }
  };

  const initializePiAndAuthenticate = async () => {
    // Prevent multiple simultaneous auth attempts
    if (hasAttemptedAuth) {
      console.log('[Auth] Authentication already attempted, skipping');
      return;
    }
    
    setHasAttemptedAuth(true);
    setIsLoading(true);
    
    // Set timeout for entire auth flow
    const timeoutId = setTimeout(() => {
      console.error('[Auth] Timeout after 30 seconds');
      setAuthMessage(
        'Authentication timed out. Click "Go to Setup" to configure the app manually.'
      );
      setIsAuthenticated(false);
      setIsLoading(false);
    }, 30000); // 30 second timeout

    try {
      setAuthMessage("Loading Pi Network SDK...");

      // Check if Pi SDK is already available (Pi App Studio environment)
      if (typeof window.Pi === "undefined") {
        console.log("Pi SDK not found, loading...");
        await loadPiSDK();
        
        // Wait a bit for SDK to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.log("Pi SDK already loaded");
      }

      if (typeof window.Pi === "undefined") {
        clearTimeout(timeoutId);
        setIsLoading(false);
        throw new Error("Pi object not available - please open in Pi Browser");
      }

      setAuthMessage("Initializing Pi Network...");
      
      // Initialize Pi SDK
      try {
        await window.Pi.init({
          version: "2.0",
          sandbox: PI_NETWORK_CONFIG.SANDBOX,
        });
        console.log("✅ Pi SDK initialized");
      } catch (initError) {
        console.error("Pi SDK init error:", initError);
        // SDK might already be initialized in Pi App Studio
        console.log("Continuing with authentication...");
      }

      await authenticateAndLogin();

      clearTimeout(timeoutId);
      setIsAuthenticated(true);
      setIsLoading(false);
      setAuthMessage("Authenticated successfully!");
    } catch (err) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      console.error("❌ Pi Network initialization failed:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      
      // If server error about PI_API_KEY, show setup message
      if (errorMsg.includes('PI_API_KEY') || errorMsg.includes('Server configuration')) {
        setAuthMessage(
          'Server configuration error: PI_API_KEY not set. Click "Go to Setup" below.'
        );
        return;
      }
      
      setAuthMessage(
        `Authentication failed: ${errorMsg}. Click "Try Again" or "Go to Setup".`
      );
    }
  };

  useEffect(() => {
    initializePiAndAuthenticate();
    // Only run once on mount
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    isLoading,
    authMessage,
    piAccessToken,
    userData,() => {
      setHasAttemptedAuth(false);
      return initializePiAndAuthenticate();
    }
    reinitialize: initializePiAndAuthenticate,
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

/**
 * Hook to access Pi Network authentication state and user data
 *
 * Must be used within a component wrapped by PiAuthProvider.
 * Provides read-only access to authentication state and user data.
 *
 * @returns {PiAuthContextType} Authentication state and methods
 * @throws {Error} If used outside of PiAuthProvider
 *
 * @example
 * const { piAccessToken, userData, isAuthenticated, reinitialize } = usePiAuth();
 */
export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
