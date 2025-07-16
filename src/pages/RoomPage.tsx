
import React from "react";
import { Wifi, Car, Coffee, Tv, Shield, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomData } from "@/hooks/useRoomData";

interface RoomPageProps {
  roomData?: RoomData;
  onLogout?: () => void;
  isPersonalized?: boolean;
}

const RoomPage: React.FC<RoomPageProps> = ({ roomData, onLogout, isPersonalized }) => {
  if (!roomData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Информация о номере недоступна</p>
      </div>
    );
  }

  const imageUrl = roomData.room_image_url || roomData.main_image_url;

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light">Ваш номер</h1>
        {onLogout && isPersonalized && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="text-sm"
          >
            Выйти
          </Button>
        )}
      </div>
      
      {imageUrl && (
        <div className="mb-6">
          <img 
            src={imageUrl} 
            alt={roomData.apartment_name || "Room"} 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-2xl font-medium mb-4">{roomData.apartment_name}</h2>
        <p className="text-hotel-neutral mb-4">Номер: {roomData.room_number}</p>
        
        {roomData.check_in_date && roomData.check_out_date && (
          <div className="mb-6">
            <p className="text-sm text-hotel-neutral mb-1">Период проживания:</p>
            <p className="font-medium">{roomData.check_in_date} - {roomData.check_out_date}</p>
          </div>
        )}
      </div>

      {/* WiFi Information */}
      {(roomData.wifi_network || roomData.wifi_password) && (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
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
        </div>
      )}

      {/* Instructions Grid */}
      <div className="space-y-4">
        {roomData.ac_instructions && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark mr-3">
                ❄️
              </div>
              <h4 className="font-medium">Кондиционер</h4>
            </div>
            <p className="text-sm text-hotel-neutral ml-11">{roomData.ac_instructions}</p>
          </div>
        )}

        {roomData.coffee_instructions && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Coffee className="w-5 h-5 text-hotel-accent mr-3 ml-1" />
              <h4 className="font-medium">Кофеварка</h4>
            </div>
            <p className="text-sm text-hotel-neutral ml-11">{roomData.coffee_instructions}</p>
          </div>
        )}

        {roomData.tv_instructions && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Tv className="w-5 h-5 text-hotel-accent mr-3 ml-1" />
              <h4 className="font-medium">Телевизор</h4>
            </div>
            <p className="text-sm text-hotel-neutral ml-11">{roomData.tv_instructions}</p>
          </div>
        )}

        {roomData.safe_instructions && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-hotel-accent mr-3 ml-1" />
              <h4 className="font-medium">Сейф</h4>
            </div>
            <p className="text-sm text-hotel-neutral ml-11">{roomData.safe_instructions}</p>
          </div>
        )}

        {roomData.parking_info && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Car className="w-5 h-5 text-hotel-accent mr-3 ml-1" />
              <h4 className="font-medium">Парковка</h4>
            </div>
            <p className="text-sm text-hotel-neutral ml-11">{roomData.parking_info}</p>
          </div>
        )}

        {roomData.extra_bed_info && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Bed className="w-5 h-5 text-hotel-accent mr-3 ml-1" />
              <h4 className="font-medium">Дополнительное спальное место</h4>
            </div>
            <p className="text-sm text-hotel-neutral ml-11">{roomData.extra_bed_info}</p>
          </div>
        )}
      </div>

      {roomData.checkout_time && (
        <div className="bg-gradient-to-r from-hotel-accent to-yellow-100 rounded-lg p-4 shadow-sm mt-6">
          <h4 className="font-medium text-hotel-dark mb-1">Время выезда</h4>
          <p className="text-sm text-hotel-dark">{roomData.checkout_time}</p>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
