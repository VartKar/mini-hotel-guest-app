import React from "react";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, User } from "lucide-react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useImageLoader } from "@/hooks/useImageLoader";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { HotelImageCard } from "@/components/home/HotelImageCard";
import { MenuGrid, MenuItem } from "@/components/home/MenuGrid";
import { DemoNotice } from "@/components/home/DemoNotice";

const DEFAULT_IMG = "https://i.postimg.cc/NFprr3hY/valse.png";

const menuItems: MenuItem[] = [
  { name: "Мой номер", icon: Home, path: "/room" },
  { name: "Что вокруг", icon: Map, path: "/travel" },
  { name: "Услуги отеля", icon: Coffee, path: "/services" },
  { name: "Маркет", icon: ShoppingBag, path: "/shop" },
  { name: "Консьерж", icon: MessageCircle, path: "/chat" },
  { name: "Профиль", icon: User, path: "/feedback" }
];

const Index = () => {
  const { roomData, loading, isPersonalized } = useRoomData();

  const apartmentName = roomData?.apartment_name || 'Апартаменты "Вальс"';
  const guestName = roomData?.guest_name || "Иван";

  const { imageUrl, isLoading, hasError, handleLoad, handleError } = useImageLoader({
    primaryUrl: roomData?.main_image_url,
    fallbackUrl: roomData?.room_image_url,
    defaultUrl: DEFAULT_IMG
  });

  const documentTitle = roomData?.apartment_name
    ? `RubikInn - ${roomData.apartment_name}`
    : 'RubikInn';

  useDocumentTitle(documentTitle);

  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <WelcomeHeader guestName={guestName} apartmentName={apartmentName} />

        <HotelImageCard
          imageUrl={imageUrl}
          isLoading={loading || isLoading}
          hasError={hasError}
          onLoad={handleLoad}
          onError={handleError}
          defaultImage={DEFAULT_IMG}
        />

        <MenuGrid items={menuItems} />

        {!isPersonalized && <DemoNotice />}
      </div>
    </main>
  );
};

export default Index;
