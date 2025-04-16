
import React, { useState } from "react";
import { Gift, Coffee, Apple, ShoppingBag, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

interface ShopItem {
  name: string;
  price: string;
  category?: string;
}

interface Category {
  name: string;
  icon: React.ReactNode;
  items: ShopItem[];
}

const categories: Category[] = [
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
  const [basketItems, setBasketItems] = useState<ShopItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    roomNumber: "",
    phone: ""
  });

  const addToBasket = (item: ShopItem, categoryName: string) => {
    const itemWithCategory = { ...item, category: categoryName };
    setBasketItems([...basketItems, itemWithCategory]);
    toast(`"${item.name}" добавлен в корзину`);
  };

  const removeFromBasket = (itemName: string) => {
    setBasketItems(basketItems.filter(item => item.name !== itemName));
    toast(`"${itemName}" удален из корзины`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmitOrder = () => {
    if (!contactInfo.name || !contactInfo.roomNumber || !contactInfo.phone) {
      toast.error("Пожалуйста, заполните все поля контактной информации");
      return;
    }

    // Here we would send the order to a backend system
    console.log("Submitted order:", { items: basketItems, contact: contactInfo });
    
    toast.success("Ваш заказ успешно отправлен!");
    setBasketItems([]);
    setIsDrawerOpen(false);
    setContactInfo({ name: "", roomNumber: "", phone: "" });
  };

  // Calculate total price
  const totalPrice = basketItems.reduce((total, item) => {
    const priceNumber = parseInt(item.price.replace(/\D/g, ''));
    return total + priceNumber;
  }, 0);

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light">Магазин</h1>
        
        {basketItems.length > 0 && (
          <Button 
            variant="outline" 
            className="relative"
            onClick={() => setIsDrawerOpen(true)}
          >
            <ShoppingBag size={24} />
            <Badge className="absolute -top-2 -right-2 bg-hotel-accent text-hotel-dark">
              {basketItems.length}
            </Badge>
          </Button>
        )}
      </div>
      
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
        <div className="w-full h-full flex items-center justify-center bg-black/30 rounded-lg">
          <h2 className="text-white text-xl font-medium">Сувенирный киоск отеля</h2>
        </div>
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
                    <button 
                      className="w-8 h-8 rounded-full bg-hotel-dark flex items-center justify-center text-white"
                      onClick={() => addToBasket(item, category.name)}
                    >
                      <Plus size={16} />
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

      {/* Checkout Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Ваша корзина</DrawerTitle>
          </DrawerHeader>
          
          <div className="space-y-4 py-4">
            {basketItems.length === 0 ? (
              <p className="text-center text-hotel-neutral">Ваша корзина пуста</p>
            ) : (
              <>
                {basketItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="block">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.category}</span>
                      <span className="block font-medium">{item.price}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromBasket(item.name)}>
                      <X size={18} />
                    </Button>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-medium">
                    <span>Итого:</span>
                    <span>{totalPrice}₽</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <h3 className="font-medium">Контактная информация</h3>
                  <input
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={handleInputChange}
                    placeholder="Ваше имя"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="roomNumber"
                    value={contactInfo.roomNumber}
                    onChange={handleInputChange}
                    placeholder="Номер комнаты"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Контактный телефон"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </>
            )}
          </div>

          <DrawerFooter>
            {basketItems.length > 0 && (
              <Button onClick={handleSubmitOrder} className="w-full">
                <Check className="mr-2" size={18} />
                Оформить заказ
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Закрыть
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ShopPage;
