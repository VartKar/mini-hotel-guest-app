
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HotelService {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  city: string;
  has_details: boolean;
  details_content: string | null;
  icon_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HotelServiceWithPrice extends HotelService {
  final_price: number;
  is_available: boolean;
}

export const useHotelServices = (city: string = 'Сочи', propertyId?: string | null) => {
  return useQuery({
    queryKey: ['hotel-services', city, propertyId],
    queryFn: async () => {
      console.log('Fetching hotel services for city:', city, 'property:', propertyId);
      
      // First, get all hotel services for the city
      const { data: services, error: servicesError } = await supabase
        .from('hotel_services')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (servicesError) {
        console.error('Error fetching hotel services:', servicesError);
        throw servicesError;
      }

      // If we have a property ID, get property-specific pricing
      let propertyPricing: any[] = [];
      if (propertyId) {
        const { data: pricing, error: pricingError } = await supabase
          .from('property_service_pricing')
          .select('hotel_service_id, price_override, is_available')
          .eq('property_id', propertyId);

        if (pricingError) {
          console.error('Error fetching service pricing:', pricingError);
        } else {
          propertyPricing = pricing || [];
        }
      }

      // Combine services with pricing
      const servicesWithPricing: HotelServiceWithPrice[] = services.map(service => {
        const pricing = propertyPricing.find(p => p.hotel_service_id === service.id);
        return {
          ...service,
          final_price: pricing?.price_override || service.base_price,
          is_available: pricing?.is_available !== false // Default to true if no override
        };
      });

      console.log('Hotel services with pricing:', servicesWithPricing.length);
      return servicesWithPricing;
    },
  });
};
