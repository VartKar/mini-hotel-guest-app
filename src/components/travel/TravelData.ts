
import { ReactNode } from "react";
import { Compass, MapPin, Sun } from "lucide-react";
import { TravelLocationType } from "./TravelLocation";

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
