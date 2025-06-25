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
  city: string | null;
  activity_category: string | null;
  difficulty_level: string | null;
  duration_hours: number | null;
}

export interface TravelItineraryWithIcon extends TravelItinerary {
  icon: React.ReactNode;
}

// Helper function to calculate days between dates
const calculateDays = (checkIn: string | null, checkOut: string | null): number => {
  if (!checkIn || !checkOut) return 3; // Default to 3 days
  
  console.log('Calculating days between:', checkIn, 'and', checkOut);
  
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
    
    console.log('Parsed dates:', startDate, endDate);
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.log('Invalid dates, using default 3 days');
      return 3;
    }
    
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    console.log('Calculated days:', diffDays);
    
    return diffDays > 0 ? diffDays : 3;
  } catch (error) {
    console.error('Error calculating days:', error);
    return 3;
  }
};

// Helper function to select activities based on stay duration
const selectActivitiesForStay = (templates: TravelItinerary[], numberOfDays: number, city: string): TravelItinerary[] => {
  console.log('Selecting activities for city:', city, 'numberOfDays:', numberOfDays);
  
  // Filter templates by city first
  const cityTemplates = templates.filter(template => 
    template.city === city || (!template.city && city === 'Сочи') // fallback for default city
  );
  
  console.log('Found city templates:', cityTemplates.length);
  
  if (cityTemplates.length === 0) {
    console.log('No city templates found, using all templates as fallback');
    return templates.slice(0, numberOfDays); // fallback to any templates
  }
  
  // Group by activity category for variety
  const categorizedTemplates = cityTemplates.reduce((acc, template) => {
    const category = template.activity_category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, TravelItinerary[]>);
  
  const categories = Object.keys(categorizedTemplates);
  const selectedActivities: TravelItinerary[] = [];
  
  // Distribute activities across days, ensuring variety
  for (let day = 1; day <= numberOfDays; day++) {
    const categoryIndex = (day - 1) % categories.length;
    const category = categories[categoryIndex];
    const categoryTemplates = categorizedTemplates[category];
    
    if (categoryTemplates && categoryTemplates.length > 0) {
      // Select activity from this category that hasn't been used yet
      const availableActivities = categoryTemplates.filter(
        template => !selectedActivities.find(selected => selected.id === template.id)
      );
      
      const selectedTemplate = availableActivities.length > 0 
        ? availableActivities[Math.floor(Math.random() * availableActivities.length)]
        : categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
      
      // Create a copy with the correct day number
      const dayActivity = {
        ...selectedTemplate,
        day_number: day
      };
      
      selectedActivities.push(dayActivity);
    }
  }
  
  return selectedActivities;
};

export const useTravelItinerary = (bookingIdKey: string | null, checkInDate: string | null, checkOutDate: string | null, city?: string) => {
  const queryClient = useQueryClient();
  const numberOfDays = calculateDays(checkInDate, checkOutDate);
  const [selectedActivities, setSelectedActivities] = useState<TravelItinerary[]>([]);

  // Fetch template itineraries
  const { data: templateItineraries, isLoading } = useQuery({
    queryKey: ['travel-itinerary-templates'],
    queryFn: async () => {
      console.log('Fetching travel itinerary templates...');
      const { data, error } = await supabase
        .from('travel_itineraries')
        .select('*')
        .is('booking_id_key', null)
        .order('day_number');
      
      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }
      console.log('Fetched templates:', data?.length || 0);
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
      console.log('Selecting activities for target city:', targetCity);
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
