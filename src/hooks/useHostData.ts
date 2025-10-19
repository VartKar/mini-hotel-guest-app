
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export interface HostData {
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  host_company: string | null;
  bookings: HostBooking[];
}

const HOST_DATA_KEY = 'host_session_data';
const HOST_AUTH_KEY = 'host_authenticated';

const getStoredHostData = (): HostData | null => {
  try {
    const stored = localStorage.getItem(HOST_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredAuthStatus = (): boolean => {
  return localStorage.getItem(HOST_AUTH_KEY) === 'true';
};

const setStoredHostData = (data: HostData | null) => {
  if (data) {
    localStorage.setItem(HOST_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(HOST_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(HOST_DATA_KEY);
    localStorage.removeItem(HOST_AUTH_KEY);
  }
};

export const useHostData = () => {
  const [hostData, setHostData] = useState<HostData | null>(getStoredHostData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuthStatus());

  const loginWithEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Looking up host by email:', email);
      
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
        return false;
      }

      // Filter bookings where room host_email matches the provided email
      const hostBookings = bookingsData.filter(booking => 
        booking.rooms?.host_email?.toLowerCase() === email.toLowerCase().trim()
      );

      if (hostBookings.length === 0) {
        setError('Хост с таким email не найден или нет активных бронирований');
        return false;
      }

      console.log('✅ Host bookings found:', hostBookings.length);

      // Get host info from first booking's room
      const firstRoom = hostBookings[0].rooms;
      const hostInfo: HostData = {
        host_name: firstRoom.host_name,
        host_email: firstRoom.host_email,
        host_phone: firstRoom.host_phone,
        host_company: null, // Not available in current schema
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
        }))
      };

      setStoredHostData(hostInfo);
      setHostData(hostInfo);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Unexpected error during host login:', err);
      setError('Произошла непредвиденная ошибка');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setStoredHostData(null);
    setHostData(null);
    setIsAuthenticated(false);
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
    loading, 
    error, 
    isAuthenticated, 
    loginWithEmail, 
    logout,
    requestChange,
    clearError: () => setError(null)
  };
};
