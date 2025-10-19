
import React from "react";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
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

interface TravelServiceOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_comment?: string;
  selected_services: any[];
  total_amount: number;
  order_status: string;
}

interface TravelServiceOrdersProps {
  hostEmail: string;
}

const TravelServiceOrders = ({ hostEmail }: TravelServiceOrdersProps) => {
  const queryClient = useQueryClient();

  // Fetch travel service orders for this host's properties
  const { data: orders, isLoading } = useQuery({
    queryKey: ['host-travel-service-orders', hostEmail],
    queryFn: async () => {
      if (!hostEmail) return [];

      // Get all bookings for this host through rooms table
      const { data: hostBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, rooms!inner(host_email)')
        .eq('rooms.host_email', hostEmail)
        .eq('visible_to_hosts', true)
        .eq('is_archived', false);

      if (bookingsError) {
        console.error('Error fetching host bookings:', bookingsError);
        throw bookingsError;
      }

      if (!hostBookings || hostBookings.length === 0) {
        return [];
      }

      const bookingIds = hostBookings.map(booking => booking.id);

      // Get travel service orders
      const { data: travelOrders, error: ordersError } = await supabase
        .from('travel_service_orders')
        .select('*')
        .in('booking_id_key', bookingIds)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching travel orders:', ordersError);
        throw ordersError;
      }

      return travelOrders as TravelServiceOrder[];
    },
    enabled: !!hostEmail,
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('travel_service_orders')
        .update({ 
          order_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-travel-service-orders'] });
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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка заказов туристических услуг...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Заказы туристических услуг
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Заказов туристических услуг пока нет
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата/Время</TableHead>
                <TableHead>Гость</TableHead>
                <TableHead>Услуги</TableHead>
                <TableHead>Сумма</TableHead>
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
                    <div className="space-y-1">
                      {order.selected_services?.map((service: any, index: number) => (
                        <div key={index} className="text-sm">
                          {service.title || service.name} ({service.base_price || service.price} ₽)
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
                    <div className="font-medium">{order.total_amount} ₽</div>
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

export default TravelServiceOrders;
