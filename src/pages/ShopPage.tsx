
import React, { useState } from "react";
import { Gift, Coffee, Apple, ShoppingBag, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRoomData } from "@/hooks/useRoomData";
import { useShopItems, ShopItemWithPrice } from "@/hooks/useShopItems";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Сувениры':
      return <Gift size={24} />;
    case 'Мини-бар':
      return <Coffee size={24} />;
    case 'Локальные продукты':
      return <Apple size={24} />;
    default:
      return <Gift size={24} />;
  }
};

const ShopPage = () => {
  const { roomData } = useRoomData();
  const city = roomData?.city || 'Сочи';
  const propertyId = roomData?.property_id;
  
  const { data: shopItems, isLoading } = useShopItems(city, propertyId);
  
  const [basketItems, setBasketItems] = useState<ShopItemWithPrice[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    roomNumber: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill with room data if available
  React.useEffect(() => {
    if (roomData) {
      setContactInfo(prev => ({
        ...prev,
        name: roomData.guest_name || prev.name,
        roomNumber: roomData.room_number || prev.roomNumber,
      }));
    }
  }, [roomData]);

  const addToBasket = (item: ShopItemWithPrice) => {
    if (!basketItems.some(basketItem => basketItem.id === item.id)) {
      setBasketItems([...basketItems, item]);
      toast(`"${item.name}" добавлен в корзину`);
    } else {
      toast(`"${item.name}" уже добавлен в корзину`);
    }
  };

  const removeFromBasket = (itemId: string) => {
    const item = basketItems.find(i => i.id === itemId);
    setBasketItems(basketItems.filter(i => i.id !== itemId));
    if (item) {
      toast(`"${item.name}" удален из корзины`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmitOrder = async () => {
    if (!contactInfo.name || !contactInfo.phone) {
      toast.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (basketItems.length === 0) {
      toast.error("Ваша корзина пуста");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: contactInfo.name,
        customerPhone: contactInfo.phone,
        roomNumber: contactInfo.roomNumber,
        items: basketItems.map(item => ({
          name: item.name,
          price: `${item.final_price}₽`,
          category: item.category
        })),
        totalPrice: totalPrice,
        bookingIdKey: roomData?.id_key || null
      };

      const { data, error } = await supabase.functions.invoke('submit-shop-order', {
        body: orderData
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success("Ваш заказ успешно отправлен!");
        setBasketItems([]);
        setIsDrawerOpen(false);
        setContactInfo({ name: "", roomNumber: "", phone: "" });
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Ошибка при отправке заказа. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total price
  const totalPrice = basketItems.reduce((total, item) => {
    return total + item.final_price;
  }, 0);

  // Group items by category
  const itemsByCategory = shopItems ? shopItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShopItemWithPrice[]>) : {};

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto pt-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hotel-dark mx-auto mb-4"></div>
          <p className="text-hotel-neutral">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

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
        {Object.entries(itemsByCategory).map(([categoryName, items]) => (
          <div key={categoryName} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {getCategoryIcon(categoryName)}
              </div>
              <h2 className="ml-3 text-xl font-medium">{categoryName}</h2>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-hotel-neutral">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-gray-500">{item.description}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 font-medium">{item.final_price}₽</span>
                    <button 
                      className="w-8 h-8 rounded-full bg-hotel-dark flex items-center justify-center text-white disabled:bg-gray-300"
                      onClick={() => addToBasket(item)}
                      disabled={!item.is_available}
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
                {basketItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="block">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.category}</span>
                      <span className="block font-medium">{item.final_price}₽</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromBasket(item.id)}>
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
              <Button 
                onClick={handleSubmitOrder} 
                className="w-full"
                disabled={isSubmitting}
              >
                <Check className="mr-2" size={18} />
                {isSubmitting ? 'Отправка...' : 'Оформить заказ'}
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
