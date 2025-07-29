
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
import GuestLinkGenerator from "./GuestLinkGenerator";
import { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  rooms: Database['public']['Tables']['rooms']['Row'];
};

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
  const [formData, setFormData] = useState({
    // Booking data
    guest_name: booking.guest_name || '',
    guest_email: booking.guest_email || '',
    guest_phone: booking.guest_phone || '',
    number_of_guests: booking.number_of_guests || 2,
    check_in_date: booking.check_in_date || '',
    check_out_date: booking.check_out_date || '',
    stay_duration: booking.stay_duration || '',
    booking_status: booking.booking_status || 'confirmed',
    access_token: booking.access_token || '',
    notes_internal: booking.notes_internal || '',
    // Room data
    room_number: booking.rooms?.room_number || '',
    apartment_name: booking.rooms?.apartment_name || '',
    property_id: booking.rooms?.property_id || '',
    city: booking.rooms?.city || '',
    host_name: booking.rooms?.host_name || '',
    host_email: booking.rooms?.host_email || '',
    host_phone: booking.rooms?.host_phone || '',
    property_manager_name: booking.rooms?.property_manager_name || '',
    property_manager_phone: booking.rooms?.property_manager_phone || '',
    property_manager_email: booking.rooms?.property_manager_email || '',
  });

  const queryClient = useQueryClient();

  const updateBookingMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      // Split the data into booking and room updates
      const bookingFields = {
        guest_name: updatedData.guest_name,
        guest_email: updatedData.guest_email,
        guest_phone: updatedData.guest_phone,
        number_of_guests: updatedData.number_of_guests,
        check_in_date: updatedData.check_in_date,
        check_out_date: updatedData.check_out_date,
        stay_duration: updatedData.stay_duration,
        booking_status: updatedData.booking_status,
        access_token: updatedData.access_token,
        notes_internal: updatedData.notes_internal,
      };

      const roomFields = {
        room_number: updatedData.room_number,
        apartment_name: updatedData.apartment_name,
        property_id: updatedData.property_id,
        city: updatedData.city,
        host_name: updatedData.host_name,
        host_email: updatedData.host_email,
        host_phone: updatedData.host_phone,
        property_manager_name: updatedData.property_manager_name,
        property_manager_phone: updatedData.property_manager_phone,
        property_manager_email: updatedData.property_manager_email,
      };

      // Update booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .update(bookingFields)
        .eq('id', booking.id);
      
      if (bookingError) throw bookingError;

      // Update room
      const { error: roomError } = await supabase
        .from('rooms')
        .update(roomFields)
        .eq('id', booking.room_id);
      
      if (roomError) throw roomError;
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

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTokenUpdate = (newToken: string) => {
    setFormData(prev => ({ ...prev, access_token: newToken }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Link Generator */}
      <GuestLinkGenerator
        bookingId={booking.id}
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
                value={formData.guest_name}
                onChange={(e) => handleInputChange('guest_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guest_email">Email гостя</Label>
              <Input
                type="email"
                id="guest_email"
                value={formData.guest_email}
                onChange={(e) => handleInputChange('guest_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guest_phone">Телефон гостя</Label>
              <Input
                type="tel"
                id="guest_phone"
                value={formData.guest_phone}
                onChange={(e) => handleInputChange('guest_phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="number_of_guests">Количество гостей</Label>
              <Input
                type="number"
                id="number_of_guests"
                value={formData.number_of_guests}
                onChange={(e) => handleInputChange('number_of_guests', parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о бронировании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="check_in_date">Дата заезда</Label>
              <Input
                type="date"
                id="check_in_date"
                value={formData.check_in_date}
                onChange={(e) => handleInputChange('check_in_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="check_out_date">Дата выезда</Label>
              <Input
                type="date"
                id="check_out_date"
                value={formData.check_out_date}
                onChange={(e) => handleInputChange('check_out_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stay_duration">Продолжительность</Label>
              <Input
                type="text"
                id="stay_duration"
                value={formData.stay_duration}
                onChange={(e) => handleInputChange('stay_duration', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="booking_status">Статус бронирования</Label>
              <Select 
                value={formData.booking_status} 
                onValueChange={(value) => handleInputChange('booking_status', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="paid">Оплачено</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes_internal">Внутренние заметки</Label>
            <Textarea
              id="notes_internal"
              value={formData.notes_internal}
              onChange={(e) => handleInputChange('notes_internal', e.target.value)}
              placeholder="Внутренние заметки для администрации"
            />
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
              <Label htmlFor="room_number">Номер комнаты</Label>
              <Input
                type="text"
                id="room_number"
                value={formData.room_number}
                onChange={(e) => handleInputChange('room_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="apartment_name">Название апартаментов</Label>
              <Input
                type="text"
                id="apartment_name"
                value={formData.apartment_name}
                onChange={(e) => handleInputChange('apartment_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property_id">ID объекта</Label>
              <Input
                type="text"
                id="property_id"
                value={formData.property_id}
                onChange={(e) => handleInputChange('property_id', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">Город</Label>
              <Input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
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
                value={formData.host_name}
                onChange={(e) => handleInputChange('host_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_email">Email хоста</Label>
              <Input
                type="email"
                id="host_email"
                value={formData.host_email}
                onChange={(e) => handleInputChange('host_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_phone">Телефон хоста</Label>
              <Input
                type="tel"
                id="host_phone"
                value={formData.host_phone}
                onChange={(e) => handleInputChange('host_phone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Manager Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о менеджере объекта</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_manager_name">Имя менеджера</Label>
              <Input
                type="text"
                id="property_manager_name"
                value={formData.property_manager_name}
                onChange={(e) => handleInputChange('property_manager_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property_manager_email">Email менеджера</Label>
              <Input
                type="email"
                id="property_manager_email"
                value={formData.property_manager_email}
                onChange={(e) => handleInputChange('property_manager_email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property_manager_phone">Телефон менеджера</Label>
              <Input
                type="tel"
                id="property_manager_phone"
                value={formData.property_manager_phone}
                onChange={(e) => handleInputChange('property_manager_phone', e.target.value)}
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
