
import React, { useState } from "react";
import { Send, Star } from "lucide-react";

const FeedbackPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    roomNumber: "",
    message: "",
    rating: 0,
    submitted: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({...formState, submitted: true});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({...formState, [name]: value});
  };

  const handleRating = (rating: number) => {
    setFormState({...formState, rating});
  };

  return (
    <div className="w-full max-w-md mx-auto pt-4">
      <h1 className="text-3xl font-light mb-6">Обратная связь</h1>
      
      {formState.submitted ? (
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-hotel-accent mx-auto flex items-center justify-center text-hotel-dark mb-4">
            <Send size={32} />
          </div>
          <h2 className="text-2xl font-medium mb-2">Спасибо за отзыв!</h2>
          <p className="text-hotel-neutral">
            Мы ценим ваше мнение и используем его для улучшения нашего сервиса.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-hotel-neutral">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-hotel-accent"
              />
            </div>
            
            <div>
              <label htmlFor="roomNumber" className="block mb-1 text-hotel-neutral">Номер комнаты</label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formState.roomNumber}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-hotel-accent"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-hotel-neutral">Оценка</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className="focus:outline-none"
                  >
                    <Star 
                      size={24} 
                      className={star <= formState.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-1 text-hotel-neutral">Сообщение</label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-hotel-accent"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium"
            >
              Отправить отзыв
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
