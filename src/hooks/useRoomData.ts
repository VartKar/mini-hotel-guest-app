
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
}

export const useRoomData = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('combined')
          .select('*')
          .maybeSingle();

        if (error) {
          console.error('Error fetching room data:', error);
          setError('Failed to load room data');
          return;
        }

        setRoomData(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  return { roomData, loading, error };
};
