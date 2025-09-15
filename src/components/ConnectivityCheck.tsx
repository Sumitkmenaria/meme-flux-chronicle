import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const ConnectivityCheck = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setConnectionError('');
    setSupabaseConnected(null);
    
    try {
      // Test basic Supabase connectivity
      const { data, error } = await supabase.from('memes').select('count').limit(1);
      
      if (error) {
        console.error('Supabase connectivity test failed:', error);
        setConnectionError(`Database error: ${error.message}`);
        setSupabaseConnected(false);
      } else {
        setSupabaseConnected(true);
        setConnectionError('');
      }
    } catch (err: any) {
      console.error('Supabase connectivity test failed:', err);
      setSupabaseConnected(false);
      
      // Detailed error analysis
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setConnectionError('Network request blocked - likely by browser extension or CORS configuration');
      } else if (err.message?.includes('CORS')) {
        setConnectionError('CORS configuration issue - check Supabase dashboard settings');
      } else if (err.message?.includes('NetworkError')) {
        setConnectionError('Network connectivity issue');
      } else {
        setConnectionError(`Connection error: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection test
    testConnection();

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
      <Alert className="mb-4 border-destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <div>
            <strong>Database Connection Failed</strong>
          </div>
          <div className="text-sm text-muted-foreground">
            {connectionError}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={testing}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${testing ? 'animate-spin' : ''}`} />
              Test Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href="https://supabase.com/dashboard/project/uneaqjswhthtrpmqyqfk/settings/api"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Supabase Settings
              </a>
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            💡 Try: Disable browser extensions, check CORS settings, or verify network connectivity
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (supabaseConnected === true) {
    return (
      <Alert className="mb-4 border-emerald-500 bg-emerald-500/10">
        <Wifi className="h-4 w-4 text-emerald-500" />
        <AlertDescription>
          ✅ Database connection successful
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};