
import React, { useState, useEffect, useRef } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useHotelServices } from "@/hooks/useHotelServices";
import { useCart, CartItem } from "@/hooks/useCart";
import { CartAuthPrompt } from "@/components/cart/CartAuthPrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, Mail, Clock, Star, MapPin, Info } from "lucide-react";

interface ServiceCartItem extends CartItem {
  category?: string;
}

const ServicesPage = () => {
  const { roomData, isPersonalized } = useRoomData();
  const { data: services = [], isLoading: loading } = useHotelServices();
  
  const {
    items: selectedServices,
    addItem,
    removeItem,
    clearCart,
    calculateTotal,
  } = useCart<ServiceCartItem>({ withQuantity: false });

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);
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
      const { data, error } = await supabase.functions.invoke('submit-service-order', {
        body: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          roomNumber: roomData?.room_number || null,
          services: selectedServices.map(s => ({
            id: s.id,
            title: s.name,
            base_price: s.price
          })),
          bookingIdKey: roomData?.booking_record_id || null
        }
      });

      console.log('Edge function response:', { data, error });

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Услуги отеля</h1>
        
        <div className="grid gap-6">
          {/* Services Grid */}
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={service.base_price > 0 ? "default" : "secondary"}>
                        {service.base_price > 0 ? `${service.base_price} ₽` : 'Бесплатно'}
                      </Badge>
                      {service.has_details && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedService(
                            expandedService === service.id ? null : service.id
                          )}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {expandedService === service.id && service.details_content && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="whitespace-pre-wrap">{service.details_content}</div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline">{service.category}</Badge>
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
            <Card ref={orderFormRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
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

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Выбранные услуги:</h3>
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex justify-between items-center mb-1">
                        <span>{service.name}</span>
                        <span>{service.price > 0 ? `${service.price} ₽` : 'Бесплатно'}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-medium">
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
      </div>
    </div>
  );
};

export default ServicesPage;
