
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRoomData } from "@/hooks/useRoomData";

interface ProfileData {
  name: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
}

interface ProfileTabProps {
  profile: ProfileData;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  order_status: string;
  ordered_items?: any[];
  selected_services?: any[];
  type: 'shop' | 'travel' | 'service';
}

const ProfileTab = ({ profile, onProfileChange }: ProfileTabProps) => {
  const { roomData } = useRoomData();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [roomData]);

  const fetchOrders = async () => {
    if (!roomData?.id_key) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch shop orders
      const { data: shopOrders, error: shopError } = await supabase
        .from('shop_orders')
        .select('*')
        .eq('booking_id_key', roomData.id_key)
        .order('created_at', { ascending: false });

      // Fetch travel orders
      const { data: travelOrders, error: travelError } = await supabase
        .from('travel_service_orders')
        .select('*')
        .eq('booking_id_key', roomData.id_key)
        .order('created_at', { ascending: false });

      if (shopError) console.error('Error fetching shop orders:', shopError);
      if (travelError) console.error('Error fetching travel orders:', travelError);

      const allOrders: Order[] = [
        ...(shopOrders || []).map(order => ({
          ...order,
          type: 'shop' as const
        })),
        ...(travelOrders || []).map(order => ({
          ...order,
          type: 'travel' as const
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderTitle = (order: Order) => {
    if (order.type === 'shop' && order.ordered_items) {
      const firstItem = order.ordered_items[0];
      if (firstItem?.name) return firstItem.name;
      if (firstItem?.title) return firstItem.title;
    }
    if (order.type === 'travel' && order.selected_services) {
      const firstService = order.selected_services[0];
      return firstService?.title || 'Услуги путешествия';
    }
    return order.type === 'shop' ? 'Заказ из магазина' : 'Услуги путешествия';
  };

  const getOrderDescription = (order: Order) => {
    const date = new Date(order.created_at).toLocaleDateString('ru-RU');
    const time = new Date(order.created_at).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${date}, ${time}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'processing': return 'text-blue-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнен';
      case 'pending': return 'Ожидает';
      case 'processing': return 'В обработке';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">История заказов</h3>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Загрузка заказов...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Заказов пока нет</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium">{getOrderTitle(order)}</div>
                  <div className="text-sm text-hotel-neutral">{getOrderDescription(order)}</div>
                  <div className={`text-xs ${getStatusColor(order.order_status)}`}>
                    {getStatusText(order.order_status)}
                  </div>
                </div>
                <div className="font-medium">
                  {order.total_amount > 0 ? `${order.total_amount} ₽` : 'Услуга'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button className="w-full" onClick={fetchOrders}>Обновить историю заказов</Button>
    </div>
  );
};

export default ProfileTab;
