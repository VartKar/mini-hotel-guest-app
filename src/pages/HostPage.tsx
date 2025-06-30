import React, { useState } from "react";
import { Mail, LogOut, Loader2, Building, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { useHostData } from "@/hooks/useHostData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { translateStatus, getStatusBadgeVariant } from "@/lib/statusTranslations";

const HostPage = () => {
  const { hostData, isAuthenticated, loginWithEmail, logout, requestChange, loading, error, clearError } = useHostData();
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [requestDetails, setRequestDetails] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Введите email адрес");
      return;
    }

    setIsLoggingIn(true);
    clearError();
    
    const success = await loginWithEmail(email);
    
    if (success) {
      toast.success("Успешный вход в панель управления");
      setEmail("");
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Вы вышли из панели управления");
  };

  const handleRequestChange = async () => {
    if (!selectedBooking || !requestDetails.trim()) {
      toast.error("Заполните все поля");
      return;
    }

    setIsSubmittingRequest(true);
    
    const success = await requestChange(selectedBooking, "update_info", requestDetails);
    
    if (success) {
      toast.success("Запрос на изменение отправлен администратору");
      setRequestDetails("");
      setSelectedBooking(null);
    } else {
      toast.error("Ошибка при отправке запроса");
    }
    
    setIsSubmittingRequest(false);
  };

  const getStatusBadge = (status: string | null) => {
    return (
      <Badge variant={getStatusBadgeVariant(status)}>
        {translateStatus(status)}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto pt-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="text-center mb-6">
            <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Панель управления объектом
            </h1>
            <p className="text-gray-600">
              Войдите для управления вашими бронированиями
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="host-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email владельца объекта
              </label>
              <Input
                id="host-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLoggingIn}
              />
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoggingIn || !email.trim()}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Только для владельцев объектов недвижимости. Доступ предоставляется по email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-4 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-light">
            Панель управления - {hostData?.host_name || 'Хост'}
          </h1>
          <p className="text-gray-600 mt-1">
            {hostData?.bookings.length || 0} активных бронирований
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные бронирования
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hostData?.bookings.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Компания
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{hostData?.host_company || 'Не указано'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email хоста
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{hostData?.host_email}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список бронирований</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Гость</TableHead>
                <TableHead>Номер</TableHead>
                <TableHead>Объект</TableHead>
                <TableHead>Заезд - Выезд</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hostData?.bookings.map((booking) => (
                <TableRow key={booking.id_key}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.guest_name || 'Не указано'}</div>
                      <div className="text-sm text-gray-500">{booking.guest_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.room_number}</TableCell>
                  <TableCell>{booking.apartment_name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {booking.check_in_date} - {booking.check_out_date}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.booking_status)}
                  </TableCell>
                  <TableCell>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Запросить изменения
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Запрос на изменение</SheetTitle>
                          <SheetDescription>
                            Опишите какие изменения нужно внести в бронирование. 
                            Запрос будет отправлен администратору.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Бронирование
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium">{selectedBooking?.guest_name}</div>
                              <div className="text-sm text-gray-600">
                                {selectedBooking?.apartment_name} - {selectedBooking?.room_number}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label htmlFor="request-details" className="block text-sm font-medium mb-2">
                              Описание изменений
                            </label>
                            <Textarea
                              id="request-details"
                              value={requestDetails}
                              onChange={(e) => setRequestDetails(e.target.value)}
                              rows={4}
                              placeholder="Опишите подробно какие изменения необходимы..."
                              className="w-full"
                            />
                          </div>
                          <Button
                            onClick={handleRequestChange}
                            className="w-full"
                            disabled={isSubmittingRequest || !requestDetails.trim()}
                          >
                            {isSubmittingRequest ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Отправка...
                              </>
                            ) : (
                              'Отправить запрос'
                            )}
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(!hostData?.bookings || hostData.bookings.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Нет активных бронирований
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HostPage;
