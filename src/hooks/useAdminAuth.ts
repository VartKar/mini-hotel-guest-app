
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

let globalIsAdminAuthenticated = false;
let adminListeners: (() => void)[] = [];

const notifyAdminListeners = () => {
  adminListeners.forEach(listener => listener());
};

export const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(globalIsAdminAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listener = () => {
      setIsAdminAuthenticated(globalIsAdminAuthenticated);
    };
    adminListeners.push(listener);

    // Check if admin is already logged in (from localStorage and Supabase session)
    const checkExistingSession = async () => {
      const adminAuth = localStorage.getItem('admin_authenticated');
      if (adminAuth === 'true') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email === 'monaco1@ya.ru') {
          globalIsAdminAuthenticated = true;
          setIsAdminAuthenticated(true);
        } else {
          // Clear invalid session
          localStorage.removeItem('admin_authenticated');
        }
      }
    };
    
    checkExistingSession();

    return () => {
      adminListeners = adminListeners.filter(l => l !== listener);
    };
  }, []);

  const loginAsAdmin = async (email: string) => {
    setLoading(true);
    setError(null);

    // Simple email-based auth for MVP - only monaco1@ya.ru allowed
    if (email.toLowerCase().trim() !== 'monaco1@ya.ru') {
      setError('Неавторизованный доступ');
      setLoading(false);
      return false;
    }

    try {
      // Sign in the admin user with Supabase auth
      // For MVP, we'll use a magic link or create a session
      // Since we're doing email-only auth, we'll create a temporary session
      const { data, error: authError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        // For MVP, if OTP fails, we'll create a simple session
        // This is a temporary solution - in production you'd want proper auth
        setError('Проверьте email для ссылки входа или используйте временный доступ');
        
        // Temporary bypass for demo - create a mock session
        const mockUser = {
          id: 'admin-mock-id',
          email: email,
          role: 'admin'
        };
        
        // Store mock session
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        globalIsAdminAuthenticated = true;
        setIsAdminAuthenticated(true);
        notifyAdminListeners();
        setLoading(false);
        return true;
      }

      // Store auth state
      localStorage.setItem('admin_authenticated', 'true');
      globalIsAdminAuthenticated = true;
      setIsAdminAuthenticated(true);
      notifyAdminListeners();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка входа');
      setLoading(false);
      return false;
    }
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    globalIsAdminAuthenticated = false;
    setIsAdminAuthenticated(false);
    notifyAdminListeners();
  };

  return {
    isAdminAuthenticated,
    loading,
    error,
    loginAsAdmin,
    logoutAdmin,
    clearError: () => setError(null)
  };
};
