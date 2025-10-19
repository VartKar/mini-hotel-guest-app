
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Tables } from "@/integrations/supabase/types";
import { translateStatus, getStatusBadgeVariant } from "@/lib/statusTranslations";

type ShopOrder = Tables<'shop_orders'>;

const ShopOrdersManagement = () => {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching shop orders:', error);
      toast.error('Ошибка загрузки заказов');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      const oldStatus = order?.order_status;

      const { error } = await supabase
        .from('shop_orders')
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Update guest's total_spent when status changes to completed or processing
      if (order && (newStatus === 'completed' || newStatus === 'processing') && 
          oldStatus !== 'completed' && oldStatus !== 'processing') {
        if (order.booking_id_key) {
          const { data: booking } = await supabase
            .from('bookings')
            .select('guest_email')
            .eq('id', order.booking_id_key)
            .single();

          if (booking?.guest_email) {
            const { error: updateError } = await supabase.rpc('increment_guest_spent', {
              guest_email_param: booking.guest_email,
              amount_param: order.total_amount
            });
            
            if (updateError) {
              console.error('Failed to update guest total_spent:', updateError);
            }
          }
        }
      }
      
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, order_status: newStatus }
          : order
      ));
      
      toast.success('Статус заказа обновлен');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Ошибка обновления статуса');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка заказов...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Заказы из магазина</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Заказов из магазина пока нет
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.customer_name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(order.order_status)}>
                      {translateStatus(order.order_status)}
                    </Badge>
                    <span className="font-bold text-lg">{order.total_amount} ₽</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Телефон:</span> {order.customer_phone}
                    </div>
                    <div>
                      <span className="font-medium">Комната:</span> {order.room_number || 'Не указана'}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">ID заказа:</span> {order.id.slice(0, 8)}...
                  </div>
                  
                  {order.customer_comment && (
                    <div className="text-sm">
                      <span className="font-medium">Комментарий:</span>
                      <p className="mt-1 p-2 bg-gray-50 rounded text-gray-700">{order.customer_comment}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-sm">Заказанные товары:</span>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {(order.ordered_items as any[]).map((item: any, index: number) => (
                        <li key={index}>
                          {item.name} - {item.price} ₽ x {item.quantity} ({item.category})
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <Select
                      value={order.order_status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">В ожидании</SelectItem>
                        <SelectItem value="processing">В обработке</SelectItem>
                        <SelectItem value="completed">Выполнен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopOrdersManagement;
