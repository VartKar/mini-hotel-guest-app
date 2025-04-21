
import React from "react";
import { Wifi, Clock, Coffee, Wind, Tv, CreditCard, Car, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRoomData, RoomData } from "../hooks/useRoomData";

const RoomPage = () => {
  const { data, isLoading, error } = useRoomData();

  if (isLoading) {
    return <div className="w-full max-w-md mx-auto pt-10 text-gray-500 text-center">Загрузка...</div>;
  }

  if (error || !data) {
    return <div className="w-full max-w-md mx-auto pt-10 text-red-500 text-center">Ошибка загрузки данных комнаты.</div>;
  }

  // Map table fields to variables for UI
  const room: RoomData = data;
  const {
    image,
    stay_duration,
    wifi_network,
    wifi_password,
    checkout_time,
    air_conditioner,
    coffee_machine,
    smart_tv,
    safe,
    parking,
    extra_bed,
    pets,
  } = room;

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Мой номер</h1>

      <div 
        className="w-full h-48 mb-6 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />

      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-start mb-2">
          <Clock className="mr-3 text-hotel-dark flex-shrink-0 mt-1" size={24} />
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-medium">Длительность проживания</h2>
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-100 select-text">
              {stay_duration}
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
              <div className="p-2 bg-gray-50 rounded border border-gray-100 select-text">
                {wifi_network}
              </div>
            </div>
            <div>
              <p className="text-hotel-neutral mb-1">Пароль:</p>
              <div className="p-2 bg-gray-50 rounded border border-gray-100 select-text">
                {wifi_password}
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
            <div className="p-2 bg-gray-50 rounded border border-gray-100 select-text">
              {checkout_time}
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
              value={air_conditioner || ""}
              readOnly
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
              value={coffee_machine || ""}
              readOnly
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
              value={smart_tv || ""}
              readOnly
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
              value={safe || ""}
              readOnly
              className="min-h-[60px] text-sm"
              placeholder="Инструкция по использованию сейфа..."
            />
          </div>
        </div>
      </div>

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
              value={parking || ""}
              readOnly
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
              value={extra_bed || ""}
              readOnly
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
              value={pets || ""}
              readOnly
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
