
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
  image_url: string | null;
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
    queryKey: ['hotel-services', city],
    queryFn: async () => {
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

      if (!services || services.length === 0) {
        return [];
      }

      const servicesWithPricing: HotelServiceWithPrice[] = services.map(service => ({
        ...service,
        final_price: service.base_price,
        is_available: true
      }));

      return servicesWithPricing;
    },
  });
};
