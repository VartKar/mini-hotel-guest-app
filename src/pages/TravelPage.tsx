
import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Sun, Compass, Check, PlusCircle, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { toast } from "@/components/ui/sonner";
import { useRoomData } from "@/hooks/useRoomData";
import { useTravelItinerary } from "@/hooks/useTravelItinerary";
import { useTravelServices, TravelServiceWithPrice } from "@/hooks/useTravelServices";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

// Icon mapping for different activity types
const getIconForType = (iconType: string | null) => {
  switch (iconType) {
    case 'Compass':
      return <Compass />;
    case 'Sun':
      return <Sun />;
    case 'MapPin':
    default:
      return <MapPin />;
  }
};

const TravelPage = () => {
  const { roomData } = useRoomData();
  
  const { itineraries, numberOfDays, updateItinerary, isLoading } = useTravelItinerary(
    roomData?.id_key || null,
    roomData?.check_in_date,
    roomData?.check_out_date,
    roomData?.city || undefined
  );

  const city = roomData?.city || 'Сочи';
  const propertyId = roomData?.property_id;
  
  // Fetch available travel services
  const { data: travelServices, isLoading: servicesLoading } = useTravelServices(city, propertyId);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activitiesCount = itineraries.length;

  const getDayLabel = (count: number) => {
    if (count === 1) return 'день';
    if (count > 1 && count < 5) return 'дня';
    return 'дней';
  }

  const getActivityLabel = (count: number) => {
    if (count === 1) return 'мероприятие';
    if (count > 1 && count < 5) return 'мероприятия';
    return 'мероприятий';
  }

  // Handle itinerary content edit
  const handleItineraryEdit = (id: string, field: string, value: string | number) => {
    updateItinerary({ id, updates: { [field]: value } });
  };

  // Handle service click - open order drawer
  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };

  // Handle submission of selected service
  const handleSubmitOrder = async () => {
    if (!selectedService) {
      toast.error("Услуга не выбрана");
      return;
    }
    
    if (!roomData?.guest_name || !roomData?.host_phone) {
      toast.error("Данные гостя не найдены");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const service = {
        title: 'service_title' in selectedService ? selectedService.service_title : selectedService.title,
        price: `${'service_price' in selectedService ? selectedService.service_price : selectedService.final_price} ₽`,
        category: selectedService.category || 'Общее'
      };
      
      const totalPrice = 'service_price' in selectedService ? selectedService.service_price : selectedService.final_price;
      
      const orderData = {
        customerName: roomData.guest_name,
        customerPhone: roomData.host_phone,
        customerComment: comment,
        services: [service],
        totalPrice,
        bookingIdKey: roomData?.id_key || null
      };

      const { data, error } = await supabase.functions.invoke('submit-travel-order', {
        body: orderData
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success("Ваш заказ успешно отправлен!");
        setIsDrawerOpen(false);
        setSelectedService(null);
        setComment("");
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Ошибка при отправке заказа. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || servicesLoading) {
    return (
      <div className="w-full max-w-md mx-auto pt-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hotel-dark mx-auto mb-4"></div>
          <p className="text-hotel-neutral">Загрузка программы путешествия...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">План поездки в г. {city}</h1>
      
      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Мы составили для вас набор рекомендаций по активностям во время вашего путешествия, основываясь на нашем прекрасном знании города и любви к нему.
        </p>
      </div>
      
      {/* Banner */}
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')"
      }}>
        <div className="w-full h-full flex items-center justify-center bg-black/30 rounded-lg">
          <h2 className="text-white text-xl font-medium">Ваше путешествие</h2>
        </div>
      </div>
      
      {/* Travel plan with activities from templates */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-4">
          <Calendar className="mr-3 text-hotel-dark" size={24} />
          <h2 className="text-xl font-medium">
            План поездки ({numberOfDays} {getDayLabel(numberOfDays)}, {activitiesCount} {getActivityLabel(activitiesCount)})
          </h2>
        </div>
        
        <div className="space-y-6">
          {itineraries.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex flex-col">
              <div className="flex">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                  {getIconForType(item.icon_type)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <div className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
                      contentEditable 
                      suppressContentEditableWarning 
                      onBlur={e => handleItineraryEdit(item.id, 'activity_title', e.currentTarget.innerText)}
                    >
                      {item.activity_title}
                    </div>
                  </div>
                  <div className="text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none" 
                    contentEditable 
                    suppressContentEditableWarning 
                    onBlur={e => handleItineraryEdit(item.id, 'activity_description', e.currentTarget.innerText)}
                  >
                    {item.activity_description}
                  </div>
                </div>
              </div>
              
              {item.service_title && item.is_service_available && (
                <div className="ml-14 mt-2">
                  <div className="border rounded-lg p-3 mt-2 border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
                          contentEditable 
                          suppressContentEditableWarning 
                          onBlur={e => handleItineraryEdit(item.id, 'service_title', e.currentTarget.innerText)}
                        >
                          {item.service_title}
                        </div>
                        <div className="text-sm text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none" 
                          contentEditable 
                          suppressContentEditableWarning 
                          onBlur={e => handleItineraryEdit(item.id, 'service_description', e.currentTarget.innerText)}
                        >
                          {item.service_description}
                        </div>
                        <div className="text-sm font-medium text-hotel-dark mt-1 p-1 rounded focus:bg-gray-50 focus:outline-none" 
                          contentEditable 
                          suppressContentEditableWarning 
                          onBlur={e => handleItineraryEdit(item.id, 'service_price', parseFloat(e.currentTarget.innerText.replace(/\D/g, '')) || 0)}
                        >
                          {item.service_price} ₽
                        </div>
                      </div>
                      <button 
                        onClick={() => handleServiceClick(item)} 
                        className="ml-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-hotel-dark text-white"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Travel Services Section */}
        {travelServices && travelServices.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Sun className="mr-2" size={20} />
              Дополнительные услуги
            </h3>
            <div className="space-y-3">
              {travelServices.map((service) => (
                <div key={service.id} className="border rounded-lg p-3 border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{service.title}</div>
                      <div className="text-sm text-hotel-neutral">{service.description}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {service.category && <span className="mr-3">Категория: {service.category}</span>}
                        {service.duration_hours && <span className="mr-3">Длительность: {service.duration_hours}ч</span>}
                        {service.difficulty_level && <span>Сложность: {service.difficulty_level}</span>}
                      </div>
                      <div className="text-sm font-medium text-hotel-dark mt-1">
                        {service.final_price} ₽
                      </div>
                    </div>
                    <button 
                      onClick={() => handleServiceClick(service)} 
                      className="ml-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-hotel-dark text-white"
                      disabled={!service.is_available}
                    >
                      <PlusCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {itineraries.length === 0 && (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Программа путешествия создается на основе шаблонов для города {city}</p>
          </div>
        )}
      </div>
      
      {/* Travel Expert Chat */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <TravelExpertChat />
      </div>
      
      {/* Order Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Подтверждение заказа</DrawerTitle>
          </DrawerHeader>
          
          <div className="space-y-4 py-4">
            {selectedService && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="block font-medium">
                      {'service_title' in selectedService ? selectedService.service_title : selectedService.title}
                    </span>
                    {selectedService.category && (
                      <span className="text-sm text-gray-500">{selectedService.category}</span>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {'service_description' in selectedService ? selectedService.service_description : selectedService.description}
                    </p>
                  </div>
                  <span className="font-medium text-lg">
                    {'service_price' in selectedService ? selectedService.service_price : selectedService.final_price}₽
                  </span>
                </div>
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
              <Check className="mr-2" size={18} />
              {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
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

const TravelExpertChat = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center">
        <h3 className="text-sm font-medium flex items-center justify-center space-x-2">
          <Bot size={18} />
          <span>AI эксперт по путешествиям</span>
        </h3>
      </div>
      
      {/* Chat iframe */}
      <div className="flex-1 relative">
        <iframe
          src="https://rubikinn.ru/webhook/de012477-bbe8-44fc-8b10-4ecadf13cd66/chat"
          className="w-full h-full border-0"
          title="Виртуальный эксперт по путешествиям"
          allow="microphone; camera"
          style={{
            minHeight: '400px'
          }}
        />
        
        {/* Loading state overlay */}
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-500 pointer-events-none opacity-0 transition-opacity duration-300" id="chat-loading">
          <div className="text-center">
            <Bot size={32} className="mx-auto mb-2 text-blue-500" />
            <p className="text-sm">Загрузка чата...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPage;
