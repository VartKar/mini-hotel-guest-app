
import React, { useState, useEffect } from "react";
import { useRoomData } from "@/hooks/useRoomData";
import { useShopItems } from "@/hooks/useShopItems";
import { useCart, CartItem } from "@/hooks/useCart";
import { CartAuthPrompt } from "@/components/cart/CartAuthPrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { z } from "zod";

const MAX_QUANTITY = 99;

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

interface ShopCartItem extends CartItem {
  category: string;
  image_url?: string;
}

const ShopPage = () => {
  const { roomData, isPersonalized } = useRoomData();
  const { data: items = [], isLoading: loading } = useShopItems();
  
  const {
    items: cart,
    addItem,
    removeItem,
    removeItemCompletely,
    updateQuantity,
    clearCart,
    calculateTotal,
    getTotalItems,
  } = useCart<ShopCartItem>({ storageKey: "shop_cart", withQuantity: true });

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    if (roomData?.guest_name) {
      setCustomerName(roomData.guest_name);
    }
    if (roomData?.guest_phone) {
      setCustomerPhone(roomData.guest_phone);
    }
  }, [roomData]);

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem && (existingItem.quantity || 0) >= MAX_QUANTITY) {
      toast.error(`Максимальное количество: ${MAX_QUANTITY} шт.`);
      return;
    }
    addItem({ 
      id: item.id, 
      name: item.name, 
      price: item.base_price,
      category: item.category,
      image_url: item.image_url
    });
    toast.success(`${item.name} добавлен в корзину`);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemCompletely(itemId);
    toast.success("Товар удален из корзины");
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
    
    if (cart.length === 0) {
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
      
      const { data, error } = await supabase.functions.invoke('submit-shop-order', {
        body: {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerComment: customerComment.trim(),
          items: cart.map(item => ({
            item_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            category: item.category
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

  const CartContent = () => (
    <>
      {cart.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">Корзина пуста</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {getTotalItems()} {getTotalItems() === 1 ? 'товар' : getTotalItems() < 5 ? 'товара' : 'товаров'}
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
                    Все товары будут удалены из корзины. Это действие нельзя отменить.
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
            {cart.map((item) => {
              const price = Number(item.price) || 0;
              const quantity = item.quantity || 1;
              return (
                <div key={item.id} className="flex justify-between items-start gap-2 p-2 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {price} ₽ × {quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-medium text-sm">{price * quantity} ₽</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleRemoveItem(item.id)}
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Магазин</h1>
          
          {/* Mobile Cart Button */}
          <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
            <SheetTrigger asChild>
              <Button className="lg:hidden relative" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Корзина
                {cart.length > 0 && (
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
          {/* Items Grid */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Товаров пока нет</p>
                  <p className="text-sm text-muted-foreground">
                    Скоро здесь появятся товары
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      {/* Image */}
                      {item.image_url && (
                        <div className="w-32 h-32 shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <Badge variant="default">{item.base_price} ₽</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.category}</Badge>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              disabled={!cart.find(cartItem => cartItem.id === item.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="0"
                              max={MAX_QUANTITY}
                              value={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                if (value === 0) {
                                  removeItemCompletely(item.id);
                                } else {
                                  updateQuantity(item.id, value);
                                }
                              }}
                              className="w-16 text-center h-8 px-2"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
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

export default ShopPage;
