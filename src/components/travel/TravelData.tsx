
import React from "react";
import { Compass, MapPin, Sun } from "lucide-react";

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

// This data is now mainly used as fallback/reference
// The actual data comes from the travel_itineraries table
export const initialTravelLocations: TravelLocationType[] = [
  {
    day: "День 1",
    title: "Исторический центр",
    description: "Посещение главных достопримечательностей исторического центра города.",
    icon: <MapPin />,
    service: {
      title: "Индивидуальный гид",
      description: "Профессиональный гид с глубокими знаниями истории города. 2 часа.",
      price: "2000 ₽",
      available: true
    }
  }, 
  {
    day: "День 2",
    title: "Морская экскурсия",
    description: "Прогулка на катере вдоль живописного побережья.",
    icon: <Compass />,
    service: {
      title: "Аренда частного катера",
      description: "Комфортабельный катер с капитаном на 4 часа. Напитки включены.",
      price: "8000 ₽",
      available: true
    }
  }, 
  {
    day: "День 3",
    title: "Горный маршрут",
    description: "Поездка в горы с посещением смотровых площадок.",
    icon: <Sun />,
    service: {
      title: "Джип-тур в горы",
      description: "Полный день на джипе с опытным водителем. Обед включен.",
      price: "5500 ₽",
      available: true
    }
  }
];

// Helper function to get icon component by name
export const getIconByName = (iconName: string | null): React.ReactNode => {
  switch (iconName) {
    case 'Compass':
      return <Compass />;
    case 'Sun':
      return <Sun />;
    case 'MapPin':
    default:
      return <MapPin />;
  }
};
