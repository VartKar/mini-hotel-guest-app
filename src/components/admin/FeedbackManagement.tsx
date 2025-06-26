
import React, { useState, useEffect } from "react";
import { Star, MessageSquare, User, Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Feedback {
  id: string;
  booking_id_key: string | null;
  customer_name: string;
  room_number: string | null;
  rating: number;
  message: string | null;
  created_at: string;
}

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return;
      }

      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" />
          Отзывы гостей
        </h2>
        <Badge variant="outline">
          Всего отзывов: {feedback.length}
        </Badge>
      </div>

      {feedback.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Отзывов пока нет</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {feedback.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      <span className="font-medium">{item.customer_name}</span>
                    </div>
                    {item.room_number && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">Номер {item.room_number}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRatingColor(item.rating)}>
                      {item.rating}/5
                    </Badge>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Оценка:</span>
                    <div className="flex">{renderStars(item.rating)}</div>
                  </div>
                  {item.message && (
                    <div>
                      <span className="text-sm font-medium">Комментарий:</span>
                      <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {item.message}
                      </p>
                    </div>
                  )}
                  {item.booking_id_key && (
                    <div className="text-xs text-gray-500">
                      ID бронирования: {item.booking_id_key}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
