import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface RestaurantRecommendation {
  id: string;
  name: string;
  description: string | null;
  cuisine_type: string | null;
  city: string;
  category: string | null;
  image_url: string | null;
  price_range: string | null;
  partner_link: string | null;
  is_active: boolean;
  total_clicks: number;
}

export interface TravelService {
  id: string;
  title: string;
  description: string | null;
  base_price: number;
  category: string | null;
  city: string;
  difficulty_level: string | null;
  duration_hours: number | null;
  image_url: string | null;
  is_active: boolean;
}

export interface TravelItinerary {
  id: string;
  booking_id_key: string | null;
  day_number: number;
  activity_title: string;
  activity_description: string | null;
  travel_service_id: string | null;
  service_price_override: number | null;
  icon_type: string | null;
  is_service_available: boolean | null;
  created_at: string;
  updated_at: string;
  city: string | null;
  activity_category: string | null;
  restaurant_id: string | null;
  restaurant?: RestaurantRecommendation;
  service?: TravelService;
}

export interface TravelItineraryWithIcon extends TravelItinerary {
  icon: React.ReactNode;
}

// Helper function to calculate days between dates
const calculateDays = (checkIn: string | null, checkOut: string | null): number => {
  if (!checkIn || !checkOut) return 3; // Default to 3 days
  
  // Handle different date formats
  let startDate: Date;
  let endDate: Date;
  
  try {
    // Try parsing as ISO date first (YYYY-MM-DD)
    if (checkIn.includes('-') && checkIn.length >= 10) {
      startDate = new Date(checkIn);
    } else {
      // Try parsing as DD.MM.YYYY format
      const [day, month, year] = checkIn.split('.');
      startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    if (checkOut.includes('-') && checkOut.length >= 10) {
      endDate = new Date(checkOut);
    } else {
      // Try parsing as DD.MM.YYYY format
      const [day, month, year] = checkOut.split('.');
      endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 3;
    }
    
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 3;
  } catch (error) {
    console.error('Error calculating days:', error);
    return 3;
  }
};

// Helper function to select activities based on stay duration
const selectActivitiesForStay = (templates: TravelItinerary[], numberOfDays: number, city: string): TravelItinerary[] => {
  // Filter templates by city first
  const cityTemplates = templates.filter(template => 
    template.city === city || (!template.city && city === 'Сочи')
  );
  
  if (cityTemplates.length === 0) {
    return templates.slice(0, numberOfDays);
  }
  
  // Create a pool of all available activities (not yet selected)
  const availablePool = [...cityTemplates];
  const selectedActivities: TravelItinerary[] = [];
  
  // Select activities ensuring no duplicates
  for (let day = 1; day <= numberOfDays; day++) {
    if (availablePool.length === 0) {
      // If we've exhausted all unique activities, refill the pool but exclude just-used ones
      const recentIds = selectedActivities.slice(-Math.min(3, selectedActivities.length)).map(a => a.id);
      availablePool.push(...cityTemplates.filter(t => !recentIds.includes(t.id)));
      
      // If still empty (very rare), just use all templates again
      if (availablePool.length === 0) {
        availablePool.push(...cityTemplates);
      }
    }
    
    // Pick a random activity from the available pool
    const randomIndex = Math.floor(Math.random() * availablePool.length);
    const selectedTemplate = availablePool[randomIndex];
    
    // Remove from pool to ensure uniqueness
    availablePool.splice(randomIndex, 1);
    
    // Add to selected with correct day number
    selectedActivities.push({
      ...selectedTemplate,
      day_number: day
    });
  }
  
  return selectedActivities;
};

export const useTravelItinerary = (bookingIdKey: string | null, checkInDate: string | null, checkOutDate: string | null, city?: string) => {
  const queryClient = useQueryClient();
  const numberOfDays = calculateDays(checkInDate, checkOutDate);
  const [selectedActivities, setSelectedActivities] = useState<TravelItinerary[]>([]);

  // Fetch template itineraries with restaurant data
  const { data: templateItineraries, isLoading } = useQuery({
    queryKey: ['travel-itinerary-templates'],
    staleTime: 10 * 60 * 1000, // 10 minutes (rarely changes)
    gcTime: 15 * 60 * 1000,    // 15 minutes
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select(`
          *,
          restaurant:restaurant_recommendations(*),
          service:travel_services(*)
        `)
        .is('booking_id_key', null)
        .order('day_number');
      
      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }
      return data as TravelItinerary[];
    },
  });

  // Update itinerary (for editing content)
  const updateItineraryMutation = useMutation({
    mutationFn: async ({ activityIndex, updates }: { activityIndex: number; updates: Partial<TravelItinerary> }) => {
      setSelectedActivities(prev => {
        const newActivities = [...prev];
        newActivities[activityIndex] = { ...newActivities[activityIndex], ...updates };
        return newActivities;
      });
    },
    onSuccess: () => {
      toast('Изменения сохранены локально', {
        description: 'Обновления применены к плану поездки'
      });
    },
  });

  // Select activities when templates are loaded or parameters change
  useEffect(() => {
    if (templateItineraries && templateItineraries.length > 0) {
      const targetCity = city || 'Сочи'; // Use provided city or default to Сочи
      const activities = selectActivitiesForStay(templateItineraries, numberOfDays, targetCity);
      setSelectedActivities(activities);
    }
  }, [templateItineraries, numberOfDays, city]);

  return {
    itineraries: selectedActivities,
    isLoading,
    numberOfDays,
    updateItinerary: (params: { id: string; updates: Partial<TravelItinerary> }) => {
      // Find the activity by its original template id and update it
      const activityIndex = selectedActivities.findIndex(activity => activity.id === params.id);
      if (activityIndex !== -1) {
        updateItineraryMutation.mutate({ activityIndex, updates: params.updates });
      }
    },
    isGenerating: false, // No more complex generation needed
  };
};
