
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type TableName = 'rooms' | 'bookings' | 'guests' | 'guest_sessions' | 'shop_orders' | 'travel_service_orders' | 'feedback' | 'host_change_requests' | 'hotel_services' | 'travel_services' | 'shop_items' | 'travel_itineraries';

const DatabaseManagement = () => {
  const [selectedTable, setSelectedTable] = useState<TableName>('rooms');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { uploadImage } = useImageUpload();
  const [relatedData, setRelatedData] = useState<{
    travel_services: any[];
    restaurant_recommendations: any[];
    existing_properties: { property_id: string; count: number }[];
    rooms: any[];
    guests: any[];
  }>({ travel_services: [], restaurant_recommendations: [], existing_properties: [], rooms: [], guests: [] });

  const tables = [
    { value: 'rooms', label: 'Номера' },
    { value: 'bookings', label: 'Бронирования' },
    { value: 'guests', label: 'Гости' },
    { value: 'guest_sessions', label: 'Сессии гостей' },
    { value: 'shop_orders', label: 'Заказы магазина' },
    { value: 'travel_service_orders', label: 'Заказы путешествий' },
    { value: 'feedback', label: 'Отзывы' },
    { value: 'host_change_requests', label: 'Запросы хостов' },
    { value: 'hotel_services', label: 'Услуги отеля' },
    { value: 'travel_services', label: 'Туристические услуги' },
    { value: 'shop_items', label: 'Товары магазина' },
    { value: 'travel_itineraries', label: 'Маршруты' }
  ];

  useEffect(() => {
    fetchData();
    fetchRelatedData();
  }, [selectedTable]);

  const fetchRelatedData = async () => {
    if (selectedTable === 'travel_itineraries') {
      try {
        const [servicesRes, restaurantsRes] = await Promise.all([
          supabase
            .from('travel_services')
            .select('id, title, city, base_price')
            .eq('is_active', true)
            .order('city', { ascending: true })
            .order('title', { ascending: true }),
          supabase
            .from('restaurant_recommendations')
            .select('id, name, city')
            .eq('is_active', true)
            .order('city', { ascending: true })
            .order('name', { ascending: true })
        ]);

        setRelatedData({
          travel_services: servicesRes.data || [],
          restaurant_recommendations: restaurantsRes.data || [],
          existing_properties: [],
          rooms: [],
          guests: []
        });
      } catch (error) {
        console.error('Error fetching related data:', error);
      }
    }
    
    // Fetch rooms and guests for bookings table
    if (selectedTable === 'bookings') {
      try {
        const [roomsRes, guestsRes] = await Promise.all([
          supabase
            .from('rooms')
            .select('id, room_number, apartment_name, property_id')
            .eq('is_active', true)
            .order('property_id'),
          supabase
            .from('guests')
            .select('id, name, email, phone')
            .order('name')
        ]);

        setRelatedData(prev => ({
          ...prev,
          rooms: roomsRes.data || [],
          guests: guestsRes.data || []
        }));
      } catch (error) {
        console.error('Error fetching rooms and guests:', error);
      }
    }
    
    // Fetch existing property_ids when working with rooms table
    if (selectedTable === 'rooms') {
      try {
        const { data: roomsData } = await supabase
          .from('rooms')
          .select('property_id')
          .not('property_id', 'is', null)
          .order('property_id', { ascending: true });

        if (roomsData) {
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
          
          setRelatedData(prev => ({
            ...prev,
            existing_properties: properties
          }));
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase
        .from(selectedTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (error) {
      console.error(`Error fetching ${selectedTable}:`, error);
      toast.error(`Ошибка загрузки данных из ${selectedTable}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

    try {
      const { error } = await supabase
        .from(selectedTable)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Запись удалена');
      fetchData();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Ошибка удаления записи');
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      const recordData: any = {};
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        // Handle property_id - generate new UUID if "new" is selected
        if (key === 'property_id' && value === 'new') {
          recordData[key] = crypto.randomUUID();
          continue;
        }
        
        // Handle NULL values for FK fields (travel_service_id, restaurant_id)
        if (value === 'null') {
          recordData[key] = null;
          continue;
        }
        
        if (key.startsWith('json_') && value) {
          try {
            recordData[key.replace('json_', '')] = JSON.parse(value as string);
          } catch {
            recordData[key.replace('json_', '')] = value;
          }
        } else if (key.startsWith('number_')) {
          recordData[key.replace('number_', '')] = value ? Number(value) : null;
        } else if (key.startsWith('boolean_')) {
          recordData[key.replace('boolean_', '')] = value === 'true';
        } else if (key.startsWith('date_')) {
          recordData[key.replace('date_', '')] = value ? new Date(value as string).toISOString() : null;
        } else {
          recordData[key] = value || null;
        }
      }
      
      console.log('Saving record data:', recordData);

      let result;
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from(selectedTable)
          .update({ ...recordData, updated_at: new Date().toISOString() })
          .eq('id', editingRecord.id);
        if (error) throw error;
        result = 'обновлена';
      } else {
        // Create new record
        const { error } = await supabase
          .from(selectedTable)
          .insert(recordData);
        if (error) throw error;
        result = 'создана';
      }

      toast.success(`Запись ${result}`);
      setIsDialogOpen(false);
      setEditingRecord(null);
      fetchData();
    } catch (error: any) {
      console.error('Error saving record:', error);
      console.error('Error details:', error?.message, error?.details, error?.hint);
      const errorMessage = error?.message || 'Неизвестная ошибка';
      const errorDetails = error?.details ? ` (${error.details})` : '';
      const errorHint = error?.hint ? ` Подсказка: ${error.hint}` : '';
      toast.error(`Ошибка сохранения записи: ${errorMessage}${errorDetails}${errorHint}`);
    }
  };

  const renderTableColumns = () => {
    if (data.length === 0) return [];
    
    const record = data[0];
    return Object.keys(record).filter(key => 
      !['created_at', 'updated_at'].includes(key)
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Determine bucket based on selected table
    const bucket = (selectedTable === 'travel_services' || selectedTable === 'travel_itineraries') 
      ? 'travel-services' 
      : 'shop-items';
    
    setUploadingImage(true);
    const url = await uploadImage(file, bucket);
    setUploadingImage(false);

    if (url) {
      // Update the hidden input value
      const input = document.querySelector(`input[name="${key}"]`) as HTMLInputElement;
      if (input) {
        input.value = url;
      }
      
      // Update editing record to show preview
      if (editingRecord) {
        setEditingRecord({ ...editingRecord, [key]: url });
      }
    }
  };

  const renderFormField = (key: string, value: any) => {
    // Use sample data from first row to determine type when creating new records
    const sampleValue = data[0]?.[key];
    const actualValue = value !== undefined ? value : sampleValue;
    // typeof null === 'object', so we need special handling
    const fieldType = actualValue === null ? 'null' : typeof actualValue;
    
    // Handle property_id for rooms table
    if (selectedTable === 'rooms' && key === 'property_id') {
      return (
        <div className="space-y-2">
          <Select name={key} defaultValue={value || 'new'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">✨ Создать новый отель/объект</SelectItem>
              {relatedData.existing_properties.map(p => (
                <SelectItem key={p.property_id} value={p.property_id}>
                  {p.property_id} ({p.count} {p.count === 1 ? 'комната' : 'комнат'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            <strong>Объект недвижимости</strong> объединяет несколько комнат в один отель/гостиницу. Выберите существующий объект, чтобы добавить комнату к нему, или создайте новый для отдельного отеля.
          </p>
        </div>
      );
    }
    
    // Handle travel_service_id for travel_itineraries
    if (selectedTable === 'travel_itineraries' && key === 'travel_service_id') {
      return (
        <Select name={key} defaultValue={value || 'null'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">(Без услуги)</SelectItem>
            {relatedData.travel_services.map(s => (
              <SelectItem key={s.id} value={s.id}>
                {s.title} ({s.city}) - {s.base_price} ₽
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Handle restaurant_id for travel_itineraries
    if (selectedTable === 'travel_itineraries' && key === 'restaurant_id') {
      return (
        <Select name={key} defaultValue={value || 'null'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">(Без ресторана)</SelectItem>
            {relatedData.restaurant_recommendations.map(r => (
              <SelectItem key={r.id} value={r.id}>
                {r.name} ({r.city})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Handle image_url field specially for shop_items, travel_services tables
    if (key === 'image_url' && (selectedTable === 'shop_items' || selectedTable === 'travel_services')) {
      return (
        <div className="space-y-3">
          {/* Current image preview */}
          {value && (
            <div className="relative w-32 h-32 rounded border overflow-hidden">
              <img 
                src={value} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* File upload button */}
          <label className="inline-block">
            <div className={`flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-accent transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload className="h-4 w-4" />
              <span>{uploadingImage ? 'Загрузка...' : 'Загрузить изображение'}</span>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleImageUpload(e, key)}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
          
          {/* Hidden input to store URL */}
          <input
            type="hidden"
            name={key}
            defaultValue={value || ''}
          />
          
          {/* Display current URL */}
          {value && (
            <p className="text-xs text-muted-foreground truncate">
              {value}
            </p>
          )}
        </div>
      );
    }
    
    if (key.includes('date') && !key.includes('_at')) {
      return (
        <Input
          name={`date_${key}`}
          type="date"
          defaultValue={value ? new Date(value).toISOString().split('T')[0] : ''}
          placeholder={`Введите ${key}`}
        />
      );
    }
    
    if (key.includes('comment') || key.includes('description') || key.includes('details') || key.includes('instructions') || key.includes('info')) {
      return (
        <Textarea
          name={key}
          defaultValue={value || ''}
          placeholder={`Введите ${key}`}
          className="min-h-[80px]"
        />
      );
    }
    
    if (fieldType === 'boolean') {
      // Smart defaults for new records
      let defaultValue = 'false';
      if (value !== undefined) {
        defaultValue = value.toString();
      } else if (key === 'is_active' || key === 'visible_to_guests' || key === 'visible_to_hosts' || key === 'visible_to_admin') {
        defaultValue = 'true';
      }
      
      return (
        <Select name={`boolean_${key}`} defaultValue={defaultValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Да</SelectItem>
            <SelectItem value="false">Нет</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    
    if (fieldType === 'number') {
      // Smart defaults for common fields
      let defaultValue = value;
      if (value === undefined && selectedTable === 'bookings' && key === 'number_of_guests') {
        defaultValue = 2;
      }
      
      return (
        <Input
          name={`number_${key}`}
          type="number"
          step="0.01"
          defaultValue={defaultValue !== undefined ? defaultValue : ''}
          placeholder={`Введите ${key}`}
        />
      );
    }
    
    // Check if it's a real object (not null, and is Array or Object)
    if (fieldType === 'object' && actualValue !== null && (Array.isArray(actualValue) || typeof actualValue === 'object')) {
      return (
        <Textarea
          name={`json_${key}`}
          defaultValue={JSON.stringify(actualValue, null, 2)}
          placeholder={`JSON для ${key}`}
          className="min-h-[120px] font-mono text-sm"
        />
      );
    }
    
    // Handle room_id for bookings with readable room select
    if (selectedTable === 'bookings' && key === 'room_id') {
      const rooms = relatedData?.rooms || [];
      return (
        <Select name={key} defaultValue={value || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите комнату" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {rooms.map((room: any) => (
              <SelectItem key={room.id} value={room.id}>
                Номер {room.room_number} - {room.apartment_name || room.property_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    // Handle guest_id for bookings with guest select
    if (selectedTable === 'bookings' && key === 'guest_id') {
      const guests = relatedData?.guests || [];
      return (
        <div className="space-y-2">
          <Select name={key} defaultValue={value || 'null'}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите гостя (опционально)" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="null">(Без привязки к гостю)</SelectItem>
              {guests.map((guest: any) => (
                <SelectItem key={guest.id} value={guest.id}>
                  {guest.name} - {guest.email} {guest.phone ? `(${guest.phone})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Если гостя нет в списке, добавьте его в таблице "Гости"
          </p>
        </div>
      );
    }
    
    // Handle booking_id with helper text
    if (selectedTable === 'bookings' && key === 'booking_id') {
      return (
        <div className="space-y-2">
          <Input
            name={key}
            defaultValue={value || ''}
            placeholder="Опционально: внешний номер брони (например, из Booking.com)"
          />
          <p className="text-xs text-muted-foreground">
            Внутренний ID генерируется автоматически. Это поле для номера из внешних систем бронирования.
          </p>
        </div>
      );
    }
    
    // Handle booking_status with select
    if (selectedTable === 'bookings' && key === 'booking_status') {
      return (
        <div className="space-y-2">
          <Select name={key} defaultValue={value !== undefined ? value : 'confirmed'}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Подтверждено</SelectItem>
              <SelectItem value="pending">Ожидает</SelectItem>
              <SelectItem value="cancelled">Отменено</SelectItem>
              <SelectItem value="completed">Завершено</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Статус бронирования (по умолчанию: подтверждено)
          </p>
        </div>
      );
    }
    
    // Handle stay_duration with helper
    if (selectedTable === 'bookings' && key === 'stay_duration') {
      return (
        <div className="space-y-2">
          <Input
            name={key}
            defaultValue={value || ''}
            placeholder="Например: 3 ночи, 1 неделя"
          />
          <p className="text-xs text-muted-foreground">
            Длительность пребывания в свободной форме (опционально, автозаполняется из дат)
          </p>
        </div>
      );
    }
    
    // Handle access_token with helper
    if (selectedTable === 'bookings' && key === 'access_token') {
      return (
        <div className="space-y-2">
          <Input
            name={key}
            defaultValue={value || ''}
            placeholder="Оставьте пустым для автогенерации"
          />
          <p className="text-xs text-muted-foreground">
            Токен доступа для гостя. Генерируется автоматически, если оставить пустым.
          </p>
        </div>
      );
    }
    
    // Handle notes_internal
    if (selectedTable === 'bookings' && key === 'notes_internal') {
      return (
        <div className="space-y-2">
          <Textarea
            name={key}
            defaultValue={value || ''}
            placeholder="Внутренние заметки для администрации"
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground">
            Внутренние примечания (не видны гостям)
          </p>
        </div>
      );
    }
    
    // Handle visibility flags with helper text
    if (selectedTable === 'bookings' && (key === 'visible_to_guests' || key === 'visible_to_hosts' || key === 'visible_to_admin')) {
      const defaultValue = value !== undefined ? value.toString() : 'true';
      const labels = {
        visible_to_guests: 'Видимость для гостей',
        visible_to_hosts: 'Видимость для хостов',
        visible_to_admin: 'Видимость для администраторов'
      };
      return (
        <div className="space-y-2">
          <Select name={`boolean_${key}`} defaultValue={defaultValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Да</SelectItem>
              <SelectItem value="false">Нет</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {labels[key as keyof typeof labels]} (по умолчанию: Да)
          </p>
        </div>
      );
    }
    
    // Handle is_archived
    if (selectedTable === 'bookings' && key === 'is_archived') {
      const defaultValue = value !== undefined ? value.toString() : 'false';
      return (
        <div className="space-y-2">
          <Select name={`boolean_${key}`} defaultValue={defaultValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Да</SelectItem>
              <SelectItem value="false">Нет</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Архивное бронирование (скрыто из основного списка, по умолчанию: Нет)
          </p>
        </div>
      );
    }
    
    // Handle is_default_guest
    if (selectedTable === 'bookings' && key === 'is_default_guest') {
      const defaultValue = value !== undefined ? value.toString() : 'false';
      return (
        <div className="space-y-2">
          <Select name={`boolean_${key}`} defaultValue={defaultValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Да</SelectItem>
              <SelectItem value="false">Нет</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Гость по умолчанию для демонстрации (по умолчанию: Нет)
          </p>
        </div>
      );
    }
    
    // Handle last_updated_by with helper
    if (selectedTable === 'bookings' && key === 'last_updated_by') {
      return (
        <div className="space-y-2">
          <Input
            name={key}
            defaultValue={value || ''}
            placeholder="Email пользователя"
          />
          <p className="text-xs text-muted-foreground">
            Email пользователя, который последним обновил запись (автозаполняется системой)
          </p>
        </div>
      );
    }
    
    return (
      <Input
        name={key}
        defaultValue={value || ''}
        placeholder={`Введите ${key}`}
      />
    );
  };

  const renderCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
    
    const fullValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString();
    const displayValue = fullValue.length > 50 ? fullValue.slice(0, 50) + '...' : fullValue;
    const needsTooltip = fullValue.length > 50;
    
    if (needsTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{displayValue}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-md max-h-96 overflow-auto">
              <pre className="whitespace-pre-wrap text-xs">{fullValue}</pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return displayValue;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление базой данных</h2>
        <div className="flex gap-4">
          <Select value={selectedTable} onValueChange={(value: TableName) => setSelectedTable(value)}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tables.map(table => (
                <SelectItem key={table.value} value={table.value}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingRecord(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить запись
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? 'Редактировать запись' : 'Добавить запись'}
                </DialogTitle>
                <DialogDescription>
                  {editingRecord ? 'Изменение существующей записи в таблице' : 'Создание новой записи в таблице'} {tables.find(t => t.value === selectedTable)?.label}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(new FormData(e.currentTarget));
              }} className="space-y-4">
                {data.length > 0 && Object.keys(data[0])
                  .filter(key => !['id', 'created_at', 'updated_at'].includes(key))
                  .map(key => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{key}</Label>
                      {renderFormField(key, editingRecord?.[key])}
                    </div>
                  ))}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingRecord ? 'Обновить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {tables.find(t => t.value === selectedTable)?.label} ({data.length} записей)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Загрузка...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нет данных в таблице {selectedTable}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {renderTableColumns().map(column => (
                      <TableHead key={column} className="min-w-[150px]">
                        {column}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[120px]">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((record) => (
                    <TableRow key={record.id}>
                      {renderTableColumns().map(column => (
                        <TableCell key={column} className="max-w-[250px]">
                          {renderCellValue(record[column])}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingRecord(record);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseManagement;
