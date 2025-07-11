
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoomData {
  id_key: string | null;
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
  apartment_name: string | null;
  // Host management fields
  host_id: string | null;
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  host_company: string | null;
  property_manager_name: string | null;
  property_manager_phone: string | null;
  property_manager_email: string | null;
  // Visibility control fields
  visible_to_guests: boolean | null;
  visible_to_hosts: boolean | null;
  visible_to_admin: boolean | null;
  is_archived: boolean | null;
  booking_status: string | null;
  last_updated_by: string | null;
  last_updated_at: string | null;
  notes_internal: string | null;
  notes_for_guests: string | null;
  // Main image field
  main_image_url: string | null;
  // City field
  city: string | null;
  // Number of guests field
  number_of_guests: number | null;
}

let globalRoomData: RoomData | null = null;
let globalIsPersonalized = false;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Specific ID for the default demonstration record
const DEMO_RECORD_ID = 'c10fe304-7db8-4ee3-a72a-f9dc5418ceac';

// Storage keys
const STORAGE_KEYS = {
  ROOM_DATA: 'rubikinn_room_data',
  IS_PERSONALIZED: 'rubikinn_is_personalized'
};

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const storedRoomData = localStorage.getItem(STORAGE_KEYS.ROOM_DATA);
    const storedIsPersonalized = localStorage.getItem(STORAGE_KEYS.IS_PERSONALIZED);
    
    if (storedRoomData && storedIsPersonalized) {
      globalRoomData = JSON.parse(storedRoomData);
      globalIsPersonalized = storedIsPersonalized === 'true';
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
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
    }
    localStorage.setItem(STORAGE_KEYS.IS_PERSONALIZED, isPersonalized.toString());
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
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
      fetchDefaultData();
    }
  }, []);

  const fetchDefaultData = async () => {
    try {
      setLoading(true);
      
      // Fetch the specific demonstration record by ID
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('id_key', DEMO_RECORD_ID)
        .maybeSingle();

      if (error) {
        console.error('Error fetching default room data:', error);
        setError('Failed to load room data');
        return;
      }

      globalRoomData = data;
      globalIsPersonalized = false;
      setRoomData(data);
      setIsPersonalized(false);
      saveToStorage(data, false);
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
      
      // The RLS policy will automatically filter the results
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('guest_email', email.toLowerCase().trim())
        .maybeSingle();

      if (error) {
        console.error('Error looking up guest by email:', error);
        setError('Ошибка при поиске бронирования');
        return false;
      }

      if (!data) {
        setError('Бронирование не найдено. Проверьте email или обратитесь на ресепшн.');
        return false;
      }

      globalRoomData = data;
      globalIsPersonalized = true;
      setRoomData(data);
      setIsPersonalized(true);
      saveToStorage(data, true);
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
    // Clear storage and reset to default
    localStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
    localStorage.removeItem(STORAGE_KEYS.IS_PERSONALIZED);
    fetchDefaultData();
  };

  return { 
    roomData, 
    loading, 
    error, 
    isPersonalized, 
    lookupByEmail, 
    logOut,
    clearError: () => setError(null)
  };
};
