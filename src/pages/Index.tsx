
import React, { useEffect, useState } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useTokenAuth } from "@/hooks/useTokenAuth";
import RoomPage from "./RoomPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { roomData, loading, error, lookupByEmail, logOut, clearError } = useRoomData();
  const { 
    booking: tokenBooking, 
    loading: tokenLoading, 
    error: tokenError, 
    authenticateWithToken, 
    logout: tokenLogout,
    clearError: clearTokenError,
    isAuthenticated: isTokenAuthenticated 
  } = useTokenAuth();
  
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for token in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      console.log('Token found in URL:', token);
      authenticateWithToken(token);
      // Clean URL after processing token
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [authenticateWithToken]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Введите email адрес");
      return;
    }

    setIsLoggingIn(true);
    clearError();
    clearTokenError();
    
    const success = await lookupByEmail(email);
    
    if (success) {
      toast.success("Добро пожаловать!");
      setEmail("");
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logOut();
    tokenLogout();
    toast.success("Вы вышли из системы");
  };

  // Show room page if authenticated via email or token
  if (roomData || tokenBooking) {
    const currentBooking = roomData || tokenBooking;
    return (
      <RoomPage 
        roomData={currentBooking} 
        onLogout={handleLogout}
        isPersonalized={true}
      />
    );
  }

  // Show loading state
  if (loading || tokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-light text-gray-800">
              Добро пожаловать
            </CardTitle>
            <CardDescription className="text-gray-600">
              Введите email для доступа к информации о вашем размещении
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Ваш email адрес"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoggingIn}
                />
                {(error || tokenError) && (
                  <p className="text-sm text-red-600">{error || tokenError}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoggingIn || !email.trim()}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Поиск...
                  </>
                ) : (
                  'Найти мое бронирование'
                )}
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Если у вас есть персональная ссылка, просто перейдите по ней для автоматического входа
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
