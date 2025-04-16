
import React from "react";
import { Check, PlusCircle } from "lucide-react";

export interface TravelServiceType {
  title: string;
  description: string;
  price: string;
  available: boolean;
}

export interface TravelLocationType {
  day: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  service: TravelServiceType;
}

interface TravelLocationProps {
  item: TravelLocationType;
  index: number;
  selectedServices: number[];
  showServices: boolean;
  handleLocationEdit: (index: number, field: string, value: string) => void;
  handleServiceEdit: (index: number, field: string, value: string) => void;
  toggleServiceSelection: (index: number) => void;
}

const TravelLocation: React.FC<TravelLocationProps> = ({
  item,
  index,
  selectedServices,
  showServices,
  handleLocationEdit,
  handleServiceEdit,
  toggleServiceSelection
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
          {item.icon}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center">
            <div 
              className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={e => handleLocationEdit(index, 'day', e.currentTarget.innerText)}
            >
              {item.day}
            </div>
            <span className="mx-1">:</span>
            <div 
              className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
              contentEditable 
              suppressContentEditableWarning 
              onBlur={e => handleLocationEdit(index, 'title', e.currentTarget.innerText)}
            >
              {item.title}
            </div>
          </div>
          <div 
            className="text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none" 
            contentEditable 
            suppressContentEditableWarning 
            onBlur={e => handleLocationEdit(index, 'description', e.currentTarget.innerText)}
          >
            {item.description}
          </div>
        </div>
      </div>
      
      {showServices && item.service && (
        <div className="ml-14 mt-2">
          <div className={`border rounded-lg p-3 mt-2 ${selectedServices.includes(index) ? 'border-hotel-accent bg-hotel-accent bg-opacity-10' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div 
                  className="font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
                  contentEditable 
                  suppressContentEditableWarning 
                  onBlur={e => handleServiceEdit(index, 'title', e.currentTarget.innerText)}
                >
                  {item.service.title}
                </div>
                <div 
                  className="text-sm text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none" 
                  contentEditable 
                  suppressContentEditableWarning 
                  onBlur={e => handleServiceEdit(index, 'description', e.currentTarget.innerText)}
                >
                  {item.service.description}
                </div>
                <div 
                  className="text-sm font-medium text-hotel-dark mt-1 p-1 rounded focus:bg-gray-50 focus:outline-none" 
                  contentEditable 
                  suppressContentEditableWarning 
                  onBlur={e => handleServiceEdit(index, 'price', e.currentTarget.innerText)}
                >
                  {item.service.price}
                </div>
              </div>
              <button 
                onClick={() => toggleServiceSelection(index)} 
                className={`ml-2 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${selectedServices.includes(index) ? 'bg-hotel-accent text-hotel-dark' : 'bg-gray-100 text-gray-400'}`}
              >
                {selectedServices.includes(index) ? <Check size={16} /> : <PlusCircle size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelLocation;
