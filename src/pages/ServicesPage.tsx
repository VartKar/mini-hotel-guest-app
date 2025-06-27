
import React, { useState } from "react";
import { Bed, UtensilsCrossed, Shirt, Award, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRoomData } from "@/hooks/useRoomData";
import { useHotelServices, HotelServiceWithPrice } from "@/hooks/useHotelServices";

// Icon mapping for services
const getIconForService = (iconType: string) => {
  switch (iconType) {
    case 'Bed':
      return <Bed size={24} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed size={24} />;
    case 'Shirt':
      return <Shirt size={24} />;
    case 'Award':
      return <Award size={24} />;
    default:
      return <Bed size={24} />;
  }
};

const ServicesPage = () => {
  const { roomData } = useRoomData();
  const city = roomData?.city || 'Сочи';
  const propertyId = roomData?.property_id;
  
  const { data: hotelServices, isLoading } = useHotelServices(city, propertyId);
  
  const [selectedService, setSelectedService] = useState<HotelServiceWithPrice | null>(null);
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

  const handleServiceClick = (service: HotelServiceWithPrice) => {
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
          buttonText: "Заказать"
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

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto pt-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hotel-dark mx-auto mb-4"></div>
          <p className="text-hotel-neutral">Загрузка услуг...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Сервисы в номере</h1>
      
      <div className="space-y-4">
        {hotelServices?.map((service, index) => (
          <div key={service.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {getIconForService(service.icon_type)}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-medium">{service.title}</h2>
                <p className="text-hotel-neutral">{service.description}</p>
                
                {service.has_details && service.details_content && (
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
                          {service.details_content}
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
              disabled={!service.is_available}
            >
              {service.is_available ? 'Заказать' : 'Недоступно'}
            </button>
          </div>
        ))}

        {(!hotelServices || hotelServices.length === 0) && (
          <div className="text-center py-8">
            <Award size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Услуги загружаются...</p>
          </div>
        )}
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
                    {getIconForService(selectedService.icon_type)}
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
