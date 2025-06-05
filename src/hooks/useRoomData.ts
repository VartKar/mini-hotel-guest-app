
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoomData {
  property_id: string | null;
  booking_id: string | null;
  guest_email: string | null;
  guest_name: string | null;
  room_number: string | null;
  stay_duration: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  wifi_network: string | null;
  wifi_password: string | null;
  checkout_time: string | null;
  room_image_url: string | null;
  ac_instructions: string | null;
  coffee_instructions: string | null;
  tv_instructions: string | null;
  safe_instructions: string | null;
  parking_info: string | null;
  extra_bed_info: string | null;
  pets_info: string | null;
  apartment_name: string | null;
}

let globalRoomData: RoomData | null = null;
let globalIsPersonalized = false;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(globalRoomData);
  const [loading, setLoading] = useState(!globalRoomData);
  const [error, setError] = useState<string | null>(null);
  const [isPersonalized, setIsPersonalized] = useState(globalIsPersonalized);

  useEffect(() => {
    const listener = () => {
      setRoomData(globalRoomData);
      setIsPersonalized(globalIsPersonalized);
    };
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  useEffect(() => {
    if (!globalRoomData) {
      fetchDefaultData();
    }
  }, []);

  const fetchDefaultData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching default room data:', error);
        setError('Failed to load room data');
        return;
      }

      globalRoomData = data;
      globalIsPersonalized = false;
      setRoomData(data);
      setIsPersonalized(false);
      notifyListeners();
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const lookupByEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('guest_email', email.toLowerCase().trim())
        .maybeSingle();

      if (error) {
        console.error('Error looking up guest by email:', error);
        setError('Ошибка при поиске бронирования');
        return false;
      }

      if (!data) {
        setError('Бронирование не найдено. Проверьте email или обратитесь на ресепшн.');
        return false;
      }

      globalRoomData = data;
      globalIsPersonalized = true;
      setRoomData(data);
      setIsPersonalized(true);
      notifyListeners();
      return true;
    } catch (err) {
      console.error('Unexpected error during lookup:', err);
      setError('Произошла непредвиденная ошибка');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    fetchDefaultData();
  };

  return { 
    roomData, 
    loading, 
    error, 
    isPersonalized, 
    lookupByEmail, 
    logOut,
    clearError: () => setError(null)
  };
};
