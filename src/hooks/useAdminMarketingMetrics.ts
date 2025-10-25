import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminMarketingMetrics = () => {
  return useQuery({
    queryKey: ["admin-marketing-metrics"],
    queryFn: async () => {
      console.log("[useAdminMarketingMetrics] Fetching metrics...");
      
      // 1. Total guests count
      const { count: guestsCount, error: guestsError } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true });

      if (guestsError) {
        console.error("[useAdminMarketingMetrics] Error fetching guests count:", guestsError);
      }

      // 2. Orders count (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: shopOrdersCount } = await supabase
        .from("shop_orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      const { count: travelOrdersCount } = await supabase
        .from("travel_service_orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo.toISOString());

      const ordersCount = (shopOrdersCount || 0) + (travelOrdersCount || 0);

      // 3. Total bonuses
      const { data: guestsData } = await supabase
        .from("guests")
        .select("loyalty_points");

      const totalBonuses = guestsData?.reduce(
        (sum, g) => sum + (g.loyalty_points || 0),
        0
      ) || 0;

      // 4. Revenue (last 30 days)
      const { data: shopOrders } = await supabase
        .from("shop_orders")
        .select("total_amount")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .neq("order_status", "cancelled");

      const { data: travelOrders } = await supabase
        .from("travel_service_orders")
        .select("total_amount")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .neq("order_status", "cancelled");

      const revenue =
        (shopOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0) +
        (travelOrders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0);

      // 5. Top 3 guests by total_spent
      const { data: topGuests } = await supabase
        .from("guests")
        .select("*")
        .order("total_spent", { ascending: false })
        .limit(3);

      // 6. Loyalty tier distribution
      const { data: allGuests } = await supabase
        .from("guests")
        .select("loyalty_tier");

      const distribution = allGuests?.reduce((acc, g) => {
        const tier = g.loyalty_tier || "Стандарт";
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        guestsCount: guestsCount || 0,
        ordersCount,
        totalBonuses,
        revenue,
        topGuests: topGuests || [],
        distribution,
      };
    },
  });
};
