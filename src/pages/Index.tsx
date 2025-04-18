
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, User, Wifi } from "lucide-react";

const menuItems = [{
  name: "Мой номер",
  icon: <Home size={32} />,
  path: "/room"
}, {
  name: "Путешествие",
  icon: <Map size={32} />,
  path: "/travel"
}, {
  name: "Сервисы",
  icon: <Coffee size={32} />,
  path: "/services"
}, {
  name: "Магазин",
  icon: <ShoppingBag size={32} />,
  path: "/shop"
}, {
  name: "Чат с консьержем",
  icon: <MessageCircle size={32} />,
  path: "/chat"
}, {
  name: "Личный кабинет",
  icon: <User size={32} />,
  path: "/feedback"
}];

const Index = () => {
  const [guestName, setGuestName] = useState("Иван");
  const [hotelName, setHotelName] = useState("Отель \"Морская Звезда\"");

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="py-8">
          <h1 className="font-light mb-3 text-center text-2xl">
            <span>Добро пожаловать, </span>
            <span 
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setGuestName(e.currentTarget.innerText)}
              className="border-b border-dashed border-gray-300 focus:outline-none focus:border-hotel-dark px-1"
            >
              {guestName}
            </span>
          </h1>
          <p 
            className="text-xl text-hotel-neutral text-center"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setHotelName(e.currentTarget.innerText)}
          >
            {hotelName}
          </p>
        </div>

        <div className="w-full h-48 mb-8 rounded-lg bg-cover bg-center" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')"
        }}>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map(item => (
            <Link 
              key={item.name} 
              to={item.path} 
              className="flex flex-col items-center justify-center bg-white rounded-lg p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="text-hotel-dark mb-3">{item.icon}</div>
              <span className="text-center font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
