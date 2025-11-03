import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, User, Info } from "lucide-react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const DEFAULT_IMG = "https://i.postimg.cc/NFprr3hY/valse.png";

const menuItems = [{
  name: "Мой номер",
  subtitle: "Wi-Fi, парковка и другая информация",
  icon: <Home size={24} strokeWidth={1.5} />,
  path: "/room",
  colorClass: "bg-blue-50 text-blue-600"
}, {
  name: "Что вокруг",
  subtitle: "Интересные места, экскурсии, кафе",
  icon: <Map size={24} strokeWidth={1.5} />,
  path: "/travel",
  colorClass: "bg-green-50 text-green-600"
}, {
  name: "Услуги отеля",
  subtitle: "Уборка, трансфер, стирка",
  icon: <Coffee size={24} strokeWidth={1.5} />,
  path: "/services",
  colorClass: "bg-purple-50 text-purple-600"
}, {
  name: "Маркет",
  subtitle: "Местные товары и сувениры",
  icon: <ShoppingBag size={24} strokeWidth={1.5} />,
  path: "/shop",
  colorClass: "bg-orange-50 text-orange-600"
}, {
  name: "Консьерж",
  subtitle: "На связи по всем вопросам",
  icon: <MessageCircle size={24} strokeWidth={1.5} />,
  path: "/chat",
  colorClass: "bg-pink-50 text-pink-600"
}, {
  name: "Мой профиль",
  subtitle: "Бонусы и настройки",
  icon: <User size={24} strokeWidth={1.5} />,
  path: "/feedback",
  colorClass: "bg-indigo-50 text-indigo-600"
}];

const AltIndex = () => {
  const { roomData, loading, isPersonalized } = useRoomData();

  const apartmentName = roomData?.apartment_name || 'Апартаменты "Вальс"';
  const guestName = roomData?.guest_name || "Иван";

  const getValidImage = () => {
    if (roomData?.main_image_url && roomData.main_image_url.trim() !== '') {
      return roomData.main_image_url;
    }
    if (roomData?.room_image_url && roomData.room_image_url.trim() !== '') {
      return roomData.room_image_url;
    }
    return DEFAULT_IMG;
  };

  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  React.useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [roomData?.main_image_url, roomData?.room_image_url]);

  const hotelImage = getValidImage();

  const documentTitle = roomData?.apartment_name
    ? `RubikInn Alt - ${roomData.apartment_name}`
    : 'RubikInn Alt';

  useDocumentTitle(documentTitle);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-8">
        <div className="w-full max-w-md mx-auto px-4">
          {/* Compact image at top */}
          <div className="pt-6 pb-4 flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
              {loading && (
                <div className="w-full h-full animate-pulse bg-gray-200" />
              )}
              {!loading && !imgError && (
                <img
                  src={hotelImage}
                  alt="Фото апартаментов"
                  className={`object-cover w-full h-full transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                />
              )}
              {!loading && imgError && (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <img
                    src={DEFAULT_IMG}
                    alt="Фото по умолчанию"
                    className="w-12 h-12 opacity-40"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <h1 className="font-medium mb-2 text-center text-3xl text-gray-900">
              <span>Добро пожаловать, </span>
              <span className="border-b-2 border-dashed border-blue-300 px-1">
                {guestName}
              </span>
            </h1>
            <p className="text-lg text-gray-600 text-center font-light">
              {apartmentName}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="w-full max-w-md mx-auto px-4 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {menuItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-start bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg ${item.colorClass} flex items-center justify-center mb-3`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-900 mb-1">{item.name}</span>
              <span className="text-xs text-gray-400 leading-relaxed">{item.subtitle}</span>
            </Link>
          ))}
        </div>

        {/* Demo info */}
        {!isPersonalized && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-6">
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

        {/* Link to original design */}
        <div className="text-center pb-8">
          <Link 
            to="/" 
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            Вернуться к оригинальному дизайну
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AltIndex;
