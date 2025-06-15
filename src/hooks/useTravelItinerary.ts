
import { useState, useEffect, useRef } from 'react';
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
  city: string | null;
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

// Helper function to intelligently select activities for each day
const selectActivitiesForTrip = (templates: TravelItinerary[], numberOfDays: number): Omit<TravelItinerary, 'id' | 'created_at' | 'updated_at'>[] => {
  const result: Omit<TravelItinerary, 'id' | 'created_at' | 'updated_at'>[] = [];
  
  // Group templates by day number for better distribution
  const templatesByDay = templates.reduce((acc, template) => {
    if (!acc[template.day_number]) {
      acc[template.day_number] = [];
    }
    acc[template.day_number].push(template);
    return acc;
  }, {} as Record<number, TravelItinerary[]>);
  
  // Get available day numbers and sort them
  const availableDays = Object.keys(templatesByDay).map(Number).sort((a, b) => a - b);
  
  for (let day = 1; day <= numberOfDays; day++) {
    let selectedTemplate: TravelItinerary;
    
    // Try to find a template for this specific day
    if (templatesByDay[day] && templatesByDay[day].length > 0) {
      // Randomly select from available templates for this day
      const dayTemplates = templatesByDay[day];
      selectedTemplate = dayTemplates[Math.floor(Math.random() * dayTemplates.length)];
    } else {
      // If no template for this specific day, cycle through available days
      const cycleDay = availableDays[(day - 1) % availableDays.length];
      const cycleTemplates = templatesByDay[cycleDay];
      selectedTemplate = cycleTemplates[Math.floor(Math.random() * cycleTemplates.length)];
    }
    
    // Create activity for this day
    result.push({
      booking_id_key: null, // Will be set when creating
      day_number: day, // Use the actual day number for the trip
      activity_title: selectedTemplate.activity_title,
      activity_description: selectedTemplate.activity_description,
      service_title: selectedTemplate.service_title,
      service_description: selectedTemplate.service_description,
      service_price: selectedTemplate.service_price,
      icon_type: selectedTemplate.icon_type,
      is_service_available: selectedTemplate.is_service_available,
      city: selectedTemplate.city,
    });
  }
  
  return result;
};

export const useTravelItinerary = (bookingIdKey: string | null, checkInDate: string | null, checkOutDate: string | null) => {
  const queryClient = useQueryClient();
  const numberOfDays = calculateDays(checkInDate, checkOutDate);
  const generatedRef = useRef<Set<string>>(new Set());

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

  // Fetch ALL template itineraries for intelligent selection
  const { data: templateItineraries } = useQuery({
    queryKey: ['travel-itinerary-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select('*')
        .is('booking_id_key', null)
        .order('day_number');
      
      if (error) throw error;
      return data as TravelItinerary[];
    },
  });

  // Generate itineraries for the booking based on templates
  const generateItinerariesMutation = useMutation({
    mutationFn: async () => {
      if (!bookingIdKey || !templateItineraries?.length) return;

      // Check if we already generated for this booking
      if (generatedRef.current.has(bookingIdKey)) return;

      // Use the improved selection algorithm
      const selectedActivities = selectActivitiesForTrip(templateItineraries, numberOfDays);
      
      const itinerariesToCreate = selectedActivities.map(activity => ({
        ...activity,
        booking_id_key: bookingIdKey,
      }));

      const { error } = await supabase
        .from('travel_itineraries')
        .insert(itinerariesToCreate);

      if (error) throw error;
      
      // Mark this booking as generated
      generatedRef.current.add(bookingIdKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travel-itineraries', bookingIdKey] });
      toast('Программа путешествия создана', {
        description: `Создан план на ${numberOfDays} ${numberOfDays === 1 ? 'день' : numberOfDays <= 4 ? 'дня' : 'дней'}`
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

  // Determine which itineraries to use - prioritize booking-specific ones
  const effectiveItineraries = bookingItineraries?.length 
    ? bookingItineraries 
    : templateItineraries?.slice(0, numberOfDays) || [];

  // Auto-generate only once if we have templates but no booking-specific itineraries
  useEffect(() => {
    if (bookingIdKey && 
        templateItineraries?.length && 
        (!bookingItineraries || bookingItineraries.length === 0) &&
        !generatedRef.current.has(bookingIdKey) &&
        !generateItinerariesMutation.isPending) {
      
      // Use setTimeout to avoid state updates during render
      const timer = setTimeout(() => {
        generateItinerariesMutation.mutate();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [bookingIdKey, templateItineraries, bookingItineraries, generateItinerariesMutation]);

  // Clear generated flag when booking changes
  useEffect(() => {
    if (bookingIdKey) {
      // Clear the ref for previous bookings but keep current one
      const currentGenerated = generatedRef.current.has(bookingIdKey);
      generatedRef.current.clear();
      if (currentGenerated) {
        generatedRef.current.add(bookingIdKey);
      }
    }
  }, [bookingIdKey]);

  return {
    itineraries: effectiveItineraries,
    isLoading,
    numberOfDays,
    updateItinerary: updateItineraryMutation.mutate,
    generateItineraries: generateItinerariesMutation.mutate,
    isGenerating: generateItinerariesMutation.isPending,
  };
};
