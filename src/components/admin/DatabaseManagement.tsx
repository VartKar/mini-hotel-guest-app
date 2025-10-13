
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";

type TableName = 'rooms' | 'bookings' | 'guest_sessions' | 'shop_orders' | 'travel_service_orders' | 'feedback' | 'host_change_requests' | 'hotel_services' | 'travel_services' | 'shop_items' | 'travel_itineraries';

const DatabaseManagement = () => {
  const [selectedTable, setSelectedTable] = useState<TableName>('rooms');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { uploadImage } = useImageUpload();

  const tables = [
    { value: 'rooms', label: 'Номера' },
    { value: 'bookings', label: 'Бронирования' },
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
  }, [selectedTable]);

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
        if (key.includes('json_') && value) {
          try {
            recordData[key.replace('json_', '')] = JSON.parse(value as string);
          } catch {
            recordData[key.replace('json_', '')] = value;
          }
        } else if (key.includes('number_')) {
          recordData[key.replace('number_', '')] = value ? Number(value) : null;
        } else if (key.includes('boolean_')) {
          recordData[key.replace('boolean_', '')] = value === 'true';
        } else if (key.includes('date_')) {
          recordData[key.replace('date_', '')] = value ? new Date(value as string).toISOString() : null;
        } else {
          recordData[key] = value || null;
        }
      }

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
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Ошибка сохранения записи');
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

    setUploadingImage(true);
    const url = await uploadImage(file);
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
    const fieldType = typeof value;
    
    // Handle image_url field specially for shop_items table
    if (key === 'image_url' && selectedTable === 'shop_items') {
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
      return (
        <Select name={`boolean_${key}`} defaultValue={value?.toString() || 'false'}>
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
      return (
        <Input
          name={`number_${key}`}
          type="number"
          step="0.01"
          defaultValue={value || ''}
          placeholder={`Введите ${key}`}
        />
      );
    }
    
    if (fieldType === 'object' && value !== null) {
      return (
        <Textarea
          name={`json_${key}`}
          defaultValue={JSON.stringify(value, null, 2)}
          placeholder={`JSON для ${key}`}
          className="min-h-[120px] font-mono text-sm"
        />
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
    if (typeof value === 'object') return JSON.stringify(value).slice(0, 50) + '...';
    if (typeof value === 'string' && value.length > 50) return value.slice(0, 50) + '...';
    return value.toString();
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
                      <TableHead key={column} className="min-w-[120px]">
                        {column}
                      </TableHead>
                    ))}
                    <TableHead className="w-[100px]">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((record) => (
                    <TableRow key={record.id}>
                      {renderTableColumns().map(column => (
                        <TableCell key={column} className="max-w-[200px] truncate">
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
