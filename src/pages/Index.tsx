
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, User, Info } from "lucide-react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

// Placeholder image
const DEFAULT_IMG = "https://i.postimg.cc/NFprr3hY/valse.png";

const menuItems = [{
  name: "Мой номер",
  icon: <Home size={32} />,
  path: "/room"
}, {
  name: "Что посмотреть",
  icon: <Map size={32} />,
  path: "/travel"
}, {
  name: "Услуги отеля",
  icon: <Coffee size={32} />,
  path: "/services"
}, {
  name: "Маркет",
  icon: <ShoppingBag size={32} />,
  path: "/shop"
}, {
  name: "Консьерж",
  icon: <MessageCircle size={32} />,
  path: "/chat"
}, {
  name: "Профиль",
  icon: <User size={32} />,
  path: "/feedback"
}];

const Index = () => {
  const { roomData, loading, isPersonalized } = useRoomData();

  const apartmentName = roomData?.apartment_name || 'Апартаменты "Вальс"';
  const guestName = roomData?.guest_name || "Иван";

  // For main page: prioritize main_image_url (hotel overview), then room_image_url
  const getValidImage = () => {
    console.log('🖼️ Index getValidImage called with:', {
      main_image_url: roomData?.main_image_url,
      room_image_url: roomData?.room_image_url
    });
    
    if (roomData?.main_image_url && roomData.main_image_url.trim() !== '') {
      console.log('✅ Index using main_image_url:', roomData.main_image_url);
      return roomData.main_image_url;
    }
    if (roomData?.room_image_url && roomData.room_image_url.trim() !== '') {
      console.log('✅ Index using room_image_url as fallback:', roomData.room_image_url);
      return roomData.room_image_url;
    }
    console.log('⚠️ Index using default image');
    return DEFAULT_IMG;
  };

  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset error state if image URLs change
  React.useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [roomData?.main_image_url, roomData?.room_image_url]);

  const hotelImage = getValidImage();

  console.log('🖼️ Index page final image logic:', {
    finalImageUrl: hotelImage,
    imgError,
    imgLoaded,
    loading
  });

  const documentTitle = roomData?.apartment_name
    ? `RubikInn - ${roomData.apartment_name}`
    : 'RubikInn';

  useDocumentTitle(documentTitle);

  return (
    <>
      {/* Fixed Header */}
      <header className="sticky top-0 z-10 bg-white px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-medium text-gray-900">
          Добро пожаловать, {guestName}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {apartmentName}
        </p>
      </header>

      {/* Main Content */}
      <div className="p-4">
        {/* Menu section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {menuItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300 active:scale-[0.99]"
            >
              <div className="text-gray-900 mb-3">{item.icon}</div>
              <span className="text-center font-medium text-gray-900">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Demo info for non-personalized */}
        {!isPersonalized && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-800 font-medium">
                  Просмотр демо-данных
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Введите свой email в личном кабинете для персонализированной информации
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
