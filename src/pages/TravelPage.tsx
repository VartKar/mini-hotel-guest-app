
import React, { useState, useEffect } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useTravelItinerary } from "@/hooks/useTravelItinerary";
import { useTravelServices } from "@/hooks/useTravelServices";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, MapPin, Clock, Calendar, UtensilsCrossed, Plus } from "lucide-react";

const TravelPage = () => {
  const { roomData } = useRoomData();
  const { itineraries, isLoading: itineraryLoading } = useTravelItinerary(roomData?.booking_id, roomData?.city || 'Сочи', roomData?.property_id);
  const { data: services = [], isLoading: servicesLoading } = useTravelServices(roomData?.city || 'Сочи');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<any>(null);

  useEffect(() => {
    if (roomData?.guest_name) {
      setCustomerName(roomData.guest_name);
    }
    if (roomData?.guest_phone) {
      setCustomerPhone(roomData.guest_phone);
    }
  }, [roomData]);

  const handleServiceToggle = (service: any) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + Number(service.base_price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      toast.error("Пожалуйста, выберите хотя бы одну услугу");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Пожалуйста, заполните имя и телефон");
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_comment: customerComment,
        selected_services: selectedServices,
        total_amount: calculateTotal(),
        booking_id_key: roomData?.booking_id || null,
        order_status: 'pending'
      };

      const { error } = await supabase
        .from('travel_service_orders')
        .insert([orderData]);

      if (error) throw error;

      toast.success("Заказ успешно отправлен!");
      
      // Reset form
      setSelectedServices([]);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Путешествия и экскурсии</h1>
        
        <Tabs defaultValue="itinerary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="itinerary">Рекомендации</TabsTrigger>
            <TabsTrigger value="services">Авторские туры</TabsTrigger>
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
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        День {day.day_number}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {day.activity_title}
                          </h4>
                          <p className="text-gray-600 mt-1">{day.activity_description}</p>
                        </div>
                        
                          {day.service && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Чем дополнить</span>
                                  </div>
                                  <p className="text-sm font-medium">{day.service.title}</p>
                                  {day.service.duration_hours && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      {day.service.duration_hours} часов • {day.service_price_override || day.service.base_price} ₽
                                    </p>
                                  )}
                                </div>
                                {day.is_service_available && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0"
                                    onClick={() => setSelectedServiceDetails(day.service)}
                                  >
                                    Подробнее
                                  </Button>
                                )}
                              </div>
                            </div>
                        )}
                        
                        {day.restaurant && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Где поесть</span>
                                </div>
                                <p className="text-sm font-medium">{day.restaurant.name}</p>
                                {day.restaurant.cuisine_type && (
                                  <p className="text-xs text-muted-foreground">{day.restaurant.cuisine_type}</p>
                                )}
                              </div>
                              {day.restaurant.partner_link && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="shrink-0"
                                  onClick={async () => {
                                    try {
                                      // Increment click counter
                                      await supabase
                                        .from('restaurant_recommendations')
                                        .update({ total_clicks: (day.restaurant.total_clicks || 0) + 1 })
                                        .eq('id', day.restaurant.id);
                                      
                                      // Open restaurant link
                                      window.open(day.restaurant.partner_link, '_blank');
                                      
                                      console.log('Restaurant click tracked:', {
                                        restaurant: day.restaurant.name,
                                        activity: day.activity_title,
                                        total_clicks: (day.restaurant.total_clicks || 0) + 1
                                      });
                                    } catch (error) {
                                      console.error('Error tracking click:', error);
                                      // Still open the link even if tracking fails
                                      window.open(day.restaurant.partner_link, '_blank');
                                    }
                                  }}
                                >
                                  Подробнее
                                </Button>
                              )}
                            </div>
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
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
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
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-semibold">{service.title}</h3>
                            <Badge variant="default" className="shrink-0">{service.base_price} ₽</Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                          
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <Badge variant="outline" className="text-xs">{service.category}</Badge>
                            {service.difficulty_level && (
                              <Badge variant="secondary" className="text-xs">{service.difficulty_level}</Badge>
                            )}
                            {service.duration_hours && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration_hours} часов
                              </span>
                            )}
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {service.city}
                            </span>
                          </div>
                          
                          <Button
                            onClick={() => handleServiceToggle(service)}
                            variant={selectedServices.some(s => s.id === service.id) ? "default" : "outline"}
                            size="sm"
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
                <Card>
                  <CardHeader>
                    <CardTitle>Оформление заказа</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Имя *</label>
                          <Input
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ваше имя"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Телефон *</label>
                          <Input
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+7 (999) 123-45-67"
                            required
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

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Выбранные услуги:</h3>
                        {selectedServices.map((service) => (
                          <div key={service.id} className="flex justify-between items-center mb-1">
                            <span>{service.title}</span>
                            <span>{service.base_price} ₽</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between items-center font-medium">
                            <span>Итого:</span>
                            <span>{calculateTotal()} ₽</span>
                          </div>
                        </div>
                      </div>

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
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Service Details Dialog */}
        <Dialog open={!!selectedServiceDetails} onOpenChange={() => setSelectedServiceDetails(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedServiceDetails?.title}</DialogTitle>
              <DialogDescription>{selectedServiceDetails?.category}</DialogDescription>
            </DialogHeader>
            
            {selectedServiceDetails && (
              <div className="space-y-4">
                {selectedServiceDetails.image_url && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <img 
                      src={selectedServiceDetails.image_url} 
                      alt={selectedServiceDetails.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Описание</h4>
                  <p className="text-muted-foreground">{selectedServiceDetails.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {selectedServiceDetails.duration_hours && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedServiceDetails.duration_hours} часов
                    </Badge>
                  )}
                  {selectedServiceDetails.difficulty_level && (
                    <Badge variant="secondary">{selectedServiceDetails.difficulty_level}</Badge>
                  )}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedServiceDetails.city}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold">{selectedServiceDetails.base_price} ₽</div>
                  <Button
                    onClick={() => {
                      handleServiceToggle(selectedServiceDetails);
                      setSelectedServiceDetails(null);
                    }}
                    variant={selectedServices.some(s => s.id === selectedServiceDetails.id) ? "outline" : "default"}
                  >
                    {selectedServices.some(s => s.id === selectedServiceDetails.id) ? "Убрать из заказа" : "Добавить в заказ"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TravelPage;
