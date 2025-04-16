
import React, { useState } from "react";
import { X, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { TravelLocationType } from "./TravelLocation";

interface TravelBasketProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: number[];
  locations: TravelLocationType[];
  toggleServiceSelection: (index: number) => void;
}

const TravelBasket: React.FC<TravelBasketProps> = ({
  isOpen,
  onClose,
  selectedServices,
  locations,
  toggleServiceSelection
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price
  const calculateTotal = () => {
    return selectedServices.reduce((total, index) => {
      const price = locations[index].service.price;
      const numericPrice = parseInt(price.replace(/\\D/g, ""));
      return total + numericPrice;
    }, 0);
  };

  // Handle submission of selected services
  const handleSubmitServices = async () => {
    if (selectedServices.length === 0) {
      toast("Нет выбранных услуг", {
        description: "Пожалуйста, выберите хотя бы одну услугу."
      });
      return;
    }
    
    if (!customerName || !customerPhone) {
      toast("Заполните обязательные поля", {
        description: "Имя и телефон обязательны для заказа услуг."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare order data
    const orderData = {
      customerName,
      customerPhone,
      customerComment,
      services: selectedServices.map(index => ({
        day: locations[index].day,
        title: locations[index].service.title,
        price: locations[index].service.price
      })),
      totalPrice: `${calculateTotal()} ₽`,
      orderDate: new Date().toISOString(),
    };
    
    try {
      // In the future, this will send to a cloud database
      // For now, just simulate a successful order
      console.log("Order submitted:", orderData);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success notification
      toast("Заказ успешно отправлен", {
        description: "Мы свяжемся с вами в ближайшее время для подтверждения заказа."
      });
      
      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setCustomerComment("");
      onClose();
      
    } catch (error) {
      toast("Ошибка при отправке заказа", {
        description: "Пожалуйста, попробуйте позже."
      });
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium flex items-center">
              <ShoppingBasket className="mr-2" size={24} />
              Ваш заказ
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={16} />
            </button>
          </div>
          
          {selectedServices.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Ваша корзина пуста</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={onClose}
              >
                Выбрать услуги
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-500">Выбранные услуги</h3>
                {selectedServices.map(index => (
                  <div key={`checkout-${index}`} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <div className="font-medium">{locations[index].service.title}</div>
                      <div className="text-sm text-gray-500">{locations[index].day}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-medium mr-3">{locations[index].service.price}</div>
                      <button 
                        onClick={() => toggleServiceSelection(index)} 
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 font-medium">
                  <div>Итого:</div>
                  <div className="text-lg">{calculateTotal().toLocaleString()} ₽</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 text-gray-500">Информация для заказа</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Имя *</label>
                    <Input 
                      id="name" 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Введите ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Телефон *</label>
                    <Input 
                      id="phone" 
                      value={customerPhone} 
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium mb-1">Комментарий</label>
                    <Textarea 
                      id="comment" 
                      value={customerComment} 
                      onChange={e => setCustomerComment(e.target.value)}
                      placeholder="Дополнительная информация к заказу"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Отмена
                </Button>
                <Button 
                  className="flex-1 bg-hotel-dark text-white"
                  onClick={handleSubmitServices}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelBasket;
