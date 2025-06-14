
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['combined']['Row'];

interface BookingDetailsFormProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  booking,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    guest_name: booking.guest_name || '',
    guest_email: booking.guest_email || '',
    room_number: booking.room_number || '',
    apartment_name: booking.apartment_name || '',
    check_in_date: booking.check_in_date || '',
    check_out_date: booking.check_out_date || '',
    booking_status: booking.booking_status || '',
    booking_id: booking.booking_id || '',
    host_name: booking.host_name || '',
    host_email: booking.host_email || '',
    host_company: booking.host_company || '',
    wifi_network: booking.wifi_network || '',
    wifi_password: booking.wifi_password || '',
    checkout_time: booking.checkout_time || '',
    ac_instructions: booking.ac_instructions || '',
    coffee_instructions: booking.coffee_instructions || '',
    tv_instructions: booking.tv_instructions || '',
    safe_instructions: booking.safe_instructions || '',
    parking_info: booking.parking_info || '',
    extra_bed_info: booking.extra_bed_info || '',
    notes_internal: booking.notes_internal || '',
    notes_for_guests: booking.notes_for_guests || '',
  });

  const updateBookingMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Updating booking with ID:', booking.id_key);
      console.log('Update data:', data);
      
      const { data: result, error } = await supabase
        .from('combined')
        .update({
          ...data,
          last_updated_at: new Date().toISOString(),
          last_updated_by: 'admin'
        })
        .eq('id_key', booking.id_key)
        .select(); // Add select to return the updated row
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Successfully updated booking:', result);
      return result;
    },
    onSuccess: (result) => {
      console.log('Mutation success with result:', result);
      toast.success('Бронирование обновлено');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast.error(`Ошибка при обновлении бронирования: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    updateBookingMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating field ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о госте</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Имя гостя</label>
            <Input
              value={formData.guest_name}
              onChange={(e) => handleInputChange('guest_name', e.target.value)}
              placeholder="Имя гостя"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email гостя</label>
            <Input
              type="email"
              value={formData.guest_email}
              onChange={(e) => handleInputChange('guest_email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Детали бронирования</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ID бронирования</label>
            <Input
              value={formData.booking_id}
              onChange={(e) => handleInputChange('booking_id', e.target.value)}
              placeholder="Booking ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Статус</label>
            <select
              value={formData.booking_status}
              onChange={(e) => handleInputChange('booking_status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="confirmed">Подтверждено</option>
              <option value="pending">Ожидает</option>
              <option value="cancelled">Отменено</option>
              <option value="demo">Демо</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Дата заезда</label>
            <Input
              value={formData.check_in_date}
              onChange={(e) => handleInputChange('check_in_date', e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Дата выезда</label>
            <Input
              value={formData.check_out_date}
              onChange={(e) => handleInputChange('check_out_date', e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Время выезда</label>
            <Input
              value={formData.checkout_time}
              onChange={(e) => handleInputChange('checkout_time', e.target.value)}
              placeholder="11:00"
            />
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об объекте</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название объекта</label>
            <Input
              value={formData.apartment_name}
              onChange={(e) => handleInputChange('apartment_name', e.target.value)}
              placeholder="Название апартаментов"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Номер комнаты</label>
            <Input
              value={formData.room_number}
              onChange={(e) => handleInputChange('room_number', e.target.value)}
              placeholder="101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">WiFi сеть</label>
            <Input
              value={formData.wifi_network}
              onChange={(e) => handleInputChange('wifi_network', e.target.value)}
              placeholder="Название WiFi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">WiFi пароль</label>
            <Input
              value={formData.wifi_password}
              onChange={(e) => handleInputChange('wifi_password', e.target.value)}
              placeholder="WiFi пароль"
            />
          </div>
        </CardContent>
      </Card>

      {/* Host Information */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о хосте</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Имя хоста</label>
            <Input
              value={formData.host_name}
              onChange={(e) => handleInputChange('host_name', e.target.value)}
              placeholder="Имя хоста"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email хоста</label>
            <Input
              type="email"
              value={formData.host_email}
              onChange={(e) => handleInputChange('host_email', e.target.value)}
              placeholder="host@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Компания хоста</label>
            <Input
              value={formData.host_company}
              onChange={(e) => handleInputChange('host_company', e.target.value)}
              placeholder="Название компании"
            />
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Инструкции для гостей</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Кондиционер</label>
            <textarea
              value={formData.ac_instructions}
              onChange={(e) => handleInputChange('ac_instructions', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Инструкции по использованию кондиционера"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Кофемашина</label>
            <textarea
              value={formData.coffee_instructions}
              onChange={(e) => handleInputChange('coffee_instructions', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Инструкции по использованию кофемашины"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Телевизор</label>
            <textarea
              value={formData.tv_instructions}
              onChange={(e) => handleInputChange('tv_instructions', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Инструкции по использованию телевизора"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Сейф</label>
            <textarea
              value={formData.safe_instructions}
              onChange={(e) => handleInputChange('safe_instructions', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Инструкции по использованию сейфа"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Парковка</label>
            <textarea
              value={formData.parking_info}
              onChange={(e) => handleInputChange('parking_info', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Информация о парковке"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Дополнительные кровати</label>
            <textarea
              value={formData.extra_bed_info}
              onChange={(e) => handleInputChange('extra_bed_info', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Информация о дополнительных кроватях"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Заметки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Внутренние заметки</label>
            <textarea
              value={formData.notes_internal}
              onChange={(e) => handleInputChange('notes_internal', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
              placeholder="Внутренние заметки (не видны гостям)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Заметки для гостей</label>
            <textarea
              value={formData.notes_for_guests}
              onChange={(e) => handleInputChange('notes_for_guests', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
              placeholder="Заметки для гостей"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={updateBookingMutation.isPending}
          className="bg-red-600 hover:bg-red-700"
        >
          {updateBookingMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  );
};

export default BookingDetailsForm;
