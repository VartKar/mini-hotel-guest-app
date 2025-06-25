
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShopItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  base_price: number;
  city: string;
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
    queryFn: async () => {
      console.log('Fetching shop items for city:', city, 'property:', propertyId);
      
      // First, get all shop items for the city
      const { data: items, error: itemsError } = await supabase
        .from('shop_items')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (itemsError) {
        console.error('Error fetching shop items:', itemsError);
        throw itemsError;
      }

      // If we have a property ID, get property-specific pricing
      let propertyPricing: any[] = [];
      if (propertyId) {
        const { data: pricing, error: pricingError } = await supabase
          .from('property_item_pricing')
          .select('shop_item_id, price_override, is_available')
          .eq('property_id', propertyId);

        if (pricingError) {
          console.error('Error fetching property pricing:', pricingError);
        } else {
          propertyPricing = pricing || [];
        }
      }

      // Combine items with pricing
      const itemsWithPricing: ShopItemWithPrice[] = items.map(item => {
        const pricing = propertyPricing.find(p => p.shop_item_id === item.id);
        return {
          ...item,
          final_price: pricing?.price_override || item.base_price,
          is_available: pricing?.is_available !== false // Default to true if no override
        };
      });

      console.log('Shop items with pricing:', itemsWithPricing.length);
      return itemsWithPricing;
    },
  });
};
