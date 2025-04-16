
import React from "react";
import { Calendar, ShoppingBasket } from "lucide-react";
import TravelLocation, { TravelLocationType } from "./TravelLocation";

interface TravelPlanProps {
  locations: TravelLocationType[];
  selectedServices: number[];
  showServices: boolean;
  handleLocationEdit: (index: number, field: string, value: string) => void;
  handleServiceEdit: (index: number, field: string, value: string) => void;
  toggleServiceSelection: (index: number) => void;
  openBasket: () => void;
}

const TravelPlan: React.FC<TravelPlanProps> = ({
  locations,
  selectedServices,
  showServices,
  handleLocationEdit,
  handleServiceEdit,
  toggleServiceSelection,
  openBasket
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <Calendar className="mr-3 text-hotel-dark" size={24} />
          <h2 className="text-xl font-medium">План поездки</h2>
        </div>
        {selectedServices.length > 0 && (
          <div 
            onClick={openBasket}
            className="text-sm font-medium text-hotel-dark flex items-center cursor-pointer hover:text-hotel-accent transition-colors"
          >
            <ShoppingBasket size={18} className="mr-1" />
            Выбрано: {selectedServices.length}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {locations.map((item, index) => (
          <TravelLocation
            key={index}
            item={item}
            index={index}
            selectedServices={selectedServices}
            showServices={showServices}
            handleLocationEdit={handleLocationEdit}
            handleServiceEdit={handleServiceEdit}
            toggleServiceSelection={toggleServiceSelection}
          />
        ))}
      </div>
    </div>
  );
};

export default TravelPlan;
