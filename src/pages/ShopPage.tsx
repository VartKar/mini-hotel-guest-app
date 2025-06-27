
import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { toast } from "@/components/ui/sonner";
import { useShopItems } from "@/hooks/useShopItems";
import { useRoomData } from "@/hooks/useRoomData";
import { supabase } from "@/integrations/supabase/client";

const ShopPage = () => {
  const { roomData } = useRoomData();
  const city = roomData?.city || 'Сочи';
  const propertyId = roomData?.property_id;
  
  const { data: shopItems, isLoading } = useShopItems(city, propertyId);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setQuantity(1);
    setIsDrawerOpen(true);
  };

  const handleSubmitOrder = async () => {
    if (!selectedItem) {
      toast.error("Товар не выбран");
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
        items: [{
          name: selectedItem.name,
          price: selectedItem.final_price,
          quantity: quantity,
          category: selectedItem.category
        }],
        totalAmount: selectedItem.final_price * quantity,
        bookingIdKey: roomData?.id_key || null
      };

      console.log('Submitting shop order:', orderData);

      const { data, error } = await supabase.functions.invoke('submit-shop-order', {
        body: orderData
      });

      if (error) {
        console.error('Shop order submission error:', error);
        throw error;
      }

      console.log('Shop order submitted successfully:', data);
      
      toast.success("Ваш заказ успешно отправлен!");
      setIsDrawerOpen(false);
      setSelectedItem(null);
      setQuantity(1);
      setComment("");
      
    } catch (error) {
      console.error('Error submitting shop order:', error);
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
          <p className="text-hotel-neutral">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Магазин отеля</h1>
      
      <div className="space-y-4">
        {shopItems?.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                <ShoppingCart size={24} />
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-medium">{item.name}</h2>
                <p className="text-hotel-neutral">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold text-hotel-dark">{item.final_price} ₽</span>
                  <span className="text-sm text-gray-500">{item.category}</span>
                </div>
              </div>
            </div>
            <button 
              className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium"
              onClick={() => handleItemClick(item)}
              disabled={!item.is_available}
            >
              {item.is_available ? 'Заказать' : 'Недоступно'}
            </button>
          </div>
        ))}

        {(!shopItems || shopItems.length === 0) && (
          <div className="text-center py-8">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Товары загружаются...</p>
          </div>
        )}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4">
          <DrawerHeader>
            <DrawerTitle>Подтверждение заказа</DrawerTitle>
          </DrawerHeader>
          
          <div className="space-y-4 py-4">
            {selectedItem && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="block font-medium">{selectedItem.name}</span>
                    <span className="text-sm text-gray-500">{selectedItem.category}</span>
                    <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>
                  </div>
                  <span className="font-medium text-lg">{selectedItem.final_price}₽</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Количество</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Общая стоимость</label>
                <span className="text-lg font-semibold">{selectedItem ? selectedItem.final_price * quantity : 0} ₽</span>
              </div>

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

export default ShopPage;
