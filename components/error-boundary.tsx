"use client";

import { Component, ReactNode, ErrorInfo } from "react";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Global error boundary to catch and handle component errors gracefully
 * Provides fallback UI and error logging
 */
export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(
      "Uncaught error in component tree",
      "ErrorBoundary",
      {
        error: error.message,
        componentStack: errorInfo.componentStack,
      }
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const isDev = typeof window !== "undefined" && 
                    (typeof process !== "undefined" && 
                     (process as any)?.env?.NODE_ENV === "development");

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {isDev && this.state.error && (
              <details className="mb-4 p-3 bg-muted rounded text-sm">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap overflow-auto text-xs">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
