
import React, { useState } from "react";
import { Wifi, Clock, Coffee, Wind, Tv, CreditCard, Car, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRoomData } from "@/hooks/useRoomData";

const RoomPage = () => {
  const { roomData, loading, error } = useRoomData();
  
  // Local state for editable fields, initialized with data from database
  const [stayDuration, setStayDuration] = useState("");
  const [wifiNetwork, setWifiNetwork] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [roomImage, setRoomImage] = useState("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");
  
  // Amenity instructions with default text
  const [amenityInstructions, setAmenityInstructions] = useState({
    airConditioner: "",
    coffeeMachine: "",
    smartTV: "",
    safe: ""
  });
  
  // Additional information
  const [additionalInfo, setAdditionalInfo] = useState({
    parking: "",
    extraBed: "",
    pets: "",
  });

  // Update local state when roomData is loaded
  React.useEffect(() => {
    if (roomData) {
      setStayDuration(roomData.stay_duration || "3 ночи (12.06 - 15.06)");
      setWifiNetwork(roomData.wifi_network || "GuestNetwork");
      setWifiPassword(roomData.wifi_password || "SeaStar2025");
      setCheckoutTime(roomData.checkout_time || "12:00");
      setRoomImage(roomData.room_image_url || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80");
      
      setAmenityInstructions({
        airConditioner: roomData.ac_instructions || "Пульт находится на прикроватной тумбочке. Рекомендуемая температура 22-24°C.",
        coffeeMachine: roomData.coffee_instructions || "Капсулы для кофемашины находятся в ящике под ней. Инструкция на боковой стороне.",
        smartTV: roomData.tv_instructions || "Пульт от телевизора на столике. Для Netflix используйте кнопку на пульте.",
        safe: roomData.safe_instructions || "Сейф находится в шкафу. Установите свой код и нажмите '#' для подтверждения."
      });

      setAdditionalInfo({
        parking: roomData.parking_info || "Бесплатная парковка доступна для всех гостей. Въезд со стороны главного входа.",
        extraBed: roomData.extra_bed_info || "Дополнительная кровать доступна по запросу (500 руб/ночь)",
        pets: roomData.pets_info || "Размещение с домашними животными разрешено (депозит 2000 руб)",
      });
    }
  }, [roomData]);

  // Handle amenity instruction change
  const handleInstructionChange = (amenity: keyof typeof amenityInstructions, value: string) => {
    setAmenityInstructions(prev => ({
      ...prev,
      [amenity]: value
    }));
  };

  // Handle additional info change
  const handleAdditionalInfoChange = (field: keyof typeof additionalInfo, value: string) => {
    setAdditionalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto pt-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Загрузка данных номера...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto pt-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-lg text-red-600">Ошибка загрузки: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Мой номер</h1>
      
      <div 
        className="w-full h-48 mb-6 rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity" 
        style={{ backgroundImage: `url('${roomImage}')` }}
        onClick={() => {
          const newUrl = prompt("Введите URL новой фотографии:", roomImage);
          if (newUrl) setRoomImage(newUrl);
        }}
        title="Нажмите, чтобы изменить изображение"
      />
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-start mb-2">
          <Clock className="mr-3 text-hotel-dark flex-shrink-0 mt-1" size={24} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-medium">Длительность проживания</h2>
            </div>
            <div 
              className="p-2 bg-gray-50 rounded border border-gray-100 focus-within:border-hotel-dark transition-colors"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setStayDuration(e.currentTarget.innerText)}
            >
              {stayDuration}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-start mb-2">
          <Wifi className="mr-3 text-hotel-dark flex-shrink-0 mt-1" size={24} />
          <div className="w-full">
            <h2 className="text-xl font-medium mb-2">Wi-Fi</h2>
            <div className="mb-2">
              <p className="text-hotel-neutral mb-1">Сеть:</p>
              <div 
                className="p-2 bg-gray-50 rounded border border-gray-100 focus-within:border-hotel-dark transition-colors"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setWifiNetwork(e.currentTarget.innerText)}
              >
                {wifiNetwork}
              </div>
            </div>
            <div>
              <p className="text-hotel-neutral mb-1">Пароль:</p>
              <div 
                className="p-2 bg-gray-50 rounded border border-gray-100 focus-within:border-hotel-dark transition-colors"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setWifiPassword(e.currentTarget.innerText)}
              >
                {wifiPassword}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-start mb-2">
          <Clock className="mr-3 text-hotel-dark flex-shrink-0 mt-1" size={24} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-medium">Время выезда</h2>
            </div>
            <div 
              className="p-2 bg-gray-50 rounded border border-gray-100 focus-within:border-hotel-dark transition-colors"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setCheckoutTime(e.currentTarget.innerText)}
            >
              {checkoutTime}
            </div>
            <p className="text-sm text-hotel-neutral mt-2">
              Для позднего выезда, пожалуйста, свяжитесь с нами через чат.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Удобства номера</h2>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Wind className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Кондиционер</span>
            </div>
            <Textarea
              value={amenityInstructions.airConditioner}
              onChange={(e) => handleInstructionChange('airConditioner', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Инструкция по использованию кондиционера..."
            />
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Coffee className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Кофемашина</span>
            </div>
            <Textarea
              value={amenityInstructions.coffeeMachine}
              onChange={(e) => handleInstructionChange('coffeeMachine', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Инструкция по использованию кофемашины..."
            />
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Tv className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Смарт ТВ</span>
            </div>
            <Textarea
              value={amenityInstructions.smartTV}
              onChange={(e) => handleInstructionChange('smartTV', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Инструкция по использованию телевизора..."
            />
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <CreditCard className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Сейф</span>
            </div>
            <Textarea
              value={amenityInstructions.safe}
              onChange={(e) => handleInstructionChange('safe', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Инструкция по использованию сейфа..."
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm mt-4">
        <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
          <Info size={20} className="text-hotel-dark" />
          Дополнительно
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center mb-2">
              <Car className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Парковка</span>
            </div>
            <Textarea
              value={additionalInfo.parking}
              onChange={(e) => handleAdditionalInfoChange('parking', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Информация о парковке..."
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Clock className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Дополнительная кровать</span>
            </div>
            <Textarea
              value={additionalInfo.extraBed}
              onChange={(e) => handleAdditionalInfoChange('extraBed', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Информация о дополнительных кроватях..."
            />
          </div>

          <div>
            <div className="flex items-center mb-2">
              <Info className="mr-2 text-hotel-dark" size={20} />
              <span className="text-hotel-neutral">Домашние животные</span>
            </div>
            <Textarea
              value={additionalInfo.pets}
              onChange={(e) => handleAdditionalInfoChange('pets', e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Информация о размещении с животными..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
