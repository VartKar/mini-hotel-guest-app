
import React, { useState } from "react";
import { Bed, UtensilsCrossed, Shirt, Award, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRoomData } from "@/hooks/useRoomData";

interface ServiceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  details?: string; // Additional details for some services
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
    buttonText: "Заказать",
    details: `
**МЕНЮ ДОСТАВКИ В НОМЕР**

**Завтраки (8:00-11:00)**
• Континентальный завтрак - 850₽
• Омлет с беконом - 450₽
• Блинчики с медом - 380₽
• Каша овсяная - 250₽

**Обеды и ужины (12:00-22:00)**
• Борщ украинский - 320₽
• Стейк из говядины - 1200₽
• Паста карбонара - 680₽
• Салат Цезарь - 520₽

**Напитки**
• Кофе американо - 180₽
• Чай травяной - 150₽
• Сок апельсиновый - 220₽
• Вода минеральная - 120₽

**Десерты**
• Тирамису - 420₽
• Мороженое - 280₽
• Фруктовая тарелка - 350₽

*Доставка в номер бесплатно при заказе от 500₽*
    `
  }, 
  {
    title: "Услуги прачечной",
    description: "Стирка и глажка вашей одежды в течение дня.",
    icon: <Shirt size={24} />,
    buttonText: "Заказать"
  }, 
  {
    title: "Спа-услуги",
    description: "Расслабляющие процедуры и массаж в номере или спа-центре.",
    icon: <Award size={24} />,
    buttonText: "Заказать",
    details: `
**СПА-УСЛУГИ**

**Массаж**
• Классический массаж (60 мин) - 2500₽
• Расслабляющий массаж (90 мин) - 3200₽
• Массаж стоп (30 мин) - 1200₽
• Антицеллюлитный массаж (60 мин) - 2800₽

**Процедуры для лица**
• Очищающая маска - 1500₽
• Увлажняющая процедура - 1800₽
• Антивозрастной уход - 2200₽

**Процедуры для тела**
• Скраб для тела - 1600₽
• Обертывание водорослями - 2000₽
• Ароматерапия - 1400₽

**Специальные предложения**
• Скидка 10% по средам на все услуги
• Парный массаж - скидка 15%
• Комплекс "Релакс" (3 процедуры) - 5500₽

*Процедуры доступны в спа-центре или в номере по запросу*
    `
  }
];

const ServicesPage = () => {
  const { roomData } = useRoomData();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [expandedServices, setExpandedServices] = useState<number[]>([]);

  const toggleServiceDetails = (index: number) => {
    setExpandedServices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleServiceClick = (service: ServiceItem) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };

  const handleSubmitOrder = async () => {
    if (!selectedService) {
      toast.error("Услуга не выбрана");
      return;
    }

    if (!roomData?.guest_name || !roomData?.room_number || !roomData?.host_phone) {
      toast.error("Данные гостя не найдены");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: roomData.guest_name,
        customerPhone: roomData.host_phone,
        roomNumber: roomData.room_number,
        customerComment: comment,
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
      setComment("");
      
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
                
                {service.details && (
                  <Collapsible 
                    open={expandedServices.includes(index)} 
                    onOpenChange={() => toggleServiceDetails(index)}
                  >
                    <CollapsibleTrigger className="flex items-center gap-2 mt-3 text-sm text-hotel-dark hover:text-hotel-accent">
                      {expandedServices.includes(index) ? (
                        <>
                          <ChevronUp size={16} />
                          Скрыть подробности
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          Показать подробности
                        </>
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-700 whitespace-pre-line">
                          {service.details}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </div>
            <button 
              className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium"
              onClick={() => handleServiceClick(service)}
            >
              Заказать
            </button>
          </div>
        ))}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Подтверждение заказа</DrawerTitle>
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
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий (необязательно)"
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
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
                  Подтвердить заказ
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
