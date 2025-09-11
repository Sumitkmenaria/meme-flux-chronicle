import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
        // Test Supabase connection by making a simple query
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected if tables aren't created yet
          console.error('Supabase connectivity test failed:', error);
          setSupabaseConnected(false);
          setExtensionWarning(true);
        } else {
          setSupabaseConnected(true);
        }
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