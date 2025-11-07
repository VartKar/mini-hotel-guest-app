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
    const hasGuestId = !!(roomData as any)?.guest_id;
    const hasBooking = !!roomData?.booking_record_id;
    const hasRoom = !!roomData?.room_number;

    if (!hasGuestId && !hasBooking && !hasRoom) {
      console.log('[ProfileTab] No identifiers available');
      setIsLoading(false);
      return;
    }

    console.log('[ProfileTab] Fetching orders:', { 
      hasGuestId, 
      hasBooking, 
      hasRoom,
      guest_id: (roomData as any)?.guest_id,
      booking_record_id: roomData?.booking_record_id, 
      room_number: roomData?.room_number 
    });

    try {
      // Fetch shop orders using all available identifiers and merge
      const shopPromises: Promise<any>[] = [];
      if (hasGuestId) {
        shopPromises.push(
          (async () => await supabase
            .from('shop_orders').select('*')
            .eq('guest_id', (roomData as any)!.guest_id)
            .order('created_at', { ascending: false })
          )()
        );
      }
      if (hasBooking) {
        shopPromises.push(
          (async () => await supabase
            .from('shop_orders').select('*')
            .eq('booking_id_key', roomData!.booking_record_id)
            .order('created_at', { ascending: false })
          )()
        );
      }
      if (hasRoom) {
        shopPromises.push(
          (async () => await supabase
            .from('shop_orders').select('*')
            .eq('room_number', roomData!.room_number)
            .order('created_at', { ascending: false })
          )()
        );
      }

      const shopResults = await Promise.all(shopPromises.map(p => p.catch((e: any) => ({ data: [], error: e }))));
      const shopOrders = shopResults.flatMap((res: any) => res?.data || []);

      // Fetch travel orders using available identifiers and merge
      const travelPromises: Promise<any>[] = [];
      if (hasGuestId) {
        travelPromises.push(
          (async () => await supabase
            .from('travel_service_orders').select('*')
            .eq('guest_id', (roomData as any)!.guest_id)
            .order('created_at', { ascending: false })
          )()
        );
      }
      if (hasBooking) {
        travelPromises.push(
          (async () => await supabase
            .from('travel_service_orders').select('*')
            .eq('booking_id_key', roomData!.booking_record_id)
            .order('created_at', { ascending: false })
          )()
        );
      }

      const travelResults = await Promise.all(travelPromises.map(p => p.catch((e: any) => ({ data: [], error: e }))));
      const travelOrders = travelResults.flatMap((res: any) => res?.data || []);

      // Deduplicate by id
      const dedupeById = <T extends { id: string }>(arr: T[]) => {
        const map = new Map<string, T>();
        arr.forEach(item => map.set(item.id, item));
        return Array.from(map.values());
      };

      const shopUnique = dedupeById(shopOrders);
      const travelUnique = dedupeById(travelOrders);

      const allOrders: Order[] = [
        ...shopUnique.map(order => ({ ...order, type: 'shop' as const })),
        ...travelUnique.map(order => ({ ...order, type: 'travel' as const }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('[ProfileTab] Fetched orders:', allOrders.length, { shop: shopUnique.length, travel: travelUnique.length });
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
