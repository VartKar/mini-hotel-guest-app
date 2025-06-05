
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, User, Wifi, Info } from "lucide-react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

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
  const { roomData, loading, isPersonalized } = useRoomData();
  const [homeImage, setHomeImage] = useState("https://i.postimg.cc/NFprr3hY/valse.png");

  // Use apartment name from database or fallback to default
  const apartmentName = roomData?.apartment_name || 'Апартаменты "Вальс"';
  const guestName = roomData?.guest_name || "Иван";
  
  // Set dynamic document title
  const documentTitle = roomData?.apartment_name 
    ? `RubikInn - ${roomData.apartment_name}`
    : 'RubikInn';
  
  useDocumentTitle(documentTitle);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="py-8">
          <h1 className="font-light mb-3 text-center text-2xl">
            <span>Добро пожаловать, </span>
            <span className="border-b border-dashed border-gray-300 px-1">
              {guestName}
            </span>
          </h1>
          <p className="text-xl text-hotel-neutral text-center">
            {apartmentName}
          </p>
        </div>

        {!isPersonalized && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Просмотр демо-данных
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Введите свой email в личном кабинете для персонализированной информации
                </p>
              </div>
            </div>
          </div>
        )}

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
