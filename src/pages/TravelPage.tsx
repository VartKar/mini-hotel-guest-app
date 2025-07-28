
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
import { Loader2, MapPin, Clock, Calendar, User } from "lucide-react";

const TravelPage = () => {
  const { roomData } = useRoomData();
  const { itineraries, isLoading: itineraryLoading } = useTravelItinerary(roomData?.booking_id, roomData?.city || 'Сочи', roomData?.property_id);
  const { data: services = [], isLoading: servicesLoading } = useTravelServices();
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
            <TabsTrigger value="itinerary">Ваш маршрут</TabsTrigger>
            <TabsTrigger value="services">Дополнительные услуги</TabsTrigger>
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
                        
                        {day.service_title && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h5 className="font-medium text-blue-900">{day.service_title}</h5>
                            <p className="text-blue-700 text-sm mt-1">{day.service_description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              {day.service_price && (
                                <Badge variant="secondary">{day.service_price} ₽</Badge>
                              )}
                              {day.duration_hours && (
                                <span className="text-sm text-blue-600 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {day.duration_hours} часов
                                </span>
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
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant="default">{service.base_price} ₽</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="outline">{service.category}</Badge>
                        {service.difficulty_level && (
                          <Badge variant="secondary">{service.difficulty_level}</Badge>
                        )}
                        {service.duration_hours && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration_hours} часов
                          </span>
                        )}
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {service.city}
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => handleServiceToggle(service)}
                        variant={selectedServices.some(s => s.id === service.id) ? "default" : "outline"}
                        className="w-full"
                      >
                        {selectedServices.some(s => s.id === service.id) ? "Убрать из заказа" : "Добавить в заказ"}
                      </Button>
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
      </div>
    </div>
  );
};

export default TravelPage;
