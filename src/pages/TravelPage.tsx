
import React, { useState } from "react";
import { MapPin, Calendar, Sun, Compass, Send, Check, X, PlusCircle, DollarSign, CreditCard, User, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const locations = [{
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
}, {
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
}, {
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
}];

const TravelPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{
    text: string;
    isUser: boolean;
  }[]>([{
    text: "Здравствуйте! Я виртуальный помощник по путешествиям. Чем могу помочь?",
    isUser: false
  }]);

  // Make editable states for locations
  const [editableLocations, setEditableLocations] = useState(locations);
  const [showServices, setShowServices] = useState(true);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  
  // Basket state
  const [basketOpen, setBasketOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Calculate total price
  const calculateTotal = () => {
    return selectedServices.reduce((total, index) => {
      const price = editableLocations[index].service.price;
      const numericPrice = parseInt(price.replace(/\D/g, ""));
      return total + numericPrice;
    }, 0);
  };

  // Send message to webhook
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setMessages(prev => [...prev, {
      text: message,
      isUser: true
    }]);

    // Clear input field
    const userMessage = message;
    setMessage("");
    setIsLoading(true);
    try {
      const response = await fetch('https://innsight.app.n8n.cloud/webhook/6b9361f4-3386-4584-955a-c6f705176a12/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          userId: "guest_" + Date.now()
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Add bot response to chat
        setMessages(prev => [...prev, {
          text: data.response || "Извините, я не смог получить ответ.",
          isUser: false
        }]);
      } else {
        toast("Не удалось получить ответ", {
          description: "Пожалуйста, попробуйте позже."
        });
        console.error('Failed to get response from webhook');
      }
    } catch (error) {
      toast("Ошибка соединения", {
        description: "Проверьте подключение к интернету."
      });
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
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
        day: editableLocations[index].day,
        title: editableLocations[index].service.title,
        price: editableLocations[index].service.price
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
      setSelectedServices([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerComment("");
      setBasketOpen(false);
      
    } catch (error) {
      toast("Ошибка при отправке заказа", {
        description: "Пожалуйста, попробуйте позже."
      });
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="w-full max-w-md mx-auto pt-4">
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
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <Calendar className="mr-3 text-hotel-dark" size={24} />
            <h2 className="text-xl font-medium">План поездки</h2>
          </div>
          {selectedServices.length > 0 && (
            <div 
              onClick={() => setBasketOpen(true)}
              className="text-sm font-medium text-hotel-dark flex items-center cursor-pointer hover:text-hotel-accent transition-colors"
            >
              <ShoppingBasket size={18} className="mr-1" />
              Выбрано: {selectedServices.length}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {editableLocations.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-hotel-accent flex items-center justify-center text-hotel-dark">
                  {item.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <div className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
                      contentEditable 
                      suppressContentEditableWarning 
                      onBlur={e => handleLocationEdit(index, 'day', e.currentTarget.innerText)}
                    >
                      {item.day}
                    </div>
                    <span className="mx-1">:</span>
                    <div className="text-lg font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
                      contentEditable 
                      suppressContentEditableWarning 
                      onBlur={e => handleLocationEdit(index, 'title', e.currentTarget.innerText)}
                    >
                      {item.title}
                    </div>
                  </div>
                  <div className="text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none" 
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
                        <div className="font-medium p-1 rounded focus:bg-gray-50 focus:outline-none" 
                          contentEditable 
                          suppressContentEditableWarning 
                          onBlur={e => handleServiceEdit(index, 'title', e.currentTarget.innerText)}
                        >
                          {item.service.title}
                        </div>
                        <div className="text-sm text-hotel-neutral p-1 rounded focus:bg-gray-50 focus:outline-none" 
                          contentEditable 
                          suppressContentEditableWarning 
                          onBlur={e => handleServiceEdit(index, 'description', e.currentTarget.innerText)}
                        >
                          {item.service.description}
                        </div>
                        <div className="text-sm font-medium text-hotel-dark mt-1 p-1 rounded focus:bg-gray-50 focus:outline-none" 
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
          ))}
        </div>
      </div>
      
      {/* Checkout Drawer - Shows when basketOpen is true */}
      {basketOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium flex items-center">
                  <ShoppingBasket className="mr-2" size={24} />
                  Ваш заказ
                </h2>
                <button 
                  onClick={() => setBasketOpen(false)}
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
                    onClick={() => setBasketOpen(false)}
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
                          <div className="font-medium">{editableLocations[index].service.title}</div>
                          <div className="text-sm text-gray-500">{editableLocations[index].day}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="font-medium mr-3">{editableLocations[index].service.price}</div>
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
                      onClick={() => setBasketOpen(false)}
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
      )}
      
      {/* Chat component */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <h2 className="text-xl font-medium mb-4">Чат с виртуальным знатоком города!</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 h-[300px] overflow-y-auto mb-4">
          {messages.map((msg, index) => <div key={index} className={`mb-3 p-3 rounded-lg max-w-[80%] ${msg.isUser ? 'ml-auto bg-hotel-accent text-hotel-dark' : 'mr-auto bg-white border border-gray-100 text-hotel-dark'}`}>
              {msg.text}
            </div>)}
        </div>
        
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Спросите что-нибудь о вашем путешествии..." disabled={isLoading} className="flex-1" />
          <button type="submit" disabled={isLoading} className="bg-hotel-dark text-white p-2 rounded-lg flex items-center justify-center w-10 h-10">
            <Send size={20} />
          </button>
        </form>
      </div>
      
      {/* Map section */}
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
    </div>;
};

export default TravelPage;
