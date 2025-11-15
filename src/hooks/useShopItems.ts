
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  city: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopItemWithPrice extends ShopItem {
  final_price: number;
  is_available: boolean;
}

export const useShopItems = (city: string = 'Сочи', propertyId?: string | null) => {
  return useQuery({
    queryKey: ['shop-items', city, propertyId],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    queryFn: async () => {
      // Parallel queries for better performance
      const [itemsResult, pricingResult] = await Promise.all([
        supabase
          .from('shop_items')
          .select('*')
          .eq('city', city)
          .eq('is_active', true)
          .order('category', { ascending: true }),
        propertyId
          ? supabase
              .from('property_item_pricing')
              .select('shop_item_id, price_override, is_available')
              .eq('property_id', propertyId)
          : Promise.resolve({ data: [], error: null })
      ]);

      const { data: items, error: itemsError } = itemsResult;

      if (itemsError) {
        console.error('Error fetching shop items:', itemsError);
        throw itemsError;
      }

      if (!items || items.length === 0) {
        return [];
      }

      const { data: pricing, error: pricingError } = pricingResult;
      
      if (pricingError) {
        console.error('Error fetching property pricing:', pricingError);
      }

      const propertyPricing = pricing || [];

      // Combine items with pricing
      const itemsWithPricing: ShopItemWithPrice[] = items.map(item => {
        const itemPricing = propertyPricing.find(p => p.shop_item_id === item.id);
        return {
          ...item,
          final_price: itemPricing?.price_override || item.base_price,
          is_available: itemPricing?.is_available !== false
        };
      });

      return itemsWithPricing;
    },
  });
};
