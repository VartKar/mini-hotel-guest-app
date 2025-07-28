
import React, { useState, useEffect } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useShopItems } from "@/hooks/useShopItems";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";

const ShopPage = () => {
  const { roomData } = useRoomData();
  const { data: items = [], isLoading: loading } = useShopItems();
  const [cart, setCart] = useState<any[]>([]);
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

  const addToCart = (item: any) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prev.filter(cartItem => cartItem.id !== itemId);
      }
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.base_price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error("Корзина пуста");
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
        ordered_items: cart,
        total_amount: calculateTotal(),
        booking_id_key: roomData?.booking_id || null,
        room_number: roomData?.room_number || null,
        order_status: 'pending'
      };

      const { error } = await supabase
        .from('shop_orders')
        .insert([orderData]);

      if (error) throw error;

      toast.success("Заказ успешно отправлен!");
      
      // Reset form
      setCart([]);
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Магазин</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items Grid */}
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="default">{item.base_price} ₽</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={!cart.find(cartItem => cartItem.id === item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Корзина
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Корзина пуста</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.base_price} ₽ × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{item.base_price * item.quantity} ₽</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-4 mb-4">
                      <div className="flex justify-between items-center font-medium text-lg">
                        <span>Итого:</span>
                        <span>{calculateTotal()} ₽</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                      <div>
                        <label className="block text-sm font-medium mb-1">Комментарий</label>
                        <Textarea
                          value={customerComment}
                          onChange={(e) => setCustomerComment(e.target.value)}
                          placeholder="Дополнительные пожелания..."
                          rows={3}
                        />
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
                          "Оформить заказ"
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
