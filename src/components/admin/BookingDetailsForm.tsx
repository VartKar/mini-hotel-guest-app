import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AccessTokenManager from "./AccessTokenManager";

interface BookingData {
  id_key: string;
  property_id?: string;
  booking_id?: string;
  guest_name?: string;
  guest_email?: string;
  room_number?: string;
  apartment_name?: string;
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  booking_status?: string;
  host_name?: string;
  host_email?: string;
  host_phone?: string;
  host_company?: string;
  wifi_network?: string;
  wifi_password?: string;
  notes_for_guests?: string;
  notes_internal?: string;
  main_image_url?: string;
  room_image_url?: string;
  visible_to_guests?: boolean;
  visible_to_hosts?: boolean;
  visible_to_admin?: boolean;
  is_archived?: boolean;
  city?: string;
  access_token?: string;
}

interface BookingDetailsFormProps {
  booking: BookingData | null;
  isEditing: boolean;
  onSave: (booking: BookingData) => void;
  onCancel: () => void;
}

const BookingDetailsForm = ({ booking, isEditing, onSave, onCancel }: BookingDetailsFormProps) => {
  const [formData, setFormData] = useState<BookingData>({
    id_key: '',
    property_id: '',
    booking_id: '',
    guest_name: '',
    guest_email: '',
    room_number: '',
    apartment_name: '',
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 2,
    booking_status: 'confirmed',
    host_name: '',
    host_email: '',
    host_phone: '',
    host_company: '',
    wifi_network: '',
    wifi_password: '',
    notes_for_guests: '',
    notes_internal: '',
    main_image_url: '',
    room_image_url: '',
    visible_to_guests: true,
    visible_to_hosts: true,
    visible_to_admin: true,
    is_archived: false,
    city: 'Сочи',
    access_token: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    if (booking) {
      setFormData(booking);
    }
  }, [booking]);

  const handleInputChange = (field: keyof BookingData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('combined')
          .update(formData)
          .eq('id_key', formData.id_key);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('combined')
          .insert([formData]);

        if (error) throw error;
      }

      onSave(formData);
      toast({
        title: isEditing ? "Бронирование обновлено" : "Бронирование создано",
        description: "Изменения сохранены успешно",
      });
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Guest Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о госте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guest_name">Имя гостя</Label>
              <Input
                id="guest_name"
                value={formData.guest_name || ''}
                onChange={(e) => handleInputChange('guest_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="guest_email">Email гостя</Label>
              <Input
                id="guest_email"
                type="email"
                value={formData.guest_email || ''}
                onChange={(e) => handleInputChange('guest_email', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="number_of_guests">Количество гостей</Label>
              <Input
                id="number_of_guests"
                type="number"
                value={formData.number_of_guests || 2}
                onChange={(e) => handleInputChange('number_of_guests', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="check_in_date">Дата заезда</Label>
              <Input
                id="check_in_date"
                type="date"
                value={formData.check_in_date || ''}
                onChange={(e) => handleInputChange('check_in_date', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="check_out_date">Дата выезда</Label>
              <Input
                id="check_out_date"
                type="date"
                value={formData.check_out_date || ''}
                onChange={(e) => handleInputChange('check_out_date', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access Token Management */}
      {isEditing && formData.id_key && (
        <AccessTokenManager
          bookingId={formData.id_key}
          currentToken={formData.access_token}
          onTokenUpdated={(token) => handleInputChange('access_token', token)}
        />
      )}

      {/* Property Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о недвижимости</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="property_id">ID недвижимости</Label>
              <Input
                id="property_id"
                value={formData.property_id || ''}
                onChange={(e) => handleInputChange('property_id', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="booking_id">ID бронирования</Label>
              <Input
                id="booking_id"
                value={formData.booking_id || ''}
                onChange={(e) => handleInputChange('booking_id', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="room_number">Номер комнаты</Label>
              <Input
                id="room_number"
                value={formData.room_number || ''}
                onChange={(e) => handleInputChange('room_number', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="apartment_name">Название апартаментов</Label>
              <Input
                id="apartment_name"
                value={formData.apartment_name || ''}
                onChange={(e) => handleInputChange('apartment_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">Город</Label>
              <Select value={formData.city || 'Сочи'} onValueChange={(value) => handleInputChange('city', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Сочи">Сочи</SelectItem>
                  <SelectItem value="Москва">Москва</SelectItem>
                  <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="booking_status">Статус бронирования</Label>
            <Select value={formData.booking_status || 'confirmed'} onValueChange={(value) => handleInputChange('booking_status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Подтверждено</SelectItem>
                <SelectItem value="pending">В ожидании</SelectItem>
                <SelectItem value="cancelled">Отменено</SelectItem>
                <SelectItem value="completed">Завершено</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Host Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Информация о хосте</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host_name">Имя хоста</Label>
              <Input
                id="host_name"
                value={formData.host_name || ''}
                onChange={(e) => handleInputChange('host_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_email">Email хоста</Label>
              <Input
                id="host_email"
                type="email"
                value={formData.host_email || ''}
                onChange={(e) => handleInputChange('host_email', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host_phone">Телефон хоста</Label>
              <Input
                id="host_phone"
                value={formData.host_phone || ''}
                onChange={(e) => handleInputChange('host_phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="host_company">Компания хоста</Label>
              <Input
                id="host_company"
                value={formData.host_company || ''}
                onChange={(e) => handleInputChange('host_company', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WiFi and Access Card */}
      <Card>
        <CardHeader>
          <CardTitle>WiFi и доступ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wifi_network">Сеть WiFi</Label>
              <Input
                id="wifi_network"
                value={formData.wifi_network || ''}
                onChange={(e) => handleInputChange('wifi_network', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wifi_password">Пароль WiFi</Label>
              <Input
                id="wifi_password"
                value={formData.wifi_password || ''}
                onChange={(e) => handleInputChange('wifi_password', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Card */}
      <Card>
        <CardHeader>
          <CardTitle>Заметки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes_for_guests">Заметки для гостей</Label>
            <Textarea
              id="notes_for_guests"
              value={formData.notes_for_guests || ''}
              onChange={(e) => handleInputChange('notes_for_guests', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="notes_internal">Внутренние заметки</Label>
            <Textarea
              id="notes_internal"
              value={formData.notes_internal || ''}
              onChange={(e) => handleInputChange('notes_internal', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images Card */}
      <Card>
        <CardHeader>
          <CardTitle>Изображения</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="main_image_url">URL основного изображения</Label>
            <Input
              id="main_image_url"
              value={formData.main_image_url || ''}
              onChange={(e) => handleInputChange('main_image_url', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="room_image_url">URL изображения комнаты</Label>
            <Input
              id="room_image_url"
              value={formData.room_image_url || ''}
              onChange={(e) => handleInputChange('room_image_url', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Visibility Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Настройки видимости</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="visible_to_guests">Видимо для гостей</Label>
            <Switch
              id="visible_to_guests"
              checked={formData.visible_to_guests || false}
              onCheckedChange={(checked) => handleInputChange('visible_to_guests', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="visible_to_hosts">Видимо для хостов</Label>
            <Switch
              id="visible_to_hosts"
              checked={formData.visible_to_hosts || false}
              onCheckedChange={(checked) => handleInputChange('visible_to_hosts', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="visible_to_admin">Видимо для администраторов</Label>
            <Switch
              id="visible_to_admin"
              checked={formData.visible_to_admin || false}
              onCheckedChange={(checked) => handleInputChange('visible_to_admin', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="is_archived">Архивировано</Label>
            <Switch
              id="is_archived"
              checked={formData.is_archived || false}
              onCheckedChange={(checked) => handleInputChange('is_archived', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleSave}>
          {isEditing ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </div>
  );
};

export default BookingDetailsForm;
