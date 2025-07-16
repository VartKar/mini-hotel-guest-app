import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRoomData } from "@/hooks/useRoomData";
import { useTokenAuth } from "@/hooks/useTokenAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Wifi, 
  Key, 
  Phone,
  Mail,
  Building,
  ExternalLink
} from "lucide-react";

const Index = () => {
  useDocumentTitle("Добро пожаловать!");
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Existing email-based auth
  const { roomData, loading: roomLoading, error: roomError, loginWithEmail, logout: roomLogout, isAuthenticated: roomAuthenticated } = useRoomData();
  
  // New token-based auth
  const { guestData, loading: tokenLoading, error: tokenError, loginWithToken, logout: tokenLogout, isAuthenticated: tokenAuthenticated } = useTokenAuth();
  
  const [email, setEmail] = useState("");
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  // Check for token in URL params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !tokenAuthenticated) {
      loginWithToken(token);
    }
  }, [searchParams, tokenAuthenticated]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email);
    if (success) {
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать!",
      });
    }
  };

  const handleLogout = () => {
    if (roomAuthenticated) {
      roomLogout();
    }
    if (tokenAuthenticated) {
      tokenLogout();
    }
    setEmail("");
    setShowEmailLogin(false);
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
  };

  const isAuthenticated = roomAuthenticated || tokenAuthenticated;
  const currentGuestData = roomData || guestData;
  const loading = roomLoading || tokenLoading;
  const error = roomError || tokenError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем информацию...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Добро пожаловать!
            </h1>
            <p className="text-gray-600">
              Получите доступ к информации о вашем номере
            </p>
          </div>

          {!showEmailLogin ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Button 
                  onClick={() => setShowEmailLogin(true)} 
                  className="w-full"
                  variant="outline"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Войти по email
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  <p>Используйте email, указанный при бронировании</p>
                  <p className="mt-2">Или перейдите по персональной ссылке из письма/QR-кода</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Вход по email</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Введите ваш email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Проверяем..." : "Войти"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowEmailLogin(false)}
                    >
                      Назад
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Добро пожаловать, {currentGuestData?.guest_name || "Гость"}!
            </h1>
            <p className="text-gray-600 mt-2">
              {currentGuestData?.apartment_name} • Номер {currentGuestData?.room_number}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Выйти
          </Button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/room')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Информация о номере
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                WiFi, инструкции, удобства
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/travel')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Путешествия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Маршруты и экскурсии
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/services')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Услуги отеля
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Заказ услуг и сервисов
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/shop')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Магазин
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Товары и продукты
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/chat')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Поддержка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Онлайн чат с поддержкой
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/feedback')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Обратная связь
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Оценки и отзывы
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Info */}
        {currentGuestData && (
          <Card>
            <CardHeader>
              <CardTitle>Быстрая информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Период проживания</p>
                    <p className="text-sm text-gray-600">
                      {currentGuestData.check_in_date} - {currentGuestData.check_out_date}
                    </p>
                  </div>
                </div>
                
                {currentGuestData.wifi_network && (
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">WiFi</p>
                      <p className="text-sm text-gray-600">
                        {currentGuestData.wifi_network}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {currentGuestData.host_name && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Ваш хост</p>
                    <p className="text-sm text-gray-600">
                      {currentGuestData.host_name}
                      {currentGuestData.host_company && ` • ${currentGuestData.host_company}`}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
