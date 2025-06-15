
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Tables } from "@/integrations/supabase/types";

type TravelServiceOrder = Tables<'travel_service_orders'>;

const TravelOrdersManagement = () => {
  const [orders, setOrders] = useState<TravelServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('travel_service_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching travel orders:', error);
      toast.error('Ошибка загрузки заказов');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('travel_service_orders')
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'processing': return 'В обработке';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка заказов...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Заказы услуг путешествий</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Заказов услуг путешествий пока нет
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
                      {getStatusLabel(order.order_status)}
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
                      <span className="font-medium">ID заказа:</span> {order.id.slice(0, 8)}...
                    </div>
                  </div>
                  
                  {order.customer_comment && (
                    <div className="text-sm">
                      <span className="font-medium">Комментарий:</span> {order.customer_comment}
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-sm">Выбранные услуги:</span>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      {(order.selected_services as any[]).map((service: any, index: number) => (
                        <li key={index}>
                          {service.day}: {service.title} - {service.price}
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
                        <SelectItem value="pending">Ожидает</SelectItem>
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

export default TravelOrdersManagement;
