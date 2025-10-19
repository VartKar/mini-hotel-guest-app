import React, { useState, useEffect } from "react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, ShoppingCart, Trash2, X, Info } from "lucide-react";
import { z } from "zod";
import logo from "@/assets/rentme-logo.jpg";

const orderSchema = z.object({
  customerName: z.string()
    .trim()
    .max(100, { message: "Имя не должно превышать 100 символов" })
    .optional(),
  customerPhone: z.string()
    .trim()
    .max(20, { message: "Телефон не должен превышать 20 символов" })
    .optional(),
  customerComment: z.string()
    .max(500, { message: "Комментарий не должен превышать 500 символов" })
    .optional()
});

interface ServiceCartItem extends CartItem {
  category: string;
  image_url?: string;
  has_details: boolean;
  details_content?: string | null;
}

const ServicesPage = () => {
  const { roomData, isPersonalized } = useRoomData();
  const { data: services = [], isLoading: loading } = useHotelServices();
  
  const {
    items: selectedServices,
    addItem,
    removeItem,
    removeItemCompletely,
    clearCart,
    calculateTotal,
    getTotalItems,
  } = useCart<ServiceCartItem>({ storageKey: "services_cart", withQuantity: false });

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    if (roomData?.guest_name) {
      setCustomerName(roomData.guest_name);
    }
    if (roomData?.guest_phone) {
      setCustomerPhone(roomData.guest_phone);
    }
  }, [roomData]);

  const toggleServiceDetails = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const addToCart = (service: any) => {
    addItem({ 
      id: service.id, 
      name: service.title, 
      price: service.base_price,
      category: service.category,
      image_url: service.image_url,
      has_details: service.has_details,
      details_content: service.details_content
    });
    toast.success(`${service.title} добавлен в корзину`);
  };

  const handleRemoveItem = (serviceId: string) => {
    removeItemCompletely(serviceId);
    toast.success("Услуга удалена из корзины");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Корзина очищена");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPersonalized) {
      toast.error("Для оформления заказа необходимо авторизоваться");
      return;
    }
    
    if (selectedServices.length === 0) {
      toast.error("Корзина пуста");
      return;
    }

    // Validate form data
    const validation = orderSchema.safeParse({
      customerName,
      customerPhone,
      customerComment
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError.message);
      return;
    }

    setSubmitting(true);
    
    try {
      const totalAmount = calculateTotal();
      
      const { data, error } = await supabase.functions.invoke('submit-service-order', {
        body: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerComment: customerComment.trim(),
          services: selectedServices.map(s => ({
            id: s.id,
            title: s.name,
            base_price: s.price
          })),
          totalAmount: totalAmount,
          bookingIdKey: roomData?.booking_record_id || null,
          roomNumber: roomData?.room_number || null
        }
      });

      if (error) throw error;
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to submit order');
      }

      toast.success("Заказ успешно отправлен!");
      
      clearCart();
      setCustomerComment("");
      if (!roomData?.guest_name) setCustomerName("");
      if (!roomData?.guest_phone) setCustomerPhone("");
      setIsMobileCartOpen(false);
      
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

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const result: React.ReactNode[] = [];
    let listItems: string[] = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        result.push(
          <ul key={`list-${result.length}`} className="list-disc list-inside space-y-1 mb-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-sm">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };
    
    lines.forEach((line, idx) => {
      // Bold text: **text** -> <strong>
      const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // List items starting with •
      if (line.trim().startsWith('•')) {
        listItems.push(line.trim().substring(1).trim());
      } else {
        flushList();
        if (line.trim()) {
          result.push(
            <p 
              key={idx} 
              className="mb-2" 
              dangerouslySetInnerHTML={{ __html: boldProcessed }}
            />
          );
        }
      }
    });
    
    flushList();
    return result;
  };

  const CartContent = () => (
    <>
      {selectedServices.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Корзина пуста</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {getTotalItems()} {getTotalItems() === 1 ? 'услуга' : getTotalItems() < 5 ? 'услуги' : 'услуг'}
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Очистить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Очистить корзину?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Все услуги будут удалены из корзины. Это действие нельзя отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearCart}>Очистить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-y-3 mb-4">
            {selectedServices.map((service) => {
              const price = Number(service.price) || 0;
              return (
                <div key={service.id} className="flex justify-between items-start gap-2 p-2 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-medium text-sm">{price > 0 ? `${price} ₽` : 'Бесплатно'}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleRemoveItem(service.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="border-t pt-4 mb-4">
            <div className="flex justify-between items-center font-medium text-lg">
              <span>Итого:</span>
              <span>{calculateTotal()} ₽</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium mb-1">Комментарий</label>
              <Textarea
                value={customerComment}
                onChange={(e) => setCustomerComment(e.target.value)}
                placeholder="Дополнительные пожелания..."
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {customerComment.length}/500
              </p>
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
                  "Оформить заказ"
                )}
              </Button>
            )}
          </form>
        </>
      )}
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src={logo} 
            alt="Hotel logo" 
            className="h-12 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Услуги отеля</h1>
          
          {/* Mobile Cart Button */}
          <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
            <SheetTrigger asChild>
              <Button className="lg:hidden relative" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Корзина
                {selectedServices.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 rounded-full" variant="secondary">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Корзина
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <CartContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Grid */}
          <div className="lg:col-span-2">
            {services.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Услуг пока нет</p>
                  <p className="text-sm text-muted-foreground">
                    Скоро здесь появятся услуги
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {services.map((service) => {
                  const isInCart = selectedServices.some(s => s.id === service.id);
                  const isExpanded = expandedServices.has(service.id);
                  
                  return (
                    <Card key={service.id}>
                      <CardContent className="p-0">
                        <div className="flex gap-4">
                          {/* Image */}
                          {service.image_url && (
                            <div className="w-32 h-32 shrink-0">
                              <img
                                src={service.image_url}
                                alt={service.title}
                                className="w-full h-full object-cover rounded-l-lg"
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold">{service.title}</h3>
                              <Badge variant="default">
                                {service.base_price > 0 ? `${service.base_price} ₽` : 'Бесплатно'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                            
                            {/* Details Content */}
                            {service.has_details && service.details_content && (
                              <div className="mb-3">
                                {isExpanded ? (
                                  <div className="p-3 bg-muted/50 rounded-lg mb-2">
                                    <div className="text-sm space-y-1">
                                      {renderMarkdown(service.details_content)}
                                    </div>
                                  </div>
                                ) : null}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleServiceDetails(service.id)}
                                  className="h-7 text-xs"
                                >
                                  <Info className="h-3 w-3 mr-1" />
                                  {isExpanded ? "Скрыть детали" : "Показать детали"}
                                </Button>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{service.category}</Badge>
                              
                              <Button
                                variant={isInCart ? "default" : "outline"}
                                size="sm"
                                onClick={() => isInCart ? handleRemoveItem(service.id) : addToCart(service)}
                              >
                                {isInCart ? "В корзине" : "Добавить"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Cart */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Корзина
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CartContent />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
