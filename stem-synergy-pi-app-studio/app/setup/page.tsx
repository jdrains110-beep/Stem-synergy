'use client';

import { useState, useEffect } from 'react';

export default function SetupPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealthStatus(data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  const isReady = healthStatus?.environment?.hasApiKey;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Stem Synergy</h1>
          <p className="text-muted-foreground">Pi Network STEM Blueprint Generator</p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Checking configuration...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${isReady ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-amber-500 bg-amber-50 dark:bg-amber-950'}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{isReady ? '✅' : '⚠️'}</div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {isReady ? 'Configuration Complete' : 'Configuration Required'}
                  </h2>
                  <p className="text-sm mt-1">
                    {isReady 
                      ? 'PI_API_KEY is configured. Your app is ready to use!'
                      : 'PI_API_KEY is not configured. Please complete setup below.'}
                  </p>
                </div>
              </div>
            </div>

            {!isReady && (
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Setup Instructions</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">1</span>
                      <span>Go to Pi App Studio Settings</span>
                    </div>
                    <p className="ml-8 text-muted-foreground">
                      Navigate to your app's configuration panel in Pi App Studio
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">2</span>
                      <span>Add Environment Variable</span>
                    </div>
                    <div className="ml-8 space-y-2">
                      <p className="text-muted-foreground">
                        Add the following environment variable:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-xs">
                        <div>
                          <span className="text-muted-foreground">Name:</span> <span className="text-primary">PI_API_KEY</span>
                        </div>
                        <div className="mt-1">
                          <span className="text-muted-foreground">Value:</span> <span className="text-primary">f3eqqvo6a8iwcpe3bactyauoslzvsjkeudefmoqy7i48whlkcyjviodvbixttvyy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">3</span>
                      <span>Redeploy the App</span>
                    </div>
                    <p className="ml-8 text-muted-foreground">
                      Trigger a new deployment to apply the environment variable changes
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs">4</span>
                      <span>Refresh This Page</span>
                    </div>
                    <p className="ml-8 text-muted-foreground">
                      After redeployment, refresh this page to verify the configuration
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isReady ? (
              <div className="space-y-3">
                <a
                  href="/"
                  className="block w-full py-3 px-4 bg-primary text-primary-foreground text-center rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Launch Stem Synergy
                </a>
                <a
                  href="/diagnostics"
                  className="block w-full py-2 px-4 border border-border text-center rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  View Diagnostics
                </a>
              </div>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 border border-primary text-primary text-center rounded-lg font-medium hover:bg-primary/10 transition-colors"
              >
                Check Configuration Again
              </button>
            )}

            <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={isReady ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
                  {healthStatus?.status || 'Unknown'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span>{healthStatus?.environment?.nodeEnv || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{healthStatus?.timestamp ? new Date(healthStatus.timestamp).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
