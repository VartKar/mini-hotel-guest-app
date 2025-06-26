
import React, { useState } from "react";
import { Bed, UtensilsCrossed, Shirt, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
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
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
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

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
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

    if (!selectedService) {
      toast.error("Услуга не выбрана");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: contactInfo.name,
        customerPhone: contactInfo.phone,
        roomNumber: contactInfo.roomNumber,
        services: [{
          title: selectedService.title,
          description: selectedService.description,
          buttonText: selectedService.buttonText
        }],
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
      setIsDrawerOpen(false);
      setSelectedService(null);
      
    } catch (error) {
      console.error('Error submitting service order:', error);
      toast.error("Ошибка при отправке заказа. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Сервисы в номере</h1>
      
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
              onClick={() => handleServiceClick(service)}
            >
              {service.buttonText}
            </button>
          </div>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Заказ услуги</DrawerTitle>
          </DrawerHeader>
          
          <div className="space-y-4 py-4">
            {selectedService && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-hotel-accent rounded-full flex items-center justify-center">
                    {selectedService.icon}
                  </div>
                  <span className="font-medium">{selectedService.title}</span>
                </div>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
            )}

            <div className="space-y-3">
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
          </div>

          <DrawerFooter>
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
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Отмена
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ServicesPage;
