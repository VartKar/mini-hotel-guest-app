
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface TravelItinerary {
  id: string;
  booking_id_key: string | null;
  day_number: number;
  activity_title: string;
  activity_description: string | null;
  service_title: string | null;
  service_description: string | null;
  service_price: number | null;
  icon_type: string | null;
  is_service_available: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface TravelItineraryWithIcon extends TravelItinerary {
  icon: React.ReactNode;
}

// Helper function to calculate days between dates
const calculateDays = (checkIn: string | null, checkOut: string | null): number => {
  if (!checkIn || !checkOut) return 3; // Default to 3 days
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 3;
};

export const useTravelItinerary = (bookingIdKey: string | null, checkInDate: string | null, checkOutDate: string | null) => {
  const queryClient = useQueryClient();
  const numberOfDays = calculateDays(checkInDate, checkOutDate);

  // Fetch itineraries for specific booking
  const { data: bookingItineraries, isLoading } = useQuery({
    queryKey: ['travel-itineraries', bookingIdKey],
    queryFn: async () => {
      if (!bookingIdKey) return [];
      
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select('*')
        .eq('booking_id_key', bookingIdKey)
        .order('day_number');
      
      if (error) throw error;
      return data as TravelItinerary[];
    },
    enabled: !!bookingIdKey,
  });

  // Fetch template itineraries if no booking-specific ones exist
  const { data: templateItineraries } = useQuery({
    queryKey: ['travel-itinerary-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select('*')
        .is('booking_id_key', null)
        .order('day_number')
        .limit(numberOfDays);
      
      if (error) throw error;
      return data as TravelItinerary[];
    },
  });

  // Generate itineraries for the booking based on templates
  const generateItinerariesMutation = useMutation({
    mutationFn: async () => {
      if (!bookingIdKey || !templateItineraries?.length) return;

      const itinerariesToCreate = templateItineraries.slice(0, numberOfDays).map((template, index) => ({
        booking_id_key: bookingIdKey,
        day_number: index + 1,
        activity_title: template.activity_title,
        activity_description: template.activity_description,
        service_title: template.service_title,
        service_description: template.service_description,
        service_price: template.service_price,
        icon_type: template.icon_type,
        is_service_available: template.is_service_available,
      }));

      const { error } = await supabase
        .from('travel_itineraries')
        .insert(itinerariesToCreate);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-itineraries', bookingIdKey] });
      toast('Программа путешествия создана', {
        description: `Создан план на ${numberOfDays} дней`
      });
    },
    onError: (error) => {
      console.error('Error generating itineraries:', error);
      toast('Ошибка при создании программы', {
        description: 'Попробуйте позже'
      });
    },
  });

  // Update itinerary
  const updateItineraryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TravelItinerary> }) => {
      const { error } = await supabase
        .from('travel_itineraries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-itineraries', bookingIdKey] });
    },
    onError: (error) => {
      console.error('Error updating itinerary:', error);
      toast('Ошибка при обновлении', {
        description: 'Не удалось сохранить изменения'
      });
    },
  });

  // Determine which itineraries to use
  const effectiveItineraries = bookingItineraries?.length 
    ? bookingItineraries 
    : templateItineraries?.slice(0, numberOfDays) || [];

  // Auto-generate if we have templates but no booking-specific itineraries
  useEffect(() => {
    if (bookingIdKey && 
        templateItineraries?.length && 
        (!bookingItineraries || bookingItineraries.length === 0)) {
      generateItinerariesMutation.mutate();
    }
  }, [bookingIdKey, templateItineraries, bookingItineraries]);

  return {
    itineraries: effectiveItineraries,
    isLoading,
    numberOfDays,
    updateItinerary: updateItineraryMutation.mutate,
    generateItineraries: generateItinerariesMutation.mutate,
    isGenerating: generateItinerariesMutation.isPending,
  };
};
