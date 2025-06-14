
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HostBooking {
  id_key: string;
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
  host_company: string | null;
  bookings: HostBooking[];
}

let globalHostData: HostData | null = null;
let globalIsAuthenticated = false;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useHostData = () => {
  const [hostData, setHostData] = useState<HostData | null>(globalHostData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(globalIsAuthenticated);

  useEffect(() => {
    const listener = () => {
      setHostData(globalHostData);
      setIsAuthenticated(globalIsAuthenticated);
    };
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const loginWithEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('host_email', email.toLowerCase().trim())
        .eq('visible_to_hosts', true)
        .eq('is_archived', false);

      if (error) {
        console.error('Error looking up host by email:', error);
        setError('Ошибка при поиске данных хоста');
        return false;
      }

      if (!data || data.length === 0) {
        setError('Хост с таким email не найден или нет активных бронирований');
        return false;
      }

      // Get host info from first record
      const firstRecord = data[0];
      const hostInfo: HostData = {
        host_name: firstRecord.host_name,
        host_email: firstRecord.host_email,
        host_company: firstRecord.host_company,
        bookings: data.map(record => ({
          id_key: record.id_key,
          guest_name: record.guest_name,
          guest_email: record.guest_email,
          room_number: record.room_number,
          apartment_name: record.apartment_name,
          check_in_date: record.check_in_date,
          check_out_date: record.check_out_date,
          booking_status: record.booking_status,
          booking_id: record.booking_id,
        }))
      };

      globalHostData = hostInfo;
      globalIsAuthenticated = true;
      setHostData(hostInfo);
      setIsAuthenticated(true);
      notifyListeners();
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
    globalHostData = null;
    globalIsAuthenticated = false;
    setHostData(null);
    setIsAuthenticated(false);
    notifyListeners();
  };

  const requestChange = async (booking: HostBooking, requestType: string, details: string) => {
    try {
      // First, insert the change request into the database
      const { error: insertError } = await supabase
        .from('host_change_requests')
        .insert({
          host_email: hostData?.host_email,
          property_id: booking.id_key,
          booking_id: booking.booking_id,
          request_type: requestType,
          request_details: details,
        });

      if (insertError) {
        console.error('Error creating change request:', insertError);
        return false;
      }

      // Then, call the Edge Function to send email notification to admin
      const { error: emailError } = await supabase.functions.invoke('notify-admin-change-request', {
        body: {
          host_email: hostData?.host_email,
          property_id: booking.id_key,
          booking_id: booking.booking_id,
          request_type: requestType,
          request_details: details,
        },
      });

      if (emailError) {
        console.error('Error sending admin notification email:', emailError);
        // Don't fail the request if email fails - the request is still saved
        console.log('Change request saved but admin notification email failed');
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
