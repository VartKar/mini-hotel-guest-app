
import React from "react";
import { Wifi, Clock, Coffee, Wind, Tv, CreditCard } from "lucide-react";

const RoomPage = () => {
  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Мой номер</h1>
      
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-4">
          <Wifi className="mr-3 text-hotel-dark" size={24} />
          <div>
            <h2 className="text-xl font-medium">Wi-Fi</h2>
            <p className="text-hotel-neutral">Сеть: <span className="font-medium">GuestNetwork</span></p>
            <p className="text-hotel-neutral">Пароль: <span className="font-medium">SeaStar2025</span></p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-2">
          <Clock className="mr-3 text-hotel-dark" size={24} />
          <div>
            <h2 className="text-xl font-medium">Время выезда</h2>
            <p className="text-hotel-neutral">12:00</p>
          </div>
        </div>
        <p className="text-sm text-hotel-neutral mt-2">
          Для позднего выезда, пожалуйста, свяжитесь с нами через чат.
        </p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Удобства номера</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Wind className="mr-2 text-hotel-dark" size={20} />
            <span className="text-hotel-neutral">Кондиционер</span>
          </div>
          <div className="flex items-center">
            <Coffee className="mr-2 text-hotel-dark" size={20} />
            <span className="text-hotel-neutral">Кофемашина</span>
          </div>
          <div className="flex items-center">
            <Tv className="mr-2 text-hotel-dark" size={20} />
            <span className="text-hotel-neutral">Смарт ТВ</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="mr-2 text-hotel-dark" size={20} />
            <span className="text-hotel-neutral">Сейф</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
