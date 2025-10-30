import React, { useState } from "react";
import { Wifi, Car, Coffee, Tv, Shield, Bed } from "lucide-react";
import { useRoomData } from "@/hooks/useRoomData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import InstructionCard from "@/components/room/InstructionCard";

const RoomPage = () => {
  useDocumentTitle("Ваш номер");
  const { roomData, loading } = useRoomData();
  const [imgError, setImgError] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Информация о номере недоступна</p>
      </div>
    );
  }

  const getImageUrl = (): string | null => {
    if (roomData.room_image_url && roomData.room_image_url.trim() !== '') {
      return roomData.room_image_url;
    }
    if (roomData.main_image_url && roomData.main_image_url.trim() !== '') {
      return roomData.main_image_url;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  // Reset error state if image URLs change
  React.useEffect(() => {
    setImgError(false);
  }, [roomData?.main_image_url, roomData?.room_image_url]);

  return (
    <main className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Ваш номер</h1>
      
      {imageUrl && !imgError && (
        <div className="mb-6">
          <img 
            src={imageUrl} 
            alt={roomData.apartment_name || "Room"} 
            className="w-full h-48 object-cover rounded-lg"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {imgError && (
        <div className="mb-6 w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-sm">Изображение недоступно</span>
        </div>
      )}
      
      <section className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-2xl font-medium mb-4">{roomData.apartment_name}</h2>
        <p className="text-hotel-neutral mb-4">Номер: {roomData.room_number}</p>
        
        {roomData.check_in_date && roomData.check_out_date && (
          <div className="mb-6">
            <p className="text-sm text-hotel-neutral mb-1">Период проживания:</p>
            <p className="font-medium">{roomData.check_in_date} - {roomData.check_out_date}</p>
          </div>
        )}
      </section>

      {(roomData.wifi_network || roomData.wifi_password) && (
        <section className="bg-white rounded-lg p-6 shadow-sm mb-4">
          <div className="flex items-center mb-3">
            <Wifi className="w-5 h-5 text-hotel-accent mr-2" />
            <h3 className="text-lg font-medium">Wi-Fi</h3>
          </div>
          {roomData.wifi_network && (
            <p className="text-sm text-hotel-neutral mb-1">
              Сеть: <span className="font-medium">{roomData.wifi_network}</span>
            </p>
          )}
          {roomData.wifi_password && (
            <p className="text-sm text-hotel-neutral">
              Пароль: <span className="font-medium">{roomData.wifi_password}</span>
            </p>
          )}
        </section>
      )}

      <section className="space-y-4">
        {roomData.ac_instructions && (
          <InstructionCard icon="❄️" title="Кондиционер" content={roomData.ac_instructions} />
        )}

        {roomData.coffee_instructions && (
          <InstructionCard icon={Coffee} title="Кофеварка" content={roomData.coffee_instructions} />
        )}

        {roomData.tv_instructions && (
          <InstructionCard icon={Tv} title="Телевизор" content={roomData.tv_instructions} />
        )}

        {roomData.safe_instructions && (
          <InstructionCard icon={Shield} title="Сейф" content={roomData.safe_instructions} />
        )}

        {roomData.parking_info && (
          <InstructionCard icon={Car} title="Парковка" content={roomData.parking_info} />
        )}

        {roomData.extra_bed_info && (
          <InstructionCard icon={Bed} title="Дополнительное спальное место" content={roomData.extra_bed_info} />
        )}
      </section>

      {roomData.notes_for_guests && (
        <section className="bg-blue-50 border-l-4 border-hotel-accent rounded-lg p-4 shadow-sm mt-6">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark mr-3">
              📝
            </div>
            <h4 className="font-medium text-hotel-dark">Заметки для гостей</h4>
          </div>
          <p className="text-sm text-hotel-neutral ml-11 whitespace-pre-wrap">
            {roomData.notes_for_guests}
          </p>
        </section>
      )}

      {roomData.checkout_time && (
        <section className="bg-gradient-to-r from-hotel-accent to-yellow-100 rounded-lg p-4 shadow-sm mt-6">
          <h4 className="font-medium text-hotel-dark mb-1">Время выезда</h4>
          <p className="text-sm text-hotel-dark">{roomData.checkout_time}</p>
        </section>
      )}
    </main>
  );
};

export default RoomPage;
