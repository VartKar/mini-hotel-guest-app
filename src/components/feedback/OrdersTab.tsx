
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, Calendar } from "lucide-react";

interface OrdersTabProps {
  bookingRecordId: string | null;
  isPersonalized: boolean;
}

const OrdersTab = ({ bookingRecordId, isPersonalized }: OrdersTabProps) => {
  // Fetch shop orders (hotel services and shop items)
  const { data: shopOrders, isLoading: shopLoading } = useQuery({
    queryKey: ['guest-shop-orders', bookingRecordId],
    queryFn: async () => {
      if (!bookingRecordId) return [];
      
      const { data, error } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('booking_id_key', bookingRecordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!bookingRecordId && isPersonalized
  });

  // Fetch travel service orders
  const { data: travelOrders, isLoading: travelLoading } = useQuery({
    queryKey: ['guest-travel-orders', bookingRecordId],
    queryFn: async () => {
      if (!bookingRecordId) return [];
      
      const { data, error } = await supabase
        .from('travel_service_orders')
        .select('*')
        .eq('booking_id_key', bookingRecordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!bookingRecordId && isPersonalized
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Выполнен</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">В работе</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Ожидает</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Заказ выполнен';
      case 'processing':
        return 'Заказ в работе';
      case 'pending':
        return 'Ожидает обработки';
      default:
        return status;
    }
  };

  if (!isPersonalized) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Введите email в поле выше для просмотра истории заказов</p>
      </div>
    );
  }

  if (shopLoading || travelLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const hasOrders = (shopOrders && shopOrders.length > 0) || (travelOrders && travelOrders.length > 0);

  if (!hasOrders) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Shop Orders (Hotel Services & Shop Items) */}
      {shopOrders && shopOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Услуги и товары
          </h3>
          {shopOrders.map((order: any) => (
            <Card key={order.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Заказ #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  {getStatusBadge(order.order_status)}
                </div>
                
                <div className="space-y-1 mb-2">
                  {order.ordered_items?.map((item: any, index: number) => (
                    <div key={index} className="text-sm">
                      • {item.title || item.name}
                      {item.quantity && item.quantity > 1 && ` (×${item.quantity})`}
                    </div>
                  ))}
                </div>
                
                {order.total_amount > 0 && (
                  <p className="text-sm font-medium">
                    Итого: {order.total_amount} ₽
                  </p>
                )}
                
                <p className="text-xs text-gray-600 mt-2">
                  {getStatusText(order.order_status)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Travel Service Orders */}
      {travelOrders && travelOrders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Туристические услуги
          </h3>
          {travelOrders.map((order: any) => (
            <Card key={order.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Заказ #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  {getStatusBadge(order.order_status)}
                </div>
                
                <div className="space-y-1 mb-2">
                  {order.selected_services?.map((service: any, index: number) => (
                    <div key={index} className="text-sm">
                      • {service.title || service.name}
                    </div>
                  ))}
                </div>
                
                {order.total_amount > 0 && (
                  <p className="text-sm font-medium">
                    Итого: {order.total_amount} ₽
                  </p>
                )}
                
                {order.customer_comment && (
                  <p className="text-xs text-gray-600 mt-2 italic">
                    💬 {order.customer_comment}
                  </p>
                )}
                
                <p className="text-xs text-gray-600 mt-2">
                  {getStatusText(order.order_status)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
