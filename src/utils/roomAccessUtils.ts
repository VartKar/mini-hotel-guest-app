
import { supabase } from '@/integrations/supabase/client';

export interface RoomAccessData {
  id: string;
  room_id: string;
  property_id: string;
  room_number: string;
  apartment_name?: string;
  access_token: string;
  city: string;
  wifi_network?: string;
  wifi_password?: string;
  checkout_time?: string;
  main_image_url?: string;
  room_image_url?: string;
  ac_instructions?: string;
  coffee_instructions?: string;
  tv_instructions?: string;
  safe_instructions?: string;
  parking_info?: string;
  extra_bed_info?: string;
  notes_for_guests?: string;
  host_name?: string;
  host_phone?: string;
  host_email?: string;
  property_manager_name?: string;
  property_manager_phone?: string;
  property_manager_email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const generateRoomToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

export const getRoomByToken = async (token: string): Promise<RoomAccessData | null> => {
  try {
    console.log('getRoomByToken - Searching for token:', token);
    
    const { data, error } = await supabase
      .from('room_access')
      .select('*')
      .eq('access_token', token)
      .eq('is_active', true);

    console.log('getRoomByToken - Query result:', { data, error });

    if (error) {
      console.error('Error fetching room by token:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No room found for token:', token);
      
      // Давайте также проверим, есть ли вообще записи в таблице
      const { data: allRooms, error: allRoomsError } = await supabase
        .from('room_access')
        .select('access_token, room_number, city')
        .limit(5);
      
      console.log('Available rooms sample:', allRooms);
      console.log('All rooms query error:', allRoomsError);
      
      return null;
    }

    const roomData = data[0];
    console.log('Found room data:', roomData);
    return roomData;
  } catch (error) {
    console.error('Error in getRoomByToken:', error);
    return null;
  }
};

export const registerGuestInRoom = async (roomAccessId: string, guestData: {
  guest_email?: string;
  guest_phone?: string;
  guest_name?: string;
}) => {
  try {
    console.log('registerGuestInRoom - Room ID:', roomAccessId, 'Guest data:', guestData);
    
    const { data, error } = await supabase
      .from('room_guests')
      .insert({
        room_access_id: roomAccessId,
        ...guestData
      })
      .select()
      .single();

    if (error) {
      console.error('Error registering guest in room:', error);
      return null;
    }

    console.log('Guest registered successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in registerGuestInRoom:', error);
    return null;
  }
};

export const updateGuestAccess = async (roomAccessId: string, guestEmail?: string, guestPhone?: string) => {
  try {
    console.log('updateGuestAccess - Room ID:', roomAccessId, 'Email:', guestEmail, 'Phone:', guestPhone);
    
    const { error } = await supabase
      .from('room_guests')
      .update({ 
        last_access_at: new Date().toISOString() 
      })
      .eq('room_access_id', roomAccessId)
      .or(guestEmail ? `guest_email.eq.${guestEmail}` : `guest_phone.eq.${guestPhone}`);

    if (error) {
      console.error('Error updating guest access:', error);
      return false;
    }

    console.log('Guest access updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateGuestAccess:', error);
    return false;
  }
};
