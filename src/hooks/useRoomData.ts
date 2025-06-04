
import { useState, useEffect, useCallback } from 'react';
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

export const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPersonalMode, setIsPersonalMode] = useState(false);

  // Load default demo data (first row)
  const loadDefaultData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching default room data:', error);
        setError('Failed to load default data');
        return;
      }

      setRoomData(data);
      setIsPersonalMode(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Look up data by email
  const lookupByEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('guest_email', email)
        .maybeSingle();

      if (error) {
        console.error('Error looking up email:', error);
        return false;
      }

      if (data) {
        setRoomData(data);
        setIsPersonalMode(true);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Unexpected error during lookup:', err);
      return false;
    }
  }, []);

  // Clear personal data and return to demo mode
  const clearPersonalData = useCallback(() => {
    setIsPersonalMode(false);
    loadDefaultData();
  }, [loadDefaultData]);

  useEffect(() => {
    loadDefaultData();
  }, [loadDefaultData]);

  return { 
    roomData, 
    loading, 
    error, 
    isPersonalMode,
    lookupByEmail,
    clearPersonalData
  };
};
