
import React from "react";
import { Link } from "react-router-dom";
import { Home, Map, Coffee, ShoppingBag, MessageCircle, Star, Wifi } from "lucide-react";

const menuItems = [
  { name: "Мой номер", icon: <Home size={32} />, path: "/room" },
  { name: "Путешествие", icon: <Map size={32} />, path: "/travel" },
  { name: "Сервисы", icon: <Coffee size={32} />, path: "/services" },
  { name: "Магазин", icon: <ShoppingBag size={32} />, path: "/shop" },
  { name: "Чат с консьержем", icon: <MessageCircle size={32} />, path: "/chat" },
  { name: "Обратная связь", icon: <Star size={32} />, path: "/feedback" },
];

const Index = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="py-8">
          <h1 className="text-4xl font-light mb-3 text-center">Добро пожаловать</h1>
          <p className="text-xl text-hotel-neutral text-center">Отель "Морская Звезда"</p>
        </div>

        <div className="w-full h-48 mb-8 rounded-lg bg-cover bg-center" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
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
