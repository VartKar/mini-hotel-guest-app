
import React from "react";
import { Wifi, Clock, Coffee, Wind, Tv, CreditCard, Car, Info, Bed } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRoomData, RoomData } from "../hooks/useRoomData";

const RoomPage = () => {
  const { data, isLoading, error } = useRoomData();

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto pt-10 text-center">
        <div className="animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <p className="text-gray-500 mt-4">Загрузка данных номера...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto pt-10 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 font-medium">Ошибка загрузки данных</p>
          <p className="text-red-500 text-sm mt-2">
            Не удалось загрузить информацию о номере. Попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full max-w-md mx-auto pt-10 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-600 font-medium">Данные не найдены</p>
          <p className="text-yellow-600 text-sm mt-2">
            Информация о номере пока не добавлена в систему.
          </p>
        </div>
      </div>
    );
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

      {image && (
        <div 
          className="w-full h-48 mb-6 rounded-lg bg-cover bg-center bg-gray-200"
          style={{ backgroundImage: `url('${image}')` }}
        />
      )}

      {stay_duration && (
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
      )}

      {(wifi_network || wifi_password) && (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
          <div className="flex items-start mb-2">
            <Wifi className="mr-3 text-hotel-dark flex-shrink-0 mt-1" size={24} />
            <div className="w-full">
              <h2 className="text-xl font-medium mb-2">Wi-Fi</h2>
              {wifi_network && (
                <div className="mb-2">
                  <p className="text-hotel-neutral mb-1">Сеть:</p>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100 select-text">
                    {wifi_network}
                  </div>
                </div>
              )}
              {wifi_password && (
                <div>
                  <p className="text-hotel-neutral mb-1">Пароль:</p>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100 select-text">
                    {wifi_password}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {checkout_time && (
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
      )}

      {(air_conditioner || coffee_machine || smart_tv || safe) && (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
          <h2 className="text-xl font-medium mb-4">Удобства номера</h2>
          <div className="flex flex-col gap-4">
            {air_conditioner && (
              <div>
                <div className="flex items-center mb-2">
                  <Wind className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Кондиционер</span>
                </div>
                <Textarea
                  value={air_conditioner}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Инструкция по использованию кондиционера..."
                />
              </div>
            )}
            {coffee_machine && (
              <div>
                <div className="flex items-center mb-2">
                  <Coffee className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Кофемашина</span>
                </div>
                <Textarea
                  value={coffee_machine}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Инструкция по использованию кофемашины..."
                />
              </div>
            )}
            {smart_tv && (
              <div>
                <div className="flex items-center mb-2">
                  <Tv className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Смарт ТВ</span>
                </div>
                <Textarea
                  value={smart_tv}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Инструкция по использованию телевизора..."
                />
              </div>
            )}
            {safe && (
              <div>
                <div className="flex items-center mb-2">
                  <CreditCard className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Сейф</span>
                </div>
                <Textarea
                  value={safe}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Инструкция по использованию сейфа..."
                />
              </div>
            )}
          </div>
        </div>
      )}

      {(parking || extra_bed || pets) && (
        <div className="bg-white rounded-lg p-6 shadow-sm mt-4">
          <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
            <Info size={20} className="text-hotel-dark" />
            Дополнительно
          </h2>
          <div className="flex flex-col gap-4">
            {parking && (
              <div>
                <div className="flex items-center mb-2">
                  <Car className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Парковка</span>
                </div>
                <Textarea
                  value={parking}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Информация о парковке..."
                />
              </div>
            )}
            {extra_bed && (
              <div>
                <div className="flex items-center mb-2">
                  <Bed className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Дополнительная кровать</span>
                </div>
                <Textarea
                  value={extra_bed}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Информация о дополнительных кроватях..."
                />
              </div>
            )}
            {pets && (
              <div>
                <div className="flex items-center mb-2">
                  <Info className="mr-2 text-hotel-dark" size={20} />
                  <span className="text-hotel-neutral">Домашние животные</span>
                </div>
                <Textarea
                  value={pets}
                  readOnly
                  className="min-h-[60px] text-sm"
                  placeholder="Информация о размещении с животными..."
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
