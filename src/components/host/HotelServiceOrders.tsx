
import React from "react";
import { Calendar, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HotelServiceOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  room_number: string;
  ordered_items: any[];
  order_status: string;
  customer_comment?: string;
}

interface HotelServiceOrdersProps {
  hostEmail: string;
}

const HotelServiceOrders = ({ hostEmail }: HotelServiceOrdersProps) => {
  const queryClient = useQueryClient();

  // Fetch hotel service orders for this host's properties
  const { data: orders, isLoading } = useQuery({
    queryKey: ['host-hotel-service-orders', hostEmail],
    queryFn: async () => {
      // First get all bookings for this host
      const { data: hostBookings, error: bookingsError } = await supabase
        .from('combined')
        .select('id_key')
        .eq('host_email', hostEmail);

      if (bookingsError) throw bookingsError;

      if (!hostBookings || hostBookings.length === 0) {
        return [];
      }

      const bookingIds = hostBookings.map(booking => booking.id_key);

      // Get shop orders that are hotel services (not shop items)
      const { data: serviceOrders, error: ordersError } = await supabase
        .from('shop_orders')
        .select('*')
        .in('booking_id_key', bookingIds)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Filter orders to only include hotel services (those with service titles, not shop items)
      const hotelServiceOrders = serviceOrders?.filter(order => 
        order.ordered_items?.some((item: any) => 
          item.title && (
            item.title.includes('Уборка') || 
            item.title.includes('Еда') || 
            item.title.includes('прачечной') || 
            item.title.includes('Спа')
          )
        )
      ) || [];

      return hotelServiceOrders as HotelServiceOrder[];
    },
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('shop_orders')
        .update({ 
          order_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-hotel-service-orders'] });
      toast.success('Статус заказа обновлен');
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast.error('Ошибка при обновлении статуса');
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Выполнен</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">В работе</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ожидает</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('Уборка')) return '🧹';
    if (serviceName.includes('Еда')) return '🍽️';
    if (serviceName.includes('прачечной')) return '👕';
    if (serviceName.includes('Спа')) return '💆';
    return '🏨';
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка заказов услуг...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Заказы гостиничных услуг
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Заказов услуг пока нет
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата/Время</TableHead>
                <TableHead>Гость</TableHead>
                <TableHead>Номер</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(order.created_at).toLocaleDateString('ru-RU')}</div>
                      <div className="text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.room_number}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.ordered_items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span>{getServiceIcon(item.title || item.name || '')}</span>
                          <span className="text-sm">{item.title || item.name}</span>
                        </div>
                      ))}
                      {order.customer_comment && (
                        <div className="text-xs text-gray-600 mt-1">
                          💬 {order.customer_comment}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.order_status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.order_status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(order.id, 'processing')}
                          className="text-blue-600"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          В работу
                        </Button>
                      )}
                      {order.order_status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Выполнено
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HotelServiceOrders;
