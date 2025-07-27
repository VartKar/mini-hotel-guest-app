
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomAccess } from '@/hooks/useRoomAccess';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import RoomGuestRegistration from '@/components/RoomGuestRegistration';

const RoomAccessPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { 
    roomData, 
    loading, 
    error, 
    isRegistered, 
    authenticateByToken, 
    registerGuest, 
    loadFromStorage 
  } = useRoomAccess();
  const [authStep, setAuthStep] = useState<'loading' | 'registration' | 'success' | 'error'>('loading');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations
    
    const initializeRoom = async () => {
      console.log('Initializing room with token:', token);
      
      // First check if there's stored data
      const hasStoredData = loadFromStorage();
      console.log('Has stored data:', hasStoredData, 'is registered:', isRegistered);
      
      if (hasStoredData && isRegistered) {
        console.log('User already registered, redirecting to success');
        setAuthStep('success');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
        setIsInitialized(true);
        return;
      }

      // If no token provided, show error
      if (!token) {
        console.log('No token provided');
        setAuthStep('error');
        setIsInitialized(true);
        return;
      }

      // If we have stored data but not registered, go to registration
      if (hasStoredData && !isRegistered) {
        console.log('Has stored data but not registered, going to registration');
        setAuthStep('registration');
        setIsInitialized(true);
        return;
      }

      // Authenticate with token
      console.log('Authenticating with token:', token);
      const success = await authenticateByToken(token);
      console.log('Authentication result:', success);
      
      if (success) {
        setAuthStep('registration');
      } else {
        setAuthStep('error');
      }
      
      setIsInitialized(true);
    };

    initializeRoom();
  }, [token]); // Only depend on token

  const handleGuestRegistration = async (guestData: {
    guest_email?: string;
    guest_phone?: string;
    guest_name?: string;
  }) => {
    console.log('🔄 Registering guest with data:', guestData);
    const success = await registerGuest(guestData);
    console.log('✅ Registration result:', success);
    
    if (success) {
      setAuthStep('success');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    }
    
    return success;
  };

  if (authStep === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Загрузка...</h2>
            <p className="text-gray-600">Проверяем доступ к номеру</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authStep === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-semibold mb-2">Ошибка доступа</h2>
            <p className="text-gray-600 mb-4">
              {error || 'Номер не найден или ссылка недействительна'}
            </p>
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

  if (authStep === 'registration') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {roomData?.apartment_name || 'Ваш номер'}
            </h1>
            <p className="text-gray-600">
              Номер: {roomData?.room_number} • {roomData?.city}
            </p>
          </div>
          
          <RoomGuestRegistration
            onRegister={handleGuestRegistration}
            error={error}
          />
        </div>
      </div>
    );
  }

  if (authStep === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">Добро пожаловать!</h2>
            <p className="text-gray-600 mb-2">
              Вы успешно зарегистрированы в номере {roomData?.room_number}
            </p>
            <p className="text-sm text-gray-500">
              Перенаправляем вас на главную страницу...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default RoomAccessPage;
