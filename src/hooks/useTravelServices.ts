
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TravelService {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  base_price: number;
  city: string;
  duration_hours: number | null;
  difficulty_level: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TravelServiceWithPrice extends TravelService {
  final_price: number;
  is_available: boolean;
}

export const useTravelServices = (city: string = 'Сочи', propertyId?: string | null) => {
  return useQuery({
    queryKey: ['travel-services', city, propertyId],
    queryFn: async () => {
      console.log('Fetching travel services for city:', city, 'property:', propertyId);
      
      // First, get all travel services for the city
      const { data: services, error: servicesError } = await supabase
        .from('travel_services')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (servicesError) {
        console.error('Error fetching travel services:', servicesError);
        throw servicesError;
      }

      // If we have a property ID, get property-specific pricing
      let propertyPricing: any[] = [];
      if (propertyId) {
        const { data: pricing, error: pricingError } = await supabase
          .from('property_service_pricing')
          .select('travel_service_id, price_override, is_available')
          .eq('property_id', propertyId);

        if (pricingError) {
          console.error('Error fetching service pricing:', pricingError);
        } else {
          propertyPricing = pricing || [];
        }
      }

      // Combine services with pricing
      const servicesWithPricing: TravelServiceWithPrice[] = services.map(service => {
        const pricing = propertyPricing.find(p => p.travel_service_id === service.id);
        return {
          ...service,
          final_price: pricing?.price_override || service.base_price,
          is_available: pricing?.is_available !== false // Default to true if no override
        };
      });

      console.log('Travel services with pricing:', servicesWithPricing.length);
      return servicesWithPricing;
    },
  });
};
