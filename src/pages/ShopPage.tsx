
import React from "react";
import { Gift, Coffee, Apple, ShoppingBag } from "lucide-react";

const categories = [
  {
    name: "Сувениры",
    icon: <Gift size={24} />,
    items: [
      { name: "Магнит 'Морская Звезда'", price: "250₽" },
      { name: "Футболка с логотипом", price: "1200₽" },
      { name: "Пляжная сумка", price: "850₽" }
    ]
  },
  {
    name: "Мини-бар",
    icon: <Coffee size={24} />,
    items: [
      { name: "Вода (негазированная)", price: "120₽" },
      { name: "Ассорти орехов", price: "280₽" },
      { name: "Шоколад", price: "200₽" }
    ]
  },
  {
    name: "Локальные продукты",
    icon: <Apple size={24} />,
    items: [
      { name: "Домашнее варенье", price: "350₽" },
      { name: "Местный сыр", price: "450₽" },
      { name: "Вино из местных сортов", price: "1500₽" }
    ]
  }
];

const ShopPage = () => {
  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Магазин</h1>
      
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
      </div>
      
      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {category.icon}
              </div>
              <h2 className="ml-3 text-xl font-medium">{category.name}</h2>
            </div>
            
            <div className="space-y-3">
              {category.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <p className="text-hotel-neutral">{item.name}</p>
                  <div className="flex items-center">
                    <span className="mr-3 font-medium">{item.price}</span>
                    <button className="w-8 h-8 rounded-full bg-hotel-dark flex items-center justify-center text-white">
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center text-sm text-hotel-neutral">
        Для заказа товаров обратитесь к консьержу или на ресепшн.
      </div>
    </div>
  );
};

export default ShopPage;
