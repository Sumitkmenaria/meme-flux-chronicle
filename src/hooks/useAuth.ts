import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log('Starting signup process...', { email, username });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username, // Use username as full_name initially
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', error);
      } else {
        console.log('Signup successful:', data);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Signup failed with exception:', err);
      return { 
        data: null, 
        error: { 
          message: err instanceof Error ? err.message : 'Network error - please disable browser extensions and try again' 
        } 
      };
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process...', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Signin error:', error);
      } else {
        console.log('Signin successful:', data);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Signin failed with exception:', err);
      return { 
        data: null, 
        error: { 
          message: err instanceof Error ? err.message : 'Network error - please disable browser extensions and try again' 
        } 
      };
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}