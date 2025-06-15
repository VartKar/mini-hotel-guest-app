
import React, { useState } from "react";
import { Bed, UtensilsCrossed, Shirt, Award, ShoppingBag, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRoomData } from "@/hooks/useRoomData";

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
}

const services: ServiceItem[] = [
  {
    title: "Уборка номера",
    description: "Заказать дополнительную уборку номера или замену полотенец.",
    icon: <Bed size={24} />,
    buttonText: "Заказать"
  }, 
  {
    title: "Еда в номер",
    description: "Широкий выбор блюд и напитков с доставкой в ваш номер.",
    icon: <UtensilsCrossed size={24} />,
    buttonText: "Посмотреть меню"
  }, 
  {
    title: "Услуги прачечной",
    description: "Стирка и глажка вашей одежды в течение дня.",
    icon: <Shirt size={24} />,
    buttonText: "Заказать"
  }, 
  {
    title: "Специальные предложения",
    description: "Скидка 10% на спа-услуги по средам.",
    icon: <Award size={24} />,
    buttonText: "Подробнее"
  }
];

const ServicesPage = () => {
  const { roomData } = useRoomData();
  const [basketItems, setBasketItems] = useState<ServiceItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    roomNumber: "",
    phone: ""
  });

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

  const addToBasket = (service: ServiceItem) => {
    if (!basketItems.some(item => item.title === service.title)) {
      setBasketItems([...basketItems, service]);
      toast(`"${service.title}" добавлен в корзину`);
    } else {
      toast(`"${service.title}" уже добавлен в корзину`);
    }
  };

  const removeFromBasket = (serviceTitle: string) => {
    setBasketItems(basketItems.filter(item => item.title !== serviceTitle));
    toast(`"${serviceTitle}" удален из корзины`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmitOrder = async () => {
    if (!contactInfo.name || !contactInfo.roomNumber || !contactInfo.phone) {
      toast.error("Пожалуйста, заполните все поля контактной информации");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: contactInfo.name,
        customerPhone: contactInfo.phone,
        roomNumber: contactInfo.roomNumber,
        services: basketItems.map(item => ({
          title: item.title,
          description: item.description,
          buttonText: item.buttonText
        })),
        bookingIdKey: roomData?.id_key || null
      };

      console.log('Submitting service order:', orderData);

      const { data, error } = await supabase.functions.invoke('submit-service-order', {
        body: orderData
      });

      if (error) {
        console.error('Service order submission error:', error);
        throw error;
      }

      console.log('Service order submitted successfully:', data);
      
      toast.success("Ваш заказ успешно отправлен!");
      setBasketItems([]);
      setIsDrawerOpen(false);
      setContactInfo({ name: "", roomNumber: "", phone: "" });
      
    } catch (error) {
      console.error('Error submitting service order:', error);
      toast.error("Ошибка при отправке заказа. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light">Сервисы в номере</h1>
        
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
      
      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {service.icon}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-medium">{service.title}</h2>
                <p className="text-hotel-neutral">{service.description}</p>
              </div>
            </div>
            <button 
              className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium"
              onClick={() => addToBasket(service)}
            >
              {service.buttonText}
            </button>
          </div>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Ваш заказ</DrawerTitle>
          </DrawerHeader>
          
          <div className="space-y-4 py-4">
            {basketItems.length === 0 ? (
              <p className="text-center text-hotel-neutral">Ваша корзина пуста</p>
            ) : (
              <>
                {basketItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-hotel-accent rounded-full flex items-center justify-center">
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromBasket(item.title)}>
                      <X size={18} />
                    </Button>
                  </div>
                ))}

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
                {isSubmitting ? (
                  <>Отправка...</>
                ) : (
                  <>
                    <Check className="mr-2" size={18} />
                    Отправить заказ
                  </>
                )}
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

export default ServicesPage;
