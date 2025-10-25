import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Loader2, MessageSquare } from "lucide-react";
import { useHostData, HostBooking } from "@/hooks/useHostData";
import { useHostAuth } from "@/hooks/useHostAuth";
import { toast } from "sonner";
import HotelServiceOrders from "@/components/host/HotelServiceOrders";
import TravelServiceOrders from "@/components/host/TravelServiceOrders";
import { HostMarketingDashboard } from "@/components/host/HostMarketingDashboard";

const HostPage = () => {
  const { isHostAuthenticated, loading: authLoading, logout: hostLogout } = useHostAuth();
  const { hostData, loading, error, requestChange } = useHostData();
  const [selectedBooking, setSelectedBooking] = useState<HostBooking | null>(null);
  const [requestType, setRequestType] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isHostAuthenticated) {
      navigate('/auth');
    }
  }, [isHostAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    await hostLogout();
    toast.success('Вы вышли из панели хоста');
    navigate('/auth');
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !requestType.trim() || !requestDetails.trim()) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    setRequestSubmitting(true);
    try {
      const success = await requestChange(selectedBooking, requestType, requestDetails);
      if (success) {
        toast.success("Запрос отправлен администратору");
        setSelectedBooking(null);
        setRequestType("");
        setRequestDetails("");
      } else {
        toast.error("Ошибка при отправке запроса");
      }
    } catch (error) {
      toast.error("Ошибка при отправке запроса");
    } finally {
      setRequestSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isHostAuthenticated) {
    return null; // Will redirect to /auth
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель хоста</h1>
          <Button onClick={handleLogout} variant="outline">
            Выйти
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Host Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Информация о хосте
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Имя</p>
                  <p className="font-medium">{hostData?.host_name || 'Не указано'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{hostData?.host_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Телефон</p>
                  <p className="font-medium">{hostData?.host_phone || 'Не указан'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Компания</p>
                  <p className="font-medium">{hostData?.host_company || 'Не указана'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Marketing Dashboard */}
          <HostMarketingDashboard hostEmail={hostData?.host_email || ""} />

          {/* Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Активные бронирования ({hostData?.bookings.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hostData?.bookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Нет активных бронирований</p>
              ) : (
                <div className="space-y-4">
                  {hostData?.bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{booking.guest_name}</h3>
                          <p className="text-sm text-gray-600">{booking.guest_email}</p>
                        </div>
                        <Badge variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.booking_status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Номер</p>
                          <p className="font-medium">{booking.room_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Заезд</p>
                          <p className="font-medium">{booking.check_in_date || 'Не указан'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Выезд</p>
                          <p className="font-medium">{booking.check_out_date || 'Не указан'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Запросить изменение
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hotel Service Orders */}
          <HotelServiceOrders hostEmail={hostData?.host_email || ''} />

          {/* Travel Service Orders */}
          <TravelServiceOrders hostEmail={hostData?.host_email || ''} />

          {/* Change Request Form */}
          {selectedBooking && (
            <Card>
              <CardHeader>
                <CardTitle>Запрос на изменение</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Бронирование:</p>
                    <p className="font-medium">{selectedBooking.guest_name} - {selectedBooking.room_number}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Тип запроса</label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Выберите тип запроса</option>
                      <option value="date_change">Изменение дат</option>
                      <option value="room_change">Смена номера</option>
                      <option value="guest_change">Изменение данных гостя</option>
                      <option value="cancellation">Отмена бронирования</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Детали запроса</label>
                    <Textarea
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      placeholder="Опишите подробно, что нужно изменить..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={requestSubmitting}
                    >
                      {requestSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Отправляем...
                        </>
                      ) : (
                        "Отправить запрос"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedBooking(null)}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostPage;
