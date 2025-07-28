
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGuestBookingByToken } from '@/utils/tokenUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const GuestPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const authenticateGuest = async () => {
      if (!token) {
        setError('Токен не найден');
        setLoading(false);
        return;
      }

      try {
        const guestBooking = await getGuestBookingByToken(token);
        
        if (!guestBooking) {
          setError('Бронирование не найдено или ссылка недействительна');
          setLoading(false);
          return;
        }

        setBookingData(guestBooking);
        
        // Save data to localStorage for useRoomData
        const roomData = {
          ...guestBooking,
          session_type: 'registered',
          session_token: null
        };
        
        localStorage.setItem('rubikinn_room_data', JSON.stringify(roomData));
        localStorage.setItem('rubikinn_is_personalized', 'true');
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
        
      } catch (err) {
        console.error('Error authenticating guest:', err);
        setError('Произошла ошибка при авторизации');
      } finally {
        setLoading(false);
      }
    };

    authenticateGuest();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Авторизация...</h2>
            <p className="text-gray-600">Проверяем вашу персональную ссылку</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2">Ошибка авторизации</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              На главную
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-4 text-green-600" />
          <h2 className="text-xl font-semibold mb-2">Добро пожаловать!</h2>
          <p className="text-gray-600 mb-2">
            Здравствуйте, {bookingData?.guest_name || 'гость'}!
          </p>
          <p className="text-sm text-gray-500">
            Перенаправляем вас на главную страницу...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestPage;
