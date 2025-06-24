
import React, { useState } from "react";
import { MapPin, Calendar, Sun, Compass, Check, X, PlusCircle, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useRoomData } from "@/hooks/useRoomData";
import { useTravelItinerary } from "@/hooks/useTravelItinerary";
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
    roomData?.check_out_date
  );

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const city = itineraries?.[0]?.city || 'Сочи';
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

  // Toggle service selection
  const toggleServiceSelection = (id: string) => {
    setSelectedServices(prev => {
      if (prev.includes(id)) {
        return prev.filter(serviceId => serviceId !== id);
      } else {
        return [...prev, id];
      }
    });
    
    const itinerary = itineraries.find(item => item.id === id);
    toast(selectedServices.includes(id) ? 
      "Услуга удалена из выбранных" : 
      "Услуга добавлена в выбранных", {
      description: itinerary?.service_title || ''
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedServices.reduce((total, id) => {
      const itinerary = itineraries.find(item => item.id === id);
      return total + (itinerary?.service_price || 0);
    }, 0);
  };

  // Handle submission of selected services
  const handleSubmitServices = async () => {
    if (selectedServices.length === 0) {
      toast("Нет выбранных услуг", {
        description: "Пожалуйста, выберите хотя бы одну услугу."
      });
      return;
    }
    
    if (!customerName || !customerPhone) {
      toast("Заполните обязательные поля", {
        description: "Имя и телефон обязательны для заказа услуг."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const selectedItineraries = itineraries.filter(item => selectedServices.includes(item.id));
      const services = selectedItineraries.map(item => ({
        day: `День ${item.day_number}`,
        title: item.service_title,
        price: `${item.service_price} ₽`
      }));
      
      const totalPrice = calculateTotal();
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('submit-travel-order', {
        body: {
          customerName,
          customerPhone,
          customerComment,
          services,
          totalPrice,
          bookingIdKey: roomData?.id_key || null
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast("Заказ успешно отправлен", {
          description: "Мы свяжемся с вами в ближайшее время для подтверждения заказа."
        });
        
        // Reset form
        setSelectedServices([]);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerComment("");
        setBasketOpen(false);
      } else {
        throw new Error(data.error || 'Failed to submit order');
      }
      
    } catch (error) {
      console.error("Error submitting order:", error);
      toast("Ошибка при отправке заказа", {
        description: "Пожалуйста, попробуйте позже."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
      <h1 className="text-3xl font-light mb-6">Путешествие в г. {city}</h1>
      
      {/* Banner with basket counter */}
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center relative" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')"
      }}>
        <div className="w-full h-full flex items-end justify-end p-4">
          {selectedServices.length > 0 && (
            <button 
              onClick={() => setBasketOpen(true)}
              className="bg-hotel-accent text-hotel-dark px-3 py-1 rounded-full text-xs flex items-center"
            >
              <ShoppingCart size={16} className="mr-1" />
              {selectedServices.length} {selectedServices.length === 1 ? 'услуга' : 
                (selectedServices.length >= 2 && selectedServices.length <= 4) ? 'услуги' : 'услуг'}
            </button>
          )}
        </div>
      </div>
      
      {/* Travel plan with activities from templates */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <Calendar className="mr-3 text-hotel-dark" size={24} />
            <h2 className="text-xl font-medium">
              План поездки ({numberOfDays} {numberOfDays === 1 ? 'день' : 
                numberOfDays > 1 && numberOfDays < 5 ? 'дня' : 'дней'}, {activitiesCount} {activitiesCount === 1 ? 'мероприятие' : 
                activitiesCount > 1 && activitiesCount < 5 ? 'мероприятия' : 'мероприятий'})
            </h2>
          </div>
          {selectedServices.length > 0 && (
            <div 
              onClick={() => setBasketOpen(true)}
              className="text-sm font-medium text-hotel-dark flex items-center cursor-pointer hover:text-hotel-accent transition-colors"
            >
              <ShoppingBasket size={18} className="mr-1" />
              Выбрано: {selectedServices.length}
            </div>
          )}
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
                      onBlur={e => handleItineraryEdit(item.id, 'day_number', parseInt(e.currentTarget.innerText.replace('День ', '')) || item.day_number)}
                    >
                      День {item.day_number}
                    </div>
                    <span className="mx-1">:</span>
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
                  <div className={`border rounded-lg p-3 mt-2 ${selectedServices.includes(item.id) ? 'border-hotel-accent bg-hotel-accent bg-opacity-10' : 'border-gray-200'}`}>
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
                        onClick={() => toggleServiceSelection(item.id)} 
                        className={`ml-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${selectedServices.includes(item.id) ? 'bg-hotel-accent text-hotel-dark' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {selectedServices.includes(item.id) ? <Check size={16} /> : <PlusCircle size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {itineraries.length === 0 && (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Программа путешествия создается на основе шаблонов для города {city}</p>
          </div>
        )}
      </div>
      
      {/* Checkout Drawer */}
      {basketOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium flex items-center">
                  <ShoppingBasket className="mr-2" size={24} />
                  Ваш заказ
                </h2>
                <button 
                  onClick={() => setBasketOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
              
              {selectedServices.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Ваша корзина пуста</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setBasketOpen(false)}
                  >
                    Выбрать услуги
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-gray-500">Выбранные услуги</h3>
                    {selectedServices.map(id => {
                      const item = itineraries.find(i => i.id === id);
                      if (!item) return null;
                      return (
                        <div key={`checkout-${id}`} className="flex justify-between items-center py-3 border-b">
                          <div>
                            <div className="font-medium">{item.service_title}</div>
                            <div className="text-sm text-gray-500">День {item.day_number}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="font-medium mr-3">{item.service_price} ₽</div>
                            <button 
                              onClick={() => toggleServiceSelection(id)} 
                              className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center pt-4 font-medium">
                      <div>Итого:</div>
                      <div className="text-lg">{calculateTotal().toLocaleString()} ₽</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3 text-gray-500">Информация для заказа</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Имя *</label>
                        <Input 
                          id="name" 
                          value={customerName} 
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Введите ваше имя"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Телефон *</label>
                        <Input 
                          id="phone" 
                          value={customerPhone} 
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="+7 (___) ___-__-__"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium mb-1">Комментарий</label>
                        <Textarea 
                          id="comment" 
                          value={customerComment} 
                          onChange={e => setCustomerComment(e.target.value)}
                          placeholder="Дополнительная информация к заказу"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setBasketOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button 
                      className="flex-1 bg-hotel-dark text-white"
                      onClick={handleSubmitServices}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPage;
