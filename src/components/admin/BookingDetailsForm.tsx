
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GuestLinkGenerator from "./GuestLinkGenerator";
import { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  rooms: Database['public']['Tables']['rooms']['Row'];
};

type Room = Database['public']['Tables']['rooms']['Row'];

interface BookingDetailsFormProps {
  mode: 'create' | 'edit';
  booking?: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  mode,
  booking,
  onClose,
  onSuccess
}) => {
  const [existingProperties, setExistingProperties] = useState<{ property_id: string; count: number }[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(booking?.room_id || '');
  const [existingGuest, setExistingGuest] = useState<any | null>(null);
  const [isSearchingGuest, setIsSearchingGuest] = useState(false);
  
  // Generate dummy default values for create mode
  const getDefaultValues = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      guest_name: 'Иван Иванов',
      guest_email: 'guest@example.com',
      guest_phone: '+7 (999) 123-45-67',
      number_of_guests: 2,
      check_in_date: tomorrow.toISOString().split('T')[0],
      check_out_date: nextWeek.toISOString().split('T')[0],
      stay_duration: '6 ночей',
      booking_status: 'confirmed',
      access_token: mode === 'create' ? crypto.randomUUID().substring(0, 16) : '',
      notes_internal: '',
      room_number: '101',
      apartment_name: 'Стандартный номер',
      property_id: '',
      city: 'Сочи',
      host_name: 'Иван Петров',
      host_email: 'host@example.com',
      host_phone: '+7 (999) 888-77-66',
      property_manager_name: 'Мария Сидорова',
      property_manager_phone: '+7 (999) 777-66-55',
      property_manager_email: 'manager@example.com',
    };
  };

  const [formData, setFormData] = useState(() => {
    if (mode === 'edit' && booking) {
      return {
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
      };
    }
    return getDefaultValues();
  });

  const queryClient = useQueryClient();

  // Fetch existing properties and rooms on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('*')
          .eq('is_active', true)
          .order('property_id', { ascending: true });

        if (roomsData) {
          setAvailableRooms(roomsData);
          
          // Group by property_id and count rooms
          const propertyMap = roomsData.reduce((acc: any, room: any) => {
            const propId = room.property_id;
            if (!acc[propId]) {
              acc[propId] = { property_id: propId, count: 0 };
            }
            acc[propId].count++;
            return acc;
          }, {});

          const properties = Object.values(propertyMap) as { property_id: string; count: number }[];
          setExistingProperties(properties);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Search for existing guest by email (debounced)
  useEffect(() => {
    if (mode !== "create") return; // Only search when creating new bookings
    
    const timer = setTimeout(async () => {
      const email = formData.guest_email?.trim();
      
      if (!email || !email.includes('@')) {
        setExistingGuest(null);
        return;
      }

      setIsSearchingGuest(true);
      
      try {
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .ilike('email', email)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setExistingGuest(data);
          // Auto-fill fields from existing guest
          setFormData(prev => ({
            ...prev,
            guest_name: data.name,
            guest_phone: data.phone || prev.guest_phone,
          }));
        } else {
          setExistingGuest(null);
        }
      } catch (error) {
        console.error("Error searching guest:", error);
      } finally {
        setIsSearchingGuest(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [formData.guest_email, mode]);

  const saveMutation = useMutation({
    mutationFn: async (updatedData: typeof formData) => {
      if (mode === 'create') {
        // Create mode: check if room is selected, create/find guest, create booking
        if (!selectedRoomId) {
          throw new Error('Необходимо выбрать комнату');
        }

        // Check if guest exists by email
        const { data: existingGuest } = await supabase
          .from('guests')
          .select('id')
          .ilike('email', updatedData.guest_email.trim())
          .maybeSingle();

        let guestId = existingGuest?.id;

        // Create guest if doesn't exist
        if (!guestId) {
          const { data: newGuest, error: guestError } = await supabase
            .from('guests')
            .insert({
              name: updatedData.guest_name,
              email: updatedData.guest_email.trim(),
              phone: updatedData.guest_phone,
              guest_type: 'direct',
            })
            .select()
            .single();

          if (guestError) throw guestError;
          guestId = newGuest.id;
        }

        // Create booking
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert({
            room_id: selectedRoomId,
            guest_id: guestId,
            guest_name: updatedData.guest_name,
            guest_email: updatedData.guest_email.trim(),
            guest_phone: updatedData.guest_phone,
            number_of_guests: updatedData.number_of_guests,
            check_in_date: updatedData.check_in_date || null,
            check_out_date: updatedData.check_out_date || null,
            stay_duration: updatedData.stay_duration,
            booking_status: updatedData.booking_status,
            access_token: updatedData.access_token,
            notes_internal: updatedData.notes_internal,
            booking_id: crypto.randomUUID(),
          });

        if (bookingError) throw bookingError;
      } else {
        // Edit mode: update booking and room
        if (!booking) throw new Error('No booking to update');

        const bookingFields = {
          guest_name: updatedData.guest_name,
          guest_email: updatedData.guest_email,
          guest_phone: updatedData.guest_phone,
          number_of_guests: updatedData.number_of_guests,
          check_in_date: updatedData.check_in_date || null,
          check_out_date: updatedData.check_out_date || null,
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

        const { error: bookingError } = await supabase
          .from('bookings')
          .update(bookingFields)
          .eq('id', booking.id);
        
        if (bookingError) throw bookingError;

        const { error: roomError } = await supabase
          .from('rooms')
          .update(roomFields)
          .eq('id', booking.room_id);
        
        if (roomError) throw roomError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
      toast.success(mode === 'create' ? 'Бронирование создано' : 'Бронирование обновлено');
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error saving booking:', error);
      toast.error(error.message || 'Ошибка при сохранении бронирования');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.guest_name || !formData.guest_email) {
      toast.error('Имя и email гостя обязательны');
      return;
    }
    
    if (mode === 'create' && !selectedRoomId) {
      toast.error('Необходимо выбрать комнату');
      return;
    }
    
    saveMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTokenUpdate = (newToken: string) => {
    setFormData(prev => ({ ...prev, access_token: newToken }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Selection (Create Mode Only) */}
      {mode === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Выбор комнаты</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="room_select">Комната *</Label>
            <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите комнату" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.apartment_name} - Комната {room.room_number} ({room.property_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Выберите существующую комнату для бронирования
            </p>
          </CardContent>
        </Card>
      )}

      {/* Guest Link Generator (Edit Mode Only) */}
      {mode === 'edit' && booking && (
        <GuestLinkGenerator
          bookingId={booking.id}
          currentToken={formData.access_token}
          onTokenUpdate={handleTokenUpdate}
        />
      )}

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
              <div className="relative">
                <Input
                  type="email"
                  id="guest_email"
                  value={formData.guest_email}
                  onChange={(e) => handleInputChange('guest_email', e.target.value)}
                />
                {isSearchingGuest && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
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

          {/* Existing Guest Card */}
          {existingGuest && mode === "create" && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">✅ Гость найден в программе лояльности</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">💎 Уровень:</span>
                      <Badge variant={
                        existingGuest.loyalty_tier === 'Платина' ? 'default' :
                        existingGuest.loyalty_tier === 'Золото' ? 'secondary' :
                        existingGuest.loyalty_tier === 'Серебро' ? 'outline' : 'secondary'
                      }>
                        {existingGuest.loyalty_tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">🎁 Баллы:</span>
                      <span className="font-medium">{existingGuest.loyalty_points?.toLocaleString('ru-RU') || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">💰 Потрачено:</span>
                      <span className="font-medium">{existingGuest.total_spent?.toLocaleString('ru-RU') || 0} ₽</span>
                    </div>
                    {existingGuest.last_visit_date && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">📅 Последний визит:</span>
                        <span>{new Date(existingGuest.last_visit_date).toLocaleDateString('ru-RU')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
              <Label htmlFor="property_id">Объект недвижимости (Отель)</Label>
              <Select 
                value={formData.property_id} 
                onValueChange={(value) => {
                  const finalValue = value === 'new' ? crypto.randomUUID() : value;
                  handleInputChange('property_id', finalValue);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите объект" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">✨ Создать новый отель/объект</SelectItem>
                  {existingProperties.map(p => (
                    <SelectItem key={p.property_id} value={p.property_id}>
                      {p.property_id} ({p.count} {p.count === 1 ? 'комната' : 'комнат'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Объект объединяет несколько комнат в один отель. Выберите существующий для добавления комнаты или создайте новый для отдельного отеля.
              </p>
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
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Сохранение...' : (mode === 'create' ? 'Создать' : 'Сохранить')}
        </Button>
      </div>
    </form>
  );
};

export default BookingDetailsForm;
