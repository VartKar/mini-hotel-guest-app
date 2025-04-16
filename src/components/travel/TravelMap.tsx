
import React from "react";
import { MapPin } from "lucide-react";

const TravelMap: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-medium mb-4">Карта города</h2>
      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
        <MapPin size={32} className="text-hotel-dark opacity-50" />
      </div>
      <p className="text-sm text-hotel-neutral" contentEditable suppressContentEditableWarning>
        Для получения персональных рекомендаций по достопримечательностям и активностям, 
        пожалуйста, обратитесь к нашему консьержу через чат.
      </p>
    </div>
  );
};

export default TravelMap;
