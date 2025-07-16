import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import GuestLinkGenerator from "./GuestLinkGenerator";

type Booking = Database['public']['Tables']['combined']['Row'];

interface BookingDetailsFormProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  booking,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState(booking);
  const queryClient = useQueryClient();

  const updateBookingMutation = useMutation({
    mutationFn: async (updatedData: Partial<Booking>) => {
      const { error } = await supabase
        .from('combined')
        .update(updatedData)
        .eq('id_key', booking.id_key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
      toast.success('Бронирование обновлено');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast.error('Ошибка при обновлении бронирования');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof Booking, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTokenUpdate = (newToken: string) => {
    setFormData(prev => ({ ...prev, access_token: newToken }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Link Generator */}
      <GuestLinkGenerator
        bookingId={booking.id_key}
        currentToken={formData.access_token}
        onTokenUpdate={handleTokenUpdate}
      />

      {/* Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о госте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guest_name">Имя гостя</Label>
              <Input
                type="text"
                id="guest_name"
                value={formData.guest_name || ''}
                onChange={(e) => handleInputChange('guest_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guest_email">Email гостя</Label>
              <Input
                type="email"
                id="guest_email"
                value={formData.guest_email || ''}
                onChange={(e) => handleInputChange('guest_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="number_of_guests">Количество гостей</Label>
              <Input
                type="number"
                id="number_of_guests"
                value={formData.number_of_guests || ''}
                onChange={(e) => handleInputChange('number_of_guests', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об объекте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apartment_name">Название апартаментов</Label>
              <Input
                type="text"
                id="apartment_name"
                value={formData.apartment_name || ''}
                onChange={(e) => handleInputChange('apartment_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="room_number">Номер комнаты</Label>
              <Input
                type="text"
                id="room_number"
                value={formData.room_number || ''}
                onChange={(e) => handleInputChange('room_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="check_in_date">Дата заезда</Label>
              <Input
                type="date"
                id="check_in_date"
                value={formData.check_in_date || ''}
                onChange={(e) => handleInputChange('check_in_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="check_out_date">Дата выезда</Label>
              <Input
                type="date"
                id="check_out_date"
                value={formData.check_out_date || ''}
                onChange={(e) => handleInputChange('check_out_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="booking_status">Статус бронирования</Label>
              <Select onValueChange={(value) => handleInputChange('booking_status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите статус" defaultValue={formData.booking_status || ''} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="paid">Оплачено</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Host Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о хосте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host_name">Имя хоста</Label>
              <Input
                type="text"
                id="host_name"
                value={formData.host_name || ''}
                onChange={(e) => handleInputChange('host_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_email">Email хоста</Label>
              <Input
                type="email"
                id="host_email"
                value={formData.host_email || ''}
                onChange={(e) => handleInputChange('host_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_phone">Телефон хоста</Label>
              <Input
                type="tel"
                id="host_phone"
                value={formData.host_phone || ''}
                onChange={(e) => handleInputChange('host_phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_company">Компания хоста</Label>
              <Input
                type="text"
                id="host_company"
                value={formData.host_company || ''}
                onChange={(e) => handleInputChange('host_company', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit" disabled={updateBookingMutation.isPending}>
          {updateBookingMutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
};

export default BookingDetailsForm;
