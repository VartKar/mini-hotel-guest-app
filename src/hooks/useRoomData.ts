
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoomData {
  // Room details (from rooms table)
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
  
  // Booking details (from bookings table, if applicable)
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
  
  // Session details
  session_token: string | null;
  session_type: 'registered' | 'walk_in' | null;
}

let globalRoomData: RoomData | null = null;
let globalIsPersonalized = false;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Default demo room ID
const DEMO_ROOM_ID = 'c10fe304-7db8-4ee3-a72a-f9dc5418ceac';

// Storage keys
const STORAGE_KEYS = {
  ROOM_DATA: 'rubikinn_room_data',
  IS_PERSONALIZED: 'rubikinn_is_personalized',
  SESSION_TOKEN: 'rubikinn_session_token'
};

// Generate unique session token
const generateSessionToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const storedRoomData = localStorage.getItem(STORAGE_KEYS.ROOM_DATA);
    const storedIsPersonalized = localStorage.getItem(STORAGE_KEYS.IS_PERSONALIZED);
    
    if (storedRoomData && storedIsPersonalized) {
      globalRoomData = JSON.parse(storedRoomData);
      globalIsPersonalized = storedIsPersonalized === 'true';
      console.log('📦 Loaded from storage:', { hasData: !!globalRoomData, isPersonalized: globalIsPersonalized });
      return true;
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return false;
};

// Save data to localStorage
const saveToStorage = (roomData: RoomData | null, isPersonalized: boolean) => {
  try {
    if (roomData) {
      localStorage.setItem(STORAGE_KEYS.ROOM_DATA, JSON.stringify(roomData));
      console.log('💾 Saved to storage:', { hasData: !!roomData, isPersonalized });
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
    }
    localStorage.setItem(STORAGE_KEYS.IS_PERSONALIZED, isPersonalized.toString());
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Create guest session
const createGuestSession = async (roomData: RoomData, sessionType: 'registered' | 'walk_in', bookingId?: string) => {
  const sessionToken = generateSessionToken();
  
  try {
    const { data, error } = await supabase
      .from('guest_sessions')
      .insert({
        session_token: sessionToken,
        room_id: roomData.id,
        booking_id: bookingId || null,
        guest_name: roomData.guest_name || 'Anonymous Guest',
        guest_email: roomData.guest_email || null,
        guest_phone: roomData.guest_phone || null,
        session_type: sessionType,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating guest session:', error);
      return null;
    }

    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
    console.log('✅ Guest session created:', data);
    return sessionToken;
  } catch (error) {
    console.error('Error creating guest session:', error);
    return null;
  }
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
    // Try to load from storage first
    const hasStoredData = loadFromStorage();
    
    if (hasStoredData) {
      setRoomData(globalRoomData);
      setIsPersonalized(globalIsPersonalized);
      setLoading(false);
      notifyListeners();
    } else if (!globalRoomData) {
      fetchDefaultRoom();
    }
  }, []);

  const fetchDefaultRoom = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching default room data');
      
      // Get default room from rooms table
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (roomError) {
        console.error('Error fetching default room:', roomError);
        setError('Failed to load room data');
        return;
      }

      console.log('✅ Default room fetched:', roomData);

      const combinedData: RoomData = {
        ...roomData,
        booking_id: null,
        guest_name: null,
        guest_email: null,
        guest_phone: null,
        number_of_guests: null,
        check_in_date: null,
        check_out_date: null,
        stay_duration: null,
        booking_status: null,
        access_token: null,
        session_token: null,
        session_type: null
      };

      // Create walk-in session for default room
      const sessionToken = await createGuestSession(combinedData, 'walk_in');
      if (sessionToken) {
        combinedData.session_token = sessionToken;
        combinedData.session_type = 'walk_in';
      }

      globalRoomData = combinedData;
      globalIsPersonalized = false;
      setRoomData(combinedData);
      setIsPersonalized(false);
      saveToStorage(combinedData, false);
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
      
      console.log('🔍 Looking up email:', email);
      
      // Look up booking by email
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (*)
        `)
        .eq('guest_email', email.toLowerCase().trim())
        .eq('visible_to_guests', true)
        .eq('is_archived', false)
        .single();

      if (bookingError) {
        console.error('Error looking up booking:', bookingError);
        setError('Бронирование не найдено. Проверьте email или обратитесь на ресепшн.');
        return false;
      }

      if (!bookingData || !bookingData.rooms) {
        setError('Данные о номере не найдены');
        return false;
      }

      console.log('✅ Booking found:', bookingData);

      const combinedData: RoomData = {
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
        session_token: null,
        session_type: null
      };

      // Create registered session
      const sessionToken = await createGuestSession(combinedData, 'registered', bookingData.id);
      if (sessionToken) {
        combinedData.session_token = sessionToken;
        combinedData.session_type = 'registered';
      }

      globalRoomData = combinedData;
      globalIsPersonalized = true;
      setRoomData(combinedData);
      setIsPersonalized(true);
      saveToStorage(combinedData, true);
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
    console.log('🚪 Logging out - clearing storage and resetting to default');
    
    // Clear all storage
    localStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
    localStorage.removeItem(STORAGE_KEYS.IS_PERSONALIZED);
    localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    
    // Reset global state
    globalRoomData = null;
    globalIsPersonalized = false;
    setRoomData(null);
    setIsPersonalized(false);
    setError(null);
    notifyListeners();
    
    // Fetch default room again
    fetchDefaultRoom();
  };

  const clearError = () => {
    setError(null);
  };

  return { 
    roomData, 
    loading, 
    error, 
    isPersonalized, 
    lookupByEmail, 
    logOut,
    clearError
  };
};
