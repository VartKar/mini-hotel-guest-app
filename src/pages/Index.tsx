
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, User, Search, LogOut, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/hooks/use-toast";

const menuItems = [{
  name: "Мой номер",
  icon: <Home size={32} />,
  path: "/room"
}, {
  name: "Путешествие",
  icon: <Map size={32} />,
  path: "/travel"
}, {
  name: "Сервисы",
  icon: <Coffee size={32} />,
  path: "/services"
}, {
  name: "Магазин",
  icon: <ShoppingBag size={32} />,
  path: "/shop"
}, {
  name: "Чат с консьержем",
  icon: <MessageCircle size={32} />,
  path: "/chat"
}, {
  name: "Личный кабинет",
  icon: <User size={32} />,
  path: "/feedback"
}];

const Index = () => {
  const { roomData, loading, lookupByEmail, clearPersonalData, isPersonalMode } = useRoomData();
  const [email, setEmail] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [guestName, setGuestName] = useState("Иван");
  const [homeImage, setHomeImage] = useState("https://i.postimg.cc/NFprr3hY/valse.png");
  const { toast } = useToast();

  // Use apartment name from database or fallback to default
  const apartmentName = roomData?.apartment_name || 'Апартаменты "Вальс"';
  
  // Set dynamic document title
  const documentTitle = roomData?.apartment_name 
    ? `RubikInn - ${roomData.apartment_name}`
    : 'RubikInn';
  
  useDocumentTitle(documentTitle);

  const handleEmailLookup = async () => {
    if (!email.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваш email",
        variant: "destructive"
      });
      return;
    }

    setIsLookingUp(true);
    const success = await lookupByEmail(email.trim());
    
    if (success) {
      toast({
        title: "Успех!",
        description: "Ваши данные найдены и загружены",
      });
      setEmail(""); // Clear email input after successful lookup
    } else {
      toast({
        title: "Бронирование не найдено",
        description: "Проверьте правильность email или обратитесь на ресепшен",
        variant: "destructive"
      });
    }
    
    setIsLookingUp(false);
  };

  const handleLogOff = () => {
    clearPersonalData();
    toast({
      title: "Выход выполнен",
      description: "Возвращаемся к демо-данным",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailLookup();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Demo/Personal Mode Banner */}
        {!isPersonalMode ? (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <Info size={16} />
              <span className="text-sm">
                Просмотр демо-данных - Введите ваш email для персональной информации
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <User size={16} />
                <span className="text-sm">
                  Персональные данные: {roomData?.guest_email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogOff}
                className="text-xs h-7"
              >
                <LogOut size={12} className="mr-1" />
                Выйти
              </Button>
            </div>
          </div>
        )}

        {/* Email Lookup Section */}
        {!isPersonalMode && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-3">Найти мое бронирование</h3>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Введите ваш email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isLookingUp}
              />
              <Button 
                onClick={handleEmailLookup}
                disabled={isLookingUp}
                className="px-4"
              >
                {isLookingUp ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Для тестирования попробуйте: monaco2@ya.ru
            </p>
          </div>
        )}

        <div className="py-8">
          <h1 className="font-light mb-3 text-center text-2xl">
            <span>Добро пожаловать, </span>
            <span 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setGuestName(e.currentTarget.innerText)}
              className="border-b border-dashed border-gray-300 focus:outline-none focus:border-hotel-dark px-1"
            >
              {roomData?.guest_name || guestName}
            </span>
          </h1>
          <p className="text-xl text-hotel-neutral text-center">
            {apartmentName}
          </p>
        </div>

        <div 
          className="w-full h-48 mb-8 rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundImage: `url('${homeImage}')` }}
          onClick={() => {
            const newUrl = prompt("Введите URL новой фотографии:", homeImage);
            if (newUrl) setHomeImage(newUrl);
          }}
          title="Нажмите, чтобы изменить изображение"
        />

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex flex-col items-center justify-center bg-white rounded-lg p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="text-hotel-dark mb-3">{item.icon}</div>
              <span className="text-center font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
