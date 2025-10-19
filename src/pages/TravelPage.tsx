
import React, { useState, useEffect, useRef } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useTravelItinerary } from "@/hooks/useTravelItinerary";
import { useTravelServices } from "@/hooks/useTravelServices";
import { useCart, CartItem } from "@/hooks/useCart";
import { CartAuthPrompt } from "@/components/cart/CartAuthPrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Clock, Calendar, UtensilsCrossed, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface TravelCartItem extends CartItem {
  duration_hours?: number;
  category?: string;
}

const TravelPage = () => {
  const { roomData, isPersonalized } = useRoomData();
  const { itineraries, isLoading: itineraryLoading } = useTravelItinerary(roomData?.booking_id, roomData?.city || 'Сочи', roomData?.property_id);
  const { data: services = [], isLoading: servicesLoading } = useTravelServices(roomData?.city || 'Сочи');
  
  const {
    items: selectedServices,
    addItem,
    removeItem,
    clearCart,
    calculateTotal,
  } = useCart<TravelCartItem>({ withQuantity: false });

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [expandedRestaurantId, setExpandedRestaurantId] = useState<string | null>(null);
  const orderFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomData?.guest_name) {
      setCustomerName(roomData.guest_name);
    }
    if (roomData?.guest_phone) {
      setCustomerPhone(roomData.guest_phone);
    }
  }, [roomData]);

  const handleServiceToggle = (service: any) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      removeItem(service.id);
    } else {
      addItem({ 
        id: service.id, 
        name: service.title, 
        price: service.base_price,
        duration_hours: service.duration_hours || undefined,
        category: service.category || undefined
      });
      
      // Scroll to order form with a slight delay to ensure it's rendered
      setTimeout(() => {
        orderFormRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPersonalized) {
      toast.error("Для оформления заказа необходимо авторизоваться");
      return;
    }
    
    if (selectedServices.length === 0) {
      toast.error("Пожалуйста, выберите хотя бы одну услугу");
      return;
    }

    setSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-travel-order', {
        body: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerComment: customerComment.trim() || null,
          services: selectedServices.map(s => ({
            id: s.id,
            title: s.name,
            base_price: s.price
          })),
          totalPrice: calculateTotal(),
          bookingIdKey: roomData?.booking_record_id || null
        }
      });

      if (error) throw error;

      toast.success(`Заказ №${data.orderId} успешно создан! Мы свяжемся с вами в ближайшее время.`);
      
      clearCart();
      setCustomerComment("");
      if (!roomData?.guest_name) setCustomerName("");
      if (!roomData?.guest_phone) setCustomerPhone("");
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error("Произошла ошибка при отправке заказа");
    } finally {
      setSubmitting(false);
    }
  };

  if (itineraryLoading || servicesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Путешествия и экскурсии</h1>
        
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
            <TabsTrigger value="itinerary" className="text-xs sm:text-sm">Рекомендации</TabsTrigger>
            <TabsTrigger value="services" className="text-xs sm:text-sm">Авторские туры</TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="space-y-6">
            {itineraries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Персональный маршрут не создан</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {itineraries.map((day, index) => (
                  <Card key={day.id}>
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                        День {day.day_number}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                            <MapPin className="h-4 w-4" />
                            {day.activity_title}
                          </h4>
                          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{day.activity_description}</p>
                        </div>
                        
                          {day.service && (
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                              <div className="flex items-start justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Чем дополнить</span>
                                  </div>
                                  <p className="text-xs sm:text-sm font-medium">{day.service.title}</p>
                                  {day.service.duration_hours && (
                                    <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {day.service.duration_hours} часов • {day.service_price_override || day.service.base_price} ₽
                                    </p>
                                  )}
                                </div>
                                {day.is_service_available && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                                    onClick={() => setExpandedServiceId(expandedServiceId === day.service.id ? null : day.service.id)}
                                  >
                                    <span className="hidden sm:inline">{expandedServiceId === day.service.id ? "Скрыть" : "Подробнее"}</span>
                                    {expandedServiceId === day.service.id ? (
                                      <ChevronUp className="h-4 w-4 sm:ml-1" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 sm:ml-1" />
                                    )}
                                  </Button>
                                )}
                              </div>
                              
                              {expandedServiceId === day.service.id && (
                                <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 pl-3 sm:pl-6 border-l-2 border-muted">
                                  {day.service.image_url && (
                                    <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden">
                                      <img 
                                        src={day.service.image_url} 
                                        alt={day.service.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  
                                  {day.service.description && (
                                    <p className="text-xs sm:text-sm text-muted-foreground">{day.service.description}</p>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {day.service.difficulty_level && (
                                      <Badge variant="secondary" className="text-xs">{day.service.difficulty_level}</Badge>
                                    )}
                                    {day.service.category && (
                                      <Badge variant="outline" className="text-xs">{day.service.category}</Badge>
                                    )}
                                  </div>
                                  
                                  <Button
                                    size="sm"
                                    className="w-full sm:w-auto text-xs sm:text-sm"
                                    onClick={() => handleServiceToggle(day.service)}
                                    variant={selectedServices.some(s => s.id === day.service.id) ? "outline" : "default"}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    {selectedServices.some(s => s.id === day.service.id) ? "Убрать из заказа" : "Добавить в заказ"}
                                  </Button>
                                </div>
                              )}
                            </div>
                        )}
                        
                        {day.restaurant && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                            <div className="flex items-start justify-between gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                  <UtensilsCrossed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                  <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide">Где поесть</span>
                                </div>
                                <p className="text-xs sm:text-sm font-medium">{day.restaurant.name}</p>
                                {day.restaurant.cuisine_type && (
                                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{day.restaurant.cuisine_type}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                                onClick={() => setExpandedRestaurantId(expandedRestaurantId === day.restaurant.id ? null : day.restaurant.id)}
                              >
                                <span className="hidden sm:inline">{expandedRestaurantId === day.restaurant.id ? "Скрыть" : "Подробнее"}</span>
                                {expandedRestaurantId === day.restaurant.id ? (
                                  <ChevronUp className="h-4 w-4 sm:ml-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 sm:ml-1" />
                                )}
                              </Button>
                            </div>
                            
                            {expandedRestaurantId === day.restaurant.id && (
                              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 pl-3 sm:pl-6 border-l-2 border-muted">
                                {day.restaurant.image_url && (
                                  <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden">
                                    <img 
                                      src={day.restaurant.image_url} 
                                      alt={day.restaurant.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                
                                {day.restaurant.description && (
                                  <p className="text-xs sm:text-sm text-muted-foreground">{day.restaurant.description}</p>
                                )}
                                
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {day.restaurant.price_range && (
                                    <Badge variant="secondary" className="text-xs">{day.restaurant.price_range}</Badge>
                                  )}
                                  {day.restaurant.cuisine_type && (
                                    <Badge variant="outline" className="text-xs">{day.restaurant.cuisine_type}</Badge>
                                  )}
                                  {day.restaurant.category && (
                                    <Badge variant="outline" className="text-xs">{day.restaurant.category}</Badge>
                                  )}
                                </div>
                                
                                {day.restaurant.partner_link && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs w-full sm:w-auto"
                                    onClick={async () => {
                                      try {
                                        await supabase
                                          .from('restaurant_recommendations')
                                          .update({ total_clicks: (day.restaurant.total_clicks || 0) + 1 })
                                          .eq('id', day.restaurant.id);
                                        
                                        window.open(day.restaurant.partner_link, '_blank');
                                        
                                        console.log('Restaurant click tracked:', {
                                          restaurant: day.restaurant.name,
                                          activity: day.activity_title,
                                          total_clicks: (day.restaurant.total_clicks || 0) + 1
                                        });
                                      } catch (error) {
                                        console.error('Error tracking click:', error);
                                        window.open(day.restaurant.partner_link, '_blank');
                                      }
                                    }}
                                  >
                                    Открыть сайт ресторана
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6">
              {/* Services Grid */}
              <div className="grid gap-4">
                {services.map((service) => (
                <Card key={service.id}>
                    <CardContent className="p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {service.image_url && (
                          <div className="flex-shrink-0 w-full sm:w-32 h-32 rounded-lg overflow-hidden">
                            <img 
                              src={service.image_url} 
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold">{service.title}</h3>
                            <Badge variant="default" className="shrink-0 text-xs sm:text-sm">{service.base_price} ₽</Badge>
                          </div>
                          
                          <p className="text-muted-foreground mb-3 sm:mb-4 text-xs sm:text-sm">{service.description}</p>
                          
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                            <Badge variant="outline" className="text-[10px] sm:text-xs">{service.category}</Badge>
                            {service.difficulty_level && (
                              <Badge variant="secondary" className="text-[10px] sm:text-xs">{service.difficulty_level}</Badge>
                            )}
                            {service.duration_hours && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration_hours} часов
                              </span>
                            )}
                            <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {service.city}
                            </span>
                          </div>
                          
                          <Button
                            onClick={() => handleServiceToggle(service)}
                            variant={selectedServices.some(s => s.id === service.id) ? "default" : "outline"}
                            size="sm"
                            className="w-full sm:w-auto text-xs sm:text-sm"
                          >
                            {selectedServices.some(s => s.id === service.id) ? "Убрать из заказа" : "Добавить в заказ"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Form */}
              {selectedServices.length > 0 && (
                <Card ref={orderFormRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-primary/20 shadow-lg">
                  <CardHeader className="pb-3 sm:pb-6 bg-primary/5">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      Оформление заказа
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Имя</label>
                          <Input
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ваше имя"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Телефон</label>
                          <Input
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+7 (999) 123-45-67"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Комментарий</label>
                        <Textarea
                          value={customerComment}
                          onChange={(e) => setCustomerComment(e.target.value)}
                          placeholder="Дополнительные пожелания..."
                          rows={3}
                        />
                      </div>

                      <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                        <h3 className="font-medium mb-2 text-sm sm:text-base">Выбранные услуги:</h3>
                        {selectedServices.map((service) => (
                          <div key={service.id} className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                            <span className="truncate mr-2">{service.name}</span>
                            <span className="font-medium whitespace-nowrap">{service.price} ₽</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center font-medium text-sm sm:text-base">
                            <span>Итого:</span>
                            <span>{calculateTotal()} ₽</span>
                          </div>
                        </div>
                      </div>

                      {!isPersonalized ? (
                        <CartAuthPrompt />
                      ) : (
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="w-full"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Отправляем заказ...
                            </>
                          ) : (
                            "Отправить заказ"
                          )}
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TravelPage;
