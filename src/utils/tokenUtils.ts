
import { supabase } from '@/integrations/supabase/client';

export const generateGuestToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

export const ensureGuestToken = async (bookingId: string): Promise<string | null> => {
  try {
    // Проверяем, есть ли уже токен
    const { data: booking } = await supabase
      .from('combined')
      .select('access_token')
      .eq('id_key', bookingId)
      .single();

    if (booking?.access_token) {
      return booking.access_token;
    }

    // Создаем новый токен
    const newToken = generateGuestToken();
    
    const { error } = await supabase
      .from('combined')
      .update({ access_token: newToken })
      .eq('id_key', bookingId);

    if (error) {
      console.error('Error creating guest token:', error);
      return null;
    }

    return newToken;
  } catch (error) {
    console.error('Error ensuring guest token:', error);
    return null;
  }
};

export const getGuestBookingByToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from('combined')
      .select('*')
      .eq('access_token', token)
      .eq('visible_to_guests', true)
      .eq('is_archived', false)
      .single();

    if (error) {
      console.error('Error fetching booking by token:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getGuestBookingByToken:', error);
    return null;
  }
};
