
import { useState, useEffect } from 'react';
import { RoomAccessData, getRoomByToken, registerGuestInRoom, updateGuestAccess } from '@/utils/roomAccessUtils';

export const useRoomAccess = () => {
  const [roomData, setRoomData] = useState<RoomAccessData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const authenticateByToken = async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      const roomData = await getRoomByToken(token);
      
      if (!roomData) {
        setError('Номер не найден или ссылка недействительна');
        return false;
      }

      setRoomData(roomData);
      
      // Сохраняем токен в localStorage для дальнейшего использования
      localStorage.setItem('rubikinn_room_token', token);
      localStorage.setItem('rubikinn_room_data', JSON.stringify(roomData));
      
      return true;
    } catch (err) {
      console.error('Error authenticating by token:', err);
      setError('Произошла ошибка при авторизации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerGuest = async (guestData: {
    guest_email?: string;
    guest_phone?: string;
    guest_name?: string;
  }) => {
    if (!roomData) {
      setError('Данные номера не загружены');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const registrationResult = await registerGuestInRoom(roomData.id, guestData);
      
      if (!registrationResult) {
        setError('Ошибка при регистрации. Возможно, вы уже зарегистрированы в другом номере.');
        return false;
      }

      setIsRegistered(true);
      
      // Сохраняем данные регистрации
      localStorage.setItem('rubikinn_guest_registered', 'true');
      localStorage.setItem('rubikinn_guest_data', JSON.stringify(guestData));
      
      // Обновляем время последнего доступа
      await updateGuestAccess(roomData.id, guestData.guest_email, guestData.guest_phone);
      
      return true;
    } catch (err) {
      console.error('Error registering guest:', err);
      setError('Произошла ошибка при регистрации');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadFromStorage = () => {
    try {
      const storedRoomData = localStorage.getItem('rubikinn_room_data');
      const storedToken = localStorage.getItem('rubikinn_room_token');
      const isGuestRegistered = localStorage.getItem('rubikinn_guest_registered') === 'true';
      
      if (storedRoomData && storedToken) {
        setRoomData(JSON.parse(storedRoomData));
        setIsRegistered(isGuestRegistered);
        return true;
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
    return false;
  };

  const clearData = () => {
    localStorage.removeItem('rubikinn_room_token');
    localStorage.removeItem('rubikinn_room_data');
    localStorage.removeItem('rubikinn_guest_registered');
    localStorage.removeItem('rubikinn_guest_data');
    setRoomData(null);
    setIsRegistered(false);
    setError(null);
  };

  return {
    roomData,
    loading,
    error,
    isRegistered,
    authenticateByToken,
    registerGuest,
    loadFromStorage,
    clearData,
    clearError: () => setError(null)
  };
};
