
import React from "react";
import { Bed, UtensilsCrossed, Shirt, Award } from "lucide-react";

const services = [
  {
    title: "Уборка номера",
    description: "Заказать дополнительную уборку номера или замену полотенец.",
    icon: <Bed size={24} />,
    buttonText: "Заказать"
  },
  {
    title: "Еда в номер",
    description: "Широкий выбор блюд и напитков с доставкой в ваш номер.",
    icon: <UtensilsCrossed size={24} />,
    buttonText: "Посмотреть меню"
  },
  {
    title: "Услуги прачечной",
    description: "Стирка и глажка вашей одежды в течение дня.",
    icon: <Shirt size={24} />,
    buttonText: "Заказать"
  },
  {
    title: "Специальные предложения",
    description: "Скидка 10% на спа-услуги по средам.",
    icon: <Award size={24} />,
    buttonText: "Подробнее"
  }
];

const ServicesPage = () => {
  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Сервисы</h1>
      
      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                {service.icon}
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-medium">{service.title}</h2>
                <p className="text-hotel-neutral">{service.description}</p>
              </div>
            </div>
            <button className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium">
              {service.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
