
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Booking = Database['public']['Tables']['combined']['Row'];

export const useTokenAuth = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticateWithToken = async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Authenticating with token:', token);
      
      const { data, error: fetchError } = await supabase
        .from('combined')
        .select('*')
        .eq('access_token', token)
        .eq('visible_to_guests', true)
        .eq('is_archived', false)
        .in('booking_status', ['confirmed', 'pending', 'demo'])
        .single();

      if (fetchError) {
        console.error('Token authentication failed:', fetchError);
        setError('Неверная или недействительная ссылка');
        return false;
      }

      if (!data) {
        setError('Бронирование не найдено');
        return false;
      }

      console.log('Token authentication successful:', data);
      setBooking(data);
      return true;
    } catch (err) {
      console.error('Token authentication error:', err);
      setError('Ошибка при проверке ссылки');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setBooking(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    booking,
    loading,
    error,
    authenticateWithToken,
    logout,
    clearError,
    isAuthenticated: !!booking
  };
};
