
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
  image_url: string | null;
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    queryFn: async () => {
      // Fetch services and pricing in parallel
      const [servicesResult, pricingResult] = await Promise.all([
        supabase
          .from('travel_services')
          .select('*')
          .eq('city', city)
          .eq('is_active', true)
          .order('category', { ascending: true }),
        propertyId 
          ? supabase
              .from('property_service_pricing')
              .select('travel_service_id, price_override, is_available')
              .eq('property_id', propertyId)
          : Promise.resolve({ data: [], error: null })
      ]);

      if (servicesResult.error) {
        console.error('Error fetching travel services:', servicesResult.error);
        throw servicesResult.error;
      }

      const services = servicesResult.data;
      const propertyPricing = pricingResult.error ? [] : (pricingResult.data || []);

      if (pricingResult.error) {
        console.error('Error fetching service pricing:', pricingResult.error);
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

      return servicesWithPricing;
    },
  });
};
