
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoomData {
  id?: string;
  id_key?: string;
  property_id?: string;
  booking_id?: string;
  guest_email?: string;
  guest_name?: string;
  stay_duration?: string;
  check_in_date?: string;
  check_out_date?: string;
  wifi_network?: string;
  wifi_password?: string;
  checkout_time?: string;
  room_image_url?: string;
  main_image_url?: string;
  ac_instructions?: string;
  coffee_instructions?: string;
  tv_instructions?: string;
  safe_instructions?: string;
  parking_info?: string;
  extra_bed_info?: string;
  pets_info?: string;
  room_number?: string;
  apartment_name?: string;
  host_name?: string;
  host_email?: string;
  host_phone?: string;
  host_company?: string;
  property_manager_name?: string;
  property_manager_phone?: string;
  property_manager_email?: string;
  booking_status?: string;
  notes_for_guests?: string;
  city?: string;
  access_token?: string;
  visible_to_guests?: boolean;
  is_archived?: boolean;
  number_of_guests?: number;
}

export const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRoomData = useCallback(async () => {
    try {
      console.log('🏠 useRoomData - Loading room data...');
      
      // First check localStorage for room data
      const storedRoomData = localStorage.getItem('rubikinn_room_data');
      const storedPersonalized = localStorage.getItem('rubikinn_is_personalized');
      
      console.log('🏠 useRoomData - Stored room data:', storedRoomData);
      console.log('🏠 useRoomData - Stored personalized:', storedPersonalized);
      
      if (storedRoomData) {
        const parsedData = JSON.parse(storedRoomData);
        console.log('🏠 useRoomData - Parsed room data:', parsedData);
        console.log('🏠 useRoomData - Image URLs in data:', {
          room_image_url: parsedData.room_image_url,
          main_image_url: parsedData.main_image_url
        });
        
        setRoomData(parsedData);
        setIsPersonalized(storedPersonalized === 'true');
        setLoading(false);
        return;
      }

      // If no stored data, load demo data
      console.log('🏠 useRoomData - No stored data, loading demo data...');
      const { data: demoData, error } = await supabase
        .from('combined')
        .select('*')
        .eq('booking_status', 'demo')
        .eq('visible_to_guests', true)
        .eq('is_archived', false)
        .limit(1)
        .single();

      if (error) {
        console.error('🏠 useRoomData - Error loading demo data:', error);
        setError('Ошибка загрузки данных');
      } else {
        console.log('🏠 useRoomData - Demo data loaded:', demoData);
        console.log('🏠 useRoomData - Demo image URLs:', {
          room_image_url: demoData?.room_image_url,
          main_image_url: demoData?.main_image_url
        });
        setRoomData(demoData);
      }

      setIsPersonalized(false);
    } catch (error) {
      console.error('🏠 useRoomData - Error in loadRoomData:', error);
      setError('Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  }, []);

  const lookupByEmail = useCallback(async (email: string) => {
    try {
      console.log('📧 useRoomData - Looking up by email:', email);
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('guest_email', email)
        .eq('visible_to_guests', true)
        .eq('is_archived', false)
        .limit(1)
        .single();

      if (error || !data) {
        console.log('❌ useRoomData - Email lookup failed:', error);
        setError('Данные не найдены для указанного email');
        return false;
      }

      console.log('✅ useRoomData - Email lookup successful:', data);
      setRoomData(data);
      setIsPersonalized(true);
      
      // Save to localStorage
      localStorage.setItem('rubikinn_room_data', JSON.stringify(data));
      localStorage.setItem('rubikinn_is_personalized', 'true');
      
      return true;
    } catch (err) {
      console.error('💥 useRoomData - Error in lookupByEmail:', err);
      setError('Произошла ошибка при поиске');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logOut = useCallback(() => {
    console.log('🚪 useRoomData - Logging out...');
    localStorage.removeItem('rubikinn_is_personalized');
    setIsPersonalized(false);
    loadRoomData();
  }, [loadRoomData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    loadRoomData();
  }, [loadRoomData]);

  return { 
    roomData, 
    loading, 
    isPersonalized, 
    error, 
    lookupByEmail, 
    logOut, 
    clearError 
  };
};
