
import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useRoomData } from "@/hooks/useRoomData";
import { toast } from "@/components/ui/sonner";
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
  const { roomData } = useRoomData();

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (feedbackForm.rating === 0) {
      toast.error("Пожалуйста, укажите рейтинг");
      return;
    }

    try {
      // Ensure we always have a valid customer name
      const customerName = roomData?.guest_name || 'Гость';
      
      // Store feedback in the dedicated feedback table
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          booking_id_key: roomData?.booking_id || null,
          customer_name: customerName,
          room_number: roomData?.room_number || null,
          rating: feedbackForm.rating,
          message: feedbackForm.message
        })
        .select()
        .single();

      if (error) {
        console.error('Feedback submission error:', error);
        throw error;
      }

      console.log('Feedback submitted successfully:', data);
      
      // Call the original submit handler to update UI state
      onFeedbackSubmit(e);
      
      toast.success("Спасибо за отзыв!");
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Ошибка при отправке отзыва. Попробуйте еще раз.");
    }
  };

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
    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
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
