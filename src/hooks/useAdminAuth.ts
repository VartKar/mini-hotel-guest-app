
import { useState, useEffect } from 'react';

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

    // Check if admin is already logged in (from localStorage)
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      globalIsAdminAuthenticated = true;
      setIsAdminAuthenticated(true);
    }

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

    // Store auth state
    localStorage.setItem('admin_authenticated', 'true');
    globalIsAdminAuthenticated = true;
    setIsAdminAuthenticated(true);
    notifyAdminListeners();
    
    setLoading(false);
    return true;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_authenticated');
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
