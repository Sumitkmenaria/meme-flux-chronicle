import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

export const ConnectivityCheck = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [extensionWarning, setExtensionWarning] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test Supabase connectivity
    const testSupabaseConnection = async () => {
      try {
        const response = await fetch('https://lxplltkueismoiyhorjh.supabase.co/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cGxsdGt1ZWlzbW9peWhvcmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODIxMDQsImV4cCI6MjA3MzA1ODEwNH0.UUoRJ6pj-lw1jk55OpCnBF1XXBma4eO4r5FrVfZgRdk'
          }
        });
        setSupabaseConnected(response.ok);
      } catch (err) {
        console.error('Supabase connectivity test failed:', err);
        setSupabaseConnected(false);
        
        // Check if it's likely a browser extension issue
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          setExtensionWarning(true);
        }
      }
    };

    testSupabaseConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <Alert className="mb-4 border-destructive">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          No internet connection. Please check your network and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (supabaseConnected === false) {
    return (
      <Alert className="mb-4 border-warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {extensionWarning ? (
            <>
              Connection to authentication service blocked. This is likely caused by a browser extension. 
              Try disabling extensions or using incognito mode.
            </>
          ) : (
            'Unable to connect to authentication service. Please try again later.'
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (supabaseConnected === true) {
    return (
      <Alert className="mb-4 border-green-500">
        <Wifi className="h-4 w-4" />
        <AlertDescription>
          Connected to authentication service successfully.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};