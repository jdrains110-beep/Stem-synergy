"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG, BACKEND_URLS } from "@/lib/system-config";
import { api, setApiAuthToken } from "@/lib/api";
import type { PiAuthResult } from "@/types/pi-network";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
};

interface PiAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  authMessage: string;
  piAccessToken: string | null;
  userData: LoginDTO | null;
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

let sdkLoadingPromise: Promise<void> | null = null;
let sdkLoaded = false;

const loadPiSDK = (): Promise<void> => {
  // Guard: Return immediately if SDK already loaded
  if (sdkLoaded && typeof window !== "undefined" && window.Pi) {
    return Promise.resolve();
  }

  // Guard: Return existing promise if SDK is currently loading
  if (sdkLoadingPromise) {
    return sdkLoadingPromise;
  }

  // Guard: Check if we're in a browser environment
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load Pi SDK in non-browser environment"));
  }

  // Guard: Check if SDK is already available (e.g., Pi App Studio)
  if (window.Pi) {
    sdkLoaded = true;
    return Promise.resolve();
  }

  sdkLoadingPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      sdkLoadingPromise = null;
      reject(new Error("Pi SDK loading timeout after 15 seconds"));
    }, 15000);

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      clearTimeout(timeout);
      sdkLoadingPromise = null;
      reject(new Error("SDK URL is not configured"));
      return;
    }
    
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      clearTimeout(timeout);
      
      // Wait for window.Pi to be available
      const checkPi = setInterval(() => {
        if (window.Pi) {
          clearInterval(checkPi);
          sdkLoaded = true;
          sdkLoadingPromise = null;
          console.log("✅ Pi SDK loaded and ready");
          resolve();
        }
      }, 100);

      // Fallback timeout for Pi object check
      setTimeout(() => {
        clearInterval(checkPi);
        if (!window.Pi) {
          sdkLoadingPromise = null;
          reject(new Error("Pi SDK script loaded but window.Pi not available"));
        }
      }, 3000);
    };

    script.onerror = () => {
      clearTimeout(timeout);
      sdkLoadingPromise = null;
      console.error("❌ Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });

  return sdkLoadingPromise;
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const hasAttemptedAuth = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const authenticateAndLogin = async (): Promise<void> => {
    setAuthMessage("Authenticating with Pi Network...");
    console.log('[Auth] Starting Pi authentication with scopes: username, payments');
    
    // Guard: Ensure window.Pi exists
    if (!window.Pi) {
      throw new Error("Pi SDK not available");
    }

    // Request both username and payments scopes with meaningful message
    const piAuthResult = await window.Pi.authenticate(
      ["username", "payments"],
      {
        authMessage: "Stem Synergy needs access to authenticate you and process payments for blueprint generation services."
      }
    );
    
    console.log('[Auth] Pi authentication successful, user:', piAuthResult.user?.username);

    if (!piAuthResult?.accessToken) {
      throw new Error('No access token received from Pi Network');
    }

    setAuthMessage("Verifying with backend...");
    console.log('[Auth] Calling login API...');
    
    try {
      const loginRes = await api.post<LoginDTO>(BACKEND_URLS.LOGIN, {
        pi_auth_token: piAuthResult.accessToken,
      });

      console.log('[Auth] Login successful:', loginRes.data.username);

      // Only set token after both Pi auth AND backend login succeed
      setPiAccessToken(piAuthResult.accessToken);
      setApiAuthToken(piAuthResult.accessToken);
      setUserData(loginRes.data);
      
    } catch (error) {
      console.error('[Auth] Backend login failed:', error);
      
      // Surface backend errors clearly
      if (error instanceof Error) {
        const errorMessage = error.message || String(error);
        if (errorMessage.includes('PI_API_KEY') || errorMessage.includes('configuration')) {
          throw new Error('Server configuration error: PI_API_KEY not set. Please contact support or visit Setup page.');
        } else if (errorMessage.includes('401') || errorMessage.includes('Invalid')) {
          throw new Error('Authentication token rejected by server. Please ensure PI_API_KEY is configured correctly.');
        } else if (errorMessage.includes('500') || errorMessage.includes('Server')) {
          throw new Error('Server error during login. Please try again or contact support.');
        } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
      }
      
      throw new Error('Backend login failed: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const initializePiAndAuthenticate = async () => {
    // Prevent multiple simultaneous auth attempts
    if (hasAttemptedAuth.current) {
      console.log('[Auth] Authentication already attempted, skipping');
      return;
    }
    
    hasAttemptedAuth.current = true;
    setIsLoading(true);
    setIsError(false);
    
    // Set timeout for entire auth flow
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      console.error('[Auth] Timeout after 30 seconds');
      setAuthMessage(
        'Authentication timed out. Click "Try Again" or "Go to Setup" to configure manually.'
      );
      setIsAuthenticated(false);
      setIsLoading(false);
      setIsError(true);
    }, 30000); // 30 second timeout

    try {
      setAuthMessage("Loading Pi Network SDK...");

      // Guard: Check if we're in browser environment
      if (typeof window === "undefined") {
        throw new Error("Cannot initialize Pi SDK in non-browser environment");
      }

      // Load SDK with improved error handling
      await loadPiSDK();

      // Guard: Verify Pi object is available after loading
      if (!window.Pi) {
        throw new Error("Pi SDK not available - please open in Pi Browser or ensure SDK loaded correctly");
      }

      setAuthMessage("Initializing Pi Network...");
      
      // Initialize Pi SDK with configured sandbox mode
      try {
        await window.Pi.init({
          version: "2.0",
          sandbox: PI_NETWORK_CONFIG.SANDBOX,
        });
        console.log(`✅ Pi SDK initialized (sandbox: ${PI_NETWORK_CONFIG.SANDBOX})`);
      } catch (initError) {
        console.error("Pi SDK init error:", initError);
        // SDK might already be initialized in Pi App Studio
        console.log("Continuing with authentication...");
      }

      await authenticateAndLogin();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsAuthenticated(true);
      setIsLoading(false);
      setIsError(false);
      setAuthMessage("Authenticated successfully!");
    } catch (err) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsLoading(false);
      setIsError(true);
      console.error("❌ Pi Network initialization failed:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      
      // Provide clear, actionable error messages
      if (errorMsg.includes('PI_API_KEY') || errorMsg.includes('configuration')) {
        setAuthMessage(
          'Server configuration error: PI_API_KEY not set. Click "Go to Setup" below.'
        );
      } else if (errorMsg.includes('timeout')) {
        setAuthMessage(
          `Authentication timed out: ${errorMsg}. Click "Try Again" or "Go to Setup".`
        );
      } else {
        setAuthMessage(
          `Authentication failed: ${errorMsg}. Click "Try Again" or "Go to Setup".`
        );
      }
    }
  };

  useEffect(() => {
    initializePiAndAuthenticate();
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    isLoading,
    isError,
    authMessage,
    piAccessToken,
    userData,
    reinitialize: () => {
      hasAttemptedAuth.current = false;
      return initializePiAndAuthenticate();
    },
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
 * const { piAccessToken, userData, isAuthenticated, isLoading, isError, reinitialize } = usePiAuth();
 */
export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
