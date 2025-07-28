
import { supabase } from '@/integrations/supabase/client';

export interface GuestBookingData {
  id: string;
  room_number: string | null;
  apartment_name: string | null;
  property_id: string | null;
  city: string | null;
  wifi_network: string | null;
  wifi_password: string | null;
  checkout_time: string | null;
  main_image_url: string | null;
  room_image_url: string | null;
  ac_instructions: string | null;
  coffee_instructions: string | null;
  tv_instructions: string | null;
  safe_instructions: string | null;
  parking_info: string | null;
  extra_bed_info: string | null;
  notes_for_guests: string | null;
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  property_manager_name: string | null;
  property_manager_phone: string | null;
  property_manager_email: string | null;
  booking_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  number_of_guests: number | null;
  check_in_date: string | null;
  check_out_date: string | null;
  stay_duration: string | null;
  booking_status: string | null;
  access_token: string | null;
}

export const getGuestBookingByToken = async (token: string): Promise<GuestBookingData | null> => {
  try {
    console.log('🔍 Looking up booking by token:', token);
    
    // Look up booking by access token
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (*)
      `)
      .eq('access_token', token)
      .eq('visible_to_guests', true)
      .eq('is_archived', false)
      .single();

    if (bookingError) {
      console.error('Error looking up booking by token:', bookingError);
      return null;
    }

    if (!bookingData || !bookingData.rooms) {
      console.error('No booking found for token:', token);
      return null;
    }

    console.log('✅ Booking found by token:', bookingData);

    // Combine room and booking data
    const combinedData: GuestBookingData = {
      ...bookingData.rooms,
      booking_id: bookingData.booking_id,
      guest_name: bookingData.guest_name,
      guest_email: bookingData.guest_email,
      guest_phone: bookingData.guest_phone,
      number_of_guests: bookingData.number_of_guests,
      check_in_date: bookingData.check_in_date,
      check_out_date: bookingData.check_out_date,
      stay_duration: bookingData.stay_duration,
      booking_status: bookingData.booking_status,
      access_token: bookingData.access_token,
    };

    return combinedData;
  } catch (error) {
    console.error('Error in getGuestBookingByToken:', error);
    return null;
  }
};
