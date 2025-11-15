
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Home, MapPin, Coffee, ShoppingBag, MessageCircle, User, Info } from "lucide-react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Placeholder image
const DEFAULT_IMG = "https://i.postimg.cc/NFprr3hY/valse.png";

const menuItems = [{
  name: "Мой номер",
  subtitle: "WiFi, парковки и прочее",
  icon: <Home size={20} strokeWidth={1.5} />,
  path: "/room",
  colorClass: "bg-blue-50 text-blue-600"
}, {
  name: "Что вокруг",
  subtitle: "Интересное в городе",
  icon: <MapPin size={20} strokeWidth={1.5} />,
  path: "/travel",
  colorClass: "bg-green-50 text-green-600"
}, {
  name: "Услуги отеля",
  icon: <Coffee size={20} strokeWidth={1.5} />,
  path: "/services",
  colorClass: "bg-purple-50 text-purple-600"
}, {
  name: "Маркет",
  icon: <ShoppingBag size={20} strokeWidth={1.5} />,
  path: "/shop",
  colorClass: "bg-orange-50 text-orange-600"
}, {
  name: "Консьерж",
  icon: <MessageCircle size={20} strokeWidth={1.5} />,
  path: "/chat",
  colorClass: "bg-pink-50 text-pink-600"
}, {
  name: "Профиль и бонусы",
  icon: <User size={20} strokeWidth={1.5} />,
  path: "/feedback",
  colorClass: "bg-indigo-50 text-indigo-600"
}];

const Index = () => {
  const { roomData, loading, isPersonalized } = useRoomData();
  const queryClient = useQueryClient();

  const apartmentName = roomData?.apartment_name || 'Апартаменты "Вальс"';
  const guestName = roomData?.guest_name || "Иван";

  // Memoized image selection
  const hotelImage = useMemo(() => {
    if (roomData?.main_image_url?.trim()) return roomData.main_image_url;
    if (roomData?.room_image_url?.trim()) return roomData.room_image_url;
    return DEFAULT_IMG;
  }, [roomData?.main_image_url, roomData?.room_image_url]);

  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset error state if image URLs change
  React.useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [roomData?.main_image_url, roomData?.room_image_url]);

  // Prefetch shop items for faster /shop page loading
  React.useEffect(() => {
    if (roomData?.city && roomData?.property_id) {
      queryClient.prefetchQuery({
        queryKey: ['shop-items', roomData.city, roomData.property_id],
        queryFn: async () => {
          const [itemsResult, pricingResult] = await Promise.all([
            supabase
              .from('shop_items')
              .select('*')
              .eq('city', roomData.city)
              .eq('is_active', true)
              .order('category', { ascending: true }),
            supabase
              .from('property_item_pricing')
              .select('shop_item_id, price_override, is_available')
              .eq('property_id', roomData.property_id)
          ]);

          const { data: items } = itemsResult;
          const { data: pricing } = pricingResult;

          if (!items) return [];

          return items.map(item => {
            const itemPricing = pricing?.find(p => p.shop_item_id === item.id);
            return {
              ...item,
              final_price: itemPricing?.price_override || item.base_price,
              is_available: itemPricing?.is_available !== false
            };
          });
        }
      });
    }
  }, [roomData?.city, roomData?.property_id, queryClient]);

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

        {/* Main hotel image section */}
        <div className="w-full h-48 mb-8 rounded-lg overflow-hidden flex items-center justify-center bg-hotel-light relative">
          {loading && (
            <div className="w-full h-full animate-pulse bg-gray-200" />
          )}
          {!loading && !imgError && (
            <img
              src={hotelImage}
              alt="Фото апартаментов"
              className={`object-cover w-full h-full transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => {
                console.log('✅ Index image loaded successfully:', hotelImage);
                setImgLoaded(true);
              }}
              onError={() => {
                console.error('❌ Index image failed to load:', hotelImage);
                setImgError(true);
              }}
              style={{ minHeight: "192px", minWidth: "100%" }}
            />
          )}
          {!loading && imgError && (
            <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center">
              <span className="text-gray-400 text-xs">Ошибка загрузки изображения</span>
              <img
                src={DEFAULT_IMG}
                alt="Фото по умолчанию"
                className="w-20 h-20 opacity-40 mt-2"
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Menu section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {menuItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-start bg-white rounded-lg p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className={`w-10 h-10 rounded-lg ${item.colorClass} flex items-center justify-center mb-3`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium text-gray-900 mb-1">{item.name}</span>
              {item.subtitle && <span className="text-xs text-gray-400">{item.subtitle}</span>}
            </Link>
          ))}
        </div>

        {/* Demo info for non-personalized */}
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
      </div>
    </div>
  );
};

export default Index;
