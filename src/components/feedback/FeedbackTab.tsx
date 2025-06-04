
import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TipForm from "./TipForm";

interface FeedbackForm {
  rating: number;
  message: string;
  submitted: boolean;
}

interface FeedbackTabProps {
  feedbackForm: FeedbackForm;
  showTipForm: boolean;
  tipAmount: string;
  setTipAmount: (amount: string) => void;
  onFeedbackSubmit: (e: React.FormEvent) => void;
  onTipSubmit: (e: React.FormEvent) => void;
  onFeedbackChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRating: (rating: number) => void;
  setShowTipForm: (show: boolean) => void;
}

const FeedbackTab = ({
  feedbackForm,
  showTipForm,
  tipAmount,
  setTipAmount,
  onFeedbackSubmit,
  onTipSubmit,
  onFeedbackChange,
  onRating,
  setShowTipForm
}: FeedbackTabProps) => {
  if (feedbackForm.submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-hotel-accent mx-auto flex items-center justify-center text-hotel-dark mb-4">
          <Star size={32} />
        </div>
        <h2 className="text-2xl font-medium mb-2">Спасибо за отзыв!</h2>
        <p className="text-hotel-neutral">
          Мы ценим ваше мнение и используем его для улучшения нашего сервиса.
        </p>
      </div>
    );
  }

  if (showTipForm) {
    return (
      <TipForm
        tipAmount={tipAmount}
        setTipAmount={setTipAmount}
        onSubmit={onTipSubmit}
        onBack={() => setShowTipForm(false)}
      />
    );
  }

  return (
    <form onSubmit={onFeedbackSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-hotel-neutral">Оценка</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRating(star)}
              className="focus:outline-none"
            >
              <Star 
                size={24} 
                className={star <= feedbackForm.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block mb-1 text-hotel-neutral">Ваш отзыв</label>
        <Textarea
          id="message"
          value={feedbackForm.message}
          onChange={onFeedbackChange}
          rows={4}
          placeholder="Расскажите о вашем опыте проживания..."
          className="w-full"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full py-2 px-4 bg-hotel-dark text-white rounded-lg font-medium"
      >
        Отправить отзыв
      </Button>
      
      {feedbackForm.rating >= 4 && (
        <Button
          type="button"
          onClick={() => setShowTipForm(true)}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
        >
          Оставить чаевые персоналу
        </Button>
      )}
    </form>
  );
};

export default FeedbackTab;
