'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticsPage() {
  const [health, setHealth] = useState<any>(null);
  const [piSDKStatus, setPiSDKStatus] = useState<string>('Checking...');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    const checkHealth = async () => {
      try {
        addLog('Checking health endpoint...');
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealth(data);
        addLog(`Health check: ${JSON.stringify(data, null, 2)}`);
      } catch (error) {
        addLog(`Health check failed: ${error}`);
      }
    };

    const checkPiSDK = () => {
      if (typeof window !== 'undefined') {
        if (typeof window.Pi !== 'undefined') {
          setPiSDKStatus('✅ Available');
          addLog('Pi SDK is available');
        } else {
          setPiSDKStatus('❌ Not found');
          addLog('Pi SDK not found - not in Pi Browser?');
        }
      }
    };

    checkHealth();
    checkPiSDK();

    // Check Pi SDK every second
    const interval = setInterval(checkPiSDK, 1000);
    return () => clearInterval(interval);
  }, []);

  const testLogin = async () => {
    try {
      addLog('Testing login endpoint with fake token...');
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pi_auth_token: 'test-token' })
      });
      const data = await response.json();
      addLog(`Login response: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Login test failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Stem Synergy Diagnostics</h1>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Health Check</h2>
          {health ? (
            <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(health, null, 2)}
            </pre>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Pi SDK Status</h2>
          <p className="text-lg">{piSDKStatus}</p>
        </div>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Test Login</h2>
          <button
            onClick={testLogin}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Test Login Endpoint
          </button>
        </div>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Diagnostic Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Environment Info</h2>
          <ul className="space-y-1 text-sm">
            <li>🌐 Origin: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</li>
            <li>📱 User Agent: {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) : 'N/A'}...</li>
            <li>🔐 HTTPS: {typeof window !== 'undefined' ? (window.location.protocol === 'https:' ? '✅' : '❌') : 'N/A'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
