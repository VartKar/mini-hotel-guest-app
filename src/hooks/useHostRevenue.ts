import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, startOfWeek, startOfMonth, subDays } from "date-fns";

interface RevenueBySource {
  shop_orders: number;
  travel_services: number;
  total: number;
}

interface RevenueData {
  today: RevenueBySource;
  thisWeek: RevenueBySource;
  thisMonth: RevenueBySource;
  last30Days: RevenueBySource;
  topServices: Array<{
    title: string;
    count: number;
    revenue: number;
  }>;
  topItems: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  dailyTrend: Array<{
    date: string;
    shop: number;
    travel: number;
    total: number;
  }>;
}

export const useHostRevenue = (hostEmail: string) => {
  return useQuery({
    queryKey: ["host-revenue", hostEmail],
    queryFn: async () => {
      // Get all bookings for this host
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("visible_to_hosts", true)
        .eq("is_archived", false);

      if (!bookings || bookings.length === 0) {
        return null;
      }

      const bookingIds = bookings.map((b) => b.id);

      // Time boundaries
      const now = new Date();
      const todayStart = startOfDay(now).toISOString();
      const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
      const monthStart = startOfMonth(now).toISOString();
      const last30DaysStart = subDays(now, 30).toISOString();

      // Helper to calculate revenue for a period
      const getRevenueForPeriod = async (startDate: string) => {
        const { data: shopOrders } = await supabase
          .from("shop_orders")
          .select("total_amount")
          .in("booking_id_key", bookingIds)
          .gte("created_at", startDate)
          .neq("order_status", "cancelled");

        const { data: travelOrders } = await supabase
          .from("travel_service_orders")
          .select("total_amount")
          .in("booking_id_key", bookingIds)
          .gte("created_at", startDate)
          .neq("order_status", "cancelled");

        const shopRevenue = shopOrders?.reduce(
          (sum, o) => sum + Number(o.total_amount),
          0
        ) || 0;

        const travelRevenue = travelOrders?.reduce(
          (sum, o) => sum + Number(o.total_amount),
          0
        ) || 0;

        return {
          shop_orders: shopRevenue,
          travel_services: travelRevenue,
          total: shopRevenue + travelRevenue,
        };
      };

      // Get revenue for different periods
      const [today, thisWeek, thisMonth, last30Days] = await Promise.all([
        getRevenueForPeriod(todayStart),
        getRevenueForPeriod(weekStart),
        getRevenueForPeriod(monthStart),
        getRevenueForPeriod(last30DaysStart),
      ]);

      // Top services (last 30 days)
      const { data: travelOrdersDetailed } = await supabase
        .from("travel_service_orders")
        .select("selected_services, total_amount")
        .in("booking_id_key", bookingIds)
        .gte("created_at", last30DaysStart)
        .neq("order_status", "cancelled");

      const servicesMap = new Map<string, { count: number; revenue: number }>();
      
      travelOrdersDetailed?.forEach((order) => {
        const services = order.selected_services as any[];
        services?.forEach((service: any) => {
          const existing = servicesMap.get(service.title) || { count: 0, revenue: 0 };
          servicesMap.set(service.title, {
            count: existing.count + 1,
            revenue: existing.revenue + Number(service.price || 0),
          });
        });
      });

      const topServices = Array.from(servicesMap.entries())
        .map(([title, data]) => ({ title, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top items (last 30 days)
      const { data: shopOrdersDetailed } = await supabase
        .from("shop_orders")
        .select("ordered_items, total_amount")
        .in("booking_id_key", bookingIds)
        .gte("created_at", last30DaysStart)
        .neq("order_status", "cancelled");

      const itemsMap = new Map<string, { count: number; revenue: number }>();
      
      shopOrdersDetailed?.forEach((order) => {
        const items = order.ordered_items as any[];
        items?.forEach((item: any) => {
          const existing = itemsMap.get(item.name) || { count: 0, revenue: 0 };
          itemsMap.set(item.name, {
            count: existing.count + (item.quantity || 1),
            revenue: existing.revenue + Number(item.price || 0) * (item.quantity || 1),
          });
        });
      });

      const topItems = Array.from(itemsMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Daily trend for last 14 days
      const dailyTrend = [];
      for (let i = 13; i >= 0; i--) {
        const dayStart = subDays(now, i);
        const dayEnd = subDays(now, i - 1);
        
        const { data: shopDay } = await supabase
          .from("shop_orders")
          .select("total_amount")
          .in("booking_id_key", bookingIds)
          .gte("created_at", dayStart.toISOString())
          .lt("created_at", dayEnd.toISOString())
          .neq("order_status", "cancelled");

        const { data: travelDay } = await supabase
          .from("travel_service_orders")
          .select("total_amount")
          .in("booking_id_key", bookingIds)
          .gte("created_at", dayStart.toISOString())
          .lt("created_at", dayEnd.toISOString())
          .neq("order_status", "cancelled");

        const shopRev = shopDay?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
        const travelRev = travelDay?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

        dailyTrend.push({
          date: dayStart.toISOString().split('T')[0],
          shop: shopRev,
          travel: travelRev,
          total: shopRev + travelRev,
        });
      }

      const revenueData: RevenueData = {
        today,
        thisWeek,
        thisMonth,
        last30Days,
        topServices,
        topItems,
        dailyTrend,
      };

      return revenueData;
    },
    enabled: !!hostEmail && hostEmail.length > 0,
    refetchInterval: 60000, // Refresh every minute
  });
};
