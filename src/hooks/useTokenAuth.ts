
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GuestData {
  id_key: string;
  guest_name: string | null;
  guest_email: string | null;
  room_number: string | null;
  apartment_name: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  booking_status: string | null;
  booking_id: string | null;
  host_name: string | null;
  host_company: string | null;
  wifi_network: string | null;
  wifi_password: string | null;
  notes_for_guests: string | null;
  main_image_url: string | null;
  room_image_url: string | null;
  ac_instructions: string | null;
  coffee_instructions: string | null;
  tv_instructions: string | null;
  safe_instructions: string | null;
  parking_info: string | null;
  extra_bed_info: string | null;
  pets_info: string | null;
}

let globalGuestData: GuestData | null = null;
let globalIsAuthenticated = false;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useTokenAuth = () => {
  const [guestData, setGuestData] = useState<GuestData | null>(globalGuestData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(globalIsAuthenticated);

  useEffect(() => {
    const listener = () => {
      setGuestData(globalGuestData);
      setIsAuthenticated(globalIsAuthenticated);
    };
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const loginWithToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('access_token', token.trim())
        .eq('visible_to_guests', true)
        .eq('is_archived', false)
        .single();

      if (error) {
        console.error('Error looking up guest by token:', error);
        setError('Недействительная ссылка или токен');
        return false;
      }

      if (!data) {
        setError('Ссылка недействительна или бронирование не найдено');
        return false;
      }

      const guestInfo: GuestData = {
        id_key: data.id_key,
        guest_name: data.guest_name,
        guest_email: data.guest_email,
        room_number: data.room_number,
        apartment_name: data.apartment_name,
        check_in_date: data.check_in_date,
        check_out_date: data.check_out_date,
        booking_status: data.booking_status,
        booking_id: data.booking_id,
        host_name: data.host_name,
        host_company: data.host_company,
        wifi_network: data.wifi_network,
        wifi_password: data.wifi_password,
        notes_for_guests: data.notes_for_guests,
        main_image_url: data.main_image_url,
        room_image_url: data.room_image_url,
        ac_instructions: data.ac_instructions,
        coffee_instructions: data.coffee_instructions,
        tv_instructions: data.tv_instructions,
        safe_instructions: data.safe_instructions,
        parking_info: data.parking_info,
        extra_bed_info: data.extra_bed_info,
        pets_info: data.pets_info,
      };

      globalGuestData = guestInfo;
      globalIsAuthenticated = true;
      setGuestData(guestInfo);
      setIsAuthenticated(true);
      notifyListeners();
      
      // Store token in localStorage for persistence
      localStorage.setItem('guest_token', token);
      
      return true;
    } catch (err) {
      console.error('Unexpected error during token login:', err);
      setError('Произошла непредвиденная ошибка');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    globalGuestData = null;
    globalIsAuthenticated = false;
    setGuestData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('guest_token');
    notifyListeners();
  };

  // Auto-login with stored token on initialization
  useEffect(() => {
    const storedToken = localStorage.getItem('guest_token');
    if (storedToken && !globalIsAuthenticated) {
      loginWithToken(storedToken);
    }
  }, []);

  return { 
    guestData, 
    loading, 
    error, 
    isAuthenticated, 
    loginWithToken, 
    logout,
    clearError: () => setError(null)
  };
};
