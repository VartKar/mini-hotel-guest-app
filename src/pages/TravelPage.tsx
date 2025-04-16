
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import TravelChat from "@/components/travel/TravelChat";
import TravelMap from "@/components/travel/TravelMap";
import TravelPlan from "@/components/travel/TravelPlan";
import TravelBasket from "@/components/travel/TravelBasket";
import { initialTravelLocations } from "@/components/travel/TravelData";
import { TravelLocationType } from "@/components/travel/TravelLocation";

const TravelPage = () => {
  // Make editable states for locations
  const [editableLocations, setEditableLocations] = useState<TravelLocationType[]>(initialTravelLocations);
  const [showServices, setShowServices] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  
  // Basket state
  const [basketOpen, setBasketOpen] = useState(false);

  // Handle location content edit
  const handleLocationEdit = (index: number, field: string, value: string) => {
    setEditableLocations(prev => {
      const newLocations = [...prev];
      newLocations[index] = {
        ...newLocations[index],
        [field]: value
      };
      return newLocations;
    });
  };

  // Handle service content edit
  const handleServiceEdit = (index: number, field: string, value: string) => {
    setEditableLocations(prev => {
      const newLocations = [...prev];
      if (newLocations[index]?.service) {
        newLocations[index] = {
          ...newLocations[index],
          service: {
            ...newLocations[index].service,
            [field]: value
          }
        };
      }
      return newLocations;
    });
  };

  // Toggle service visibility for admin mode
  const toggleServices = () => {
    setShowServices(!showServices);
  };

  // Toggle service selection
  const toggleServiceSelection = (index: number) => {
    setSelectedServices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
    
    toast(selectedServices.includes(index) ? 
      "Услуга удалена из выбранных" : 
      "Услуга добавлена в выбранные", {
      description: editableLocations[index].service.title
    });
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Путешествие</h1>
      
      {/* Banner with edit button and basket counter */}
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center relative" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')"
      }}>
        <div className="w-full h-full flex items-end justify-between p-4">
          <button 
            onClick={toggleServices} 
            className="bg-hotel-dark bg-opacity-80 text-white px-3 py-1 rounded-full text-xs flex items-center"
          >
            {showServices ? "Скрыть услуги" : "Показать услуги"}
          </button>
          
          {selectedServices.length > 0 && (
            <button 
              onClick={() => setBasketOpen(true)}
              className="bg-hotel-accent text-hotel-dark px-3 py-1 rounded-full text-xs flex items-center"
            >
              <ShoppingCart size={16} className="mr-1" />
              {selectedServices.length} {selectedServices.length === 1 ? 'услуга' : 
                (selectedServices.length >= 2 && selectedServices.length <= 4) ? 'услуги' : 'услуг'}
            </button>
          )}
        </div>
      </div>
      
      {/* Travel plan with optional services */}
      <TravelPlan 
        locations={editableLocations}
        selectedServices={selectedServices}
        showServices={showServices}
        handleLocationEdit={handleLocationEdit}
        handleServiceEdit={handleServiceEdit}
        toggleServiceSelection={toggleServiceSelection}
        openBasket={() => setBasketOpen(true)}
      />
      
      {/* Checkout Dialog */}
      <TravelBasket 
        isOpen={basketOpen}
        onClose={() => setBasketOpen(false)}
        selectedServices={selectedServices}
        locations={editableLocations}
        toggleServiceSelection={toggleServiceSelection}
      />
      
      {/* Chat component */}
      <TravelChat />
      
      {/* Map section */}
      <TravelMap />
    </div>
  );
};

export default TravelPage;
