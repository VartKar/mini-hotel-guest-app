
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useHostAuth } from './useHostAuth';

export interface HostBooking {
  id: string;
  guest_name: string | null;
  guest_email: string | null;
  room_number: string | null;
  apartment_name: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  booking_status: string | null;
  booking_id: string | null;
  access_token: string | null;
}

export interface HostData {
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  host_company: string | null;
  bookings: HostBooking[];
}

export const useHostData = () => {
  const { user, isHostAuthenticated, loading: authLoading } = useHostAuth();
  const [hostData, setHostData] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHostAuthenticated && user?.email) {
      loadHostData(user.email);
    } else {
      setHostData(null);
    }
  }, [isHostAuthenticated, user]);

  const loadHostData = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading host data for:', email);
      
      // Look up bookings for this host
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            host_name,
            host_email,
            host_phone,
            room_number,
            apartment_name
          )
        `)
        .eq('visible_to_hosts', true)
        .eq('is_archived', false);

      if (bookingsError) {
        console.error('Error looking up bookings:', bookingsError);
        setError('Ошибка при поиске данных хоста');
        return;
      }

      // Filter bookings where room host_email matches the authenticated user's email
      const hostBookings = bookingsData.filter(booking => 
        booking.rooms?.host_email?.toLowerCase() === email.toLowerCase().trim()
      );

      if (hostBookings.length === 0) {
        setError('Нет активных бронирований для этого хоста');
        return;
      }

      console.log('✅ Host bookings found:', hostBookings.length);

      // Get host info from first booking's room
      const firstRoom = hostBookings[0].rooms;
      const hostInfo: HostData = {
        host_name: firstRoom.host_name,
        host_email: firstRoom.host_email,
        host_phone: firstRoom.host_phone,
        host_company: null,
        bookings: hostBookings.map(booking => ({
          id: booking.id,
          guest_name: booking.guest_name,
          guest_email: booking.guest_email,
          room_number: booking.rooms?.room_number,
          apartment_name: booking.rooms?.apartment_name,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          booking_status: booking.booking_status,
          booking_id: booking.booking_id,
          access_token: booking.access_token,
        }))
      };

      setHostData(hostInfo);
    } catch (err) {
      console.error('Unexpected error loading host data:', err);
      setError('Произошла непредвиденная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const requestChange = async (booking: HostBooking, requestType: string, details: string) => {
    try {
      // Insert the change request
      const { error: insertError } = await supabase
        .from('host_change_requests')
        .insert({
          host_email: hostData?.host_email,
          property_id: booking.id,
          booking_id: booking.booking_id,
          request_type: requestType,
          request_details: details,
        });

      if (insertError) {
        console.error('Error creating change request:', insertError);
        return false;
      }

      // Send email notification to admin
      const { error: emailError } = await supabase.functions.invoke('notify-admin-change-request', {
        body: {
          host_email: hostData?.host_email,
          property_id: booking.id,
          booking_id: booking.booking_id,
          request_type: requestType,
          request_details: details,
        },
      });

      if (emailError) {
        console.error('Error sending admin notification email:', emailError);
      }

      return true;
    } catch (err) {
      console.error('Unexpected error creating change request:', err);
      return false;
    }
  };

  return { 
    hostData, 
    loading: loading || authLoading, 
    error, 
    isAuthenticated: isHostAuthenticated, 
    requestChange,
    clearError: () => setError(null)
  };
};
