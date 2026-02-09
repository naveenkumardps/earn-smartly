import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile, UserRole, AuthState } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API call - replace with actual backend API
const fetchUserProfile = async (userId: string, token: string): Promise<UserProfile | null> => {
  // TODO: Replace with actual backend API call
  // const response = await fetch(`${API_BASE_URL}/profile`, {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return response.json();
  
  // Mock response for demo
  const mockProfile: UserProfile = {
    id: userId,
    email: 'demo@earnvra.com',
    name: 'Demo User',
    role: 'user' as UserRole,
    referral_code: 'EARN' + userId.slice(0, 6).toUpperCase(),
    created_at: new Date().toISOString(),
  };
  
  return mockProfile;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const fetchAndSetProfile = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const profile = await fetchUserProfile(session.user.id, session.access_token);
      setState({
        user: profile,
        isLoading: false,
        isAuthenticated: !!profile,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setState({ user: null, isLoading: false, isAuthenticated: false });
        } else if (session) {
          // Use setTimeout to avoid deadlock with Supabase client
          setTimeout(() => fetchAndSetProfile(session), 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchAndSetProfile(session);
    });

    return () => subscription.unsubscribe();
  }, [fetchAndSetProfile]);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: error.message };
    }
    
    return {};
  };

  const signup = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name },
      },
    });
    
    if (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: error.message };
    }
    
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({ user: null, isLoading: false, isAuthenticated: false });
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await fetchAndSetProfile(session);
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
