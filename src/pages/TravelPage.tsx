
import React from "react";
import { MapPin, Calendar, Sun, Compass } from "lucide-react";

const locations = [
  {
    day: "День 1",
    title: "Исторический центр",
    description: "Посещение главных достопримечательностей исторического центра города.",
    icon: <MapPin />
  },
  {
    day: "День 2",
    title: "Морская экскурсия",
    description: "Прогулка на катере вдоль живописного побережья.",
    icon: <Compass />
  },
  {
    day: "День 3",
    title: "Горный маршрут",
    description: "Поездка в горы с посещением смотровых площадок.",
    icon: <Sun />
  }
];

const TravelPage = () => {
  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Путешествие</h1>
      
      <div className="w-full h-48 mb-6 rounded-lg bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-4">
          <Calendar className="mr-3 text-hotel-dark" size={24} />
          <h2 className="text-xl font-medium">План поездки</h2>
        </div>
        
        <div className="space-y-6">
          {locations.map((item, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {item.icon}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium">{item.day}: {item.title}</h3>
                <p className="text-hotel-neutral">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-medium mb-4">Карта города</h2>
        <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
          <MapPin size={32} className="text-hotel-dark opacity-50" />
        </div>
        <p className="text-sm text-hotel-neutral">
          Для получения персональных рекомендаций по достопримечательностям и активностям, 
          пожалуйста, обратитесь к нашему консьержу через чат.
        </p>
      </div>
    </div>
  );
};

export default TravelPage;
