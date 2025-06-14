
import React, { useState } from "react";
import { Calendar, Search, Filter, Edit, Trash2, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BookingDetailsForm from "./BookingDetailsForm";
import { Database } from "@/integrations/supabase/types";

type Booking = Database['public']['Tables']['combined']['Row'];

const BookingsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-all-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .order('last_updated_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
  });

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('combined')
        .delete()
        .eq('id_key', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
      toast.success('Бронирование удалено');
    },
    onError: (error) => {
      console.error('Error deleting booking:', error);
      toast.error('Ошибка при удалении бронирования');
    },
  });

  // Filter bookings based on search term and status
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.apartment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || booking.booking_status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('Вы уверены, что хотите удалить это бронирование?')) {
      deleteBookingMutation.mutate(bookingId);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка бронирований...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Управление бронированиями
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по имени, email, номеру комнаты, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="confirmed">Подтверждено</option>
                <option value="pending">Ожидает</option>
                <option value="cancelled">Отменено</option>
                <option value="demo">Демо</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Найдено бронирований: {filteredBookings.length}
          </div>

          {/* Bookings Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гость</TableHead>
                  <TableHead>Объект</TableHead>
                  <TableHead>Даты</TableHead>
                  <TableHead>Хост</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id_key}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.guest_name || 'Без имени'}</div>
                        <div className="text-sm text-gray-500">{booking.guest_email}</div>
                        <div className="text-xs text-gray-400">ID: {booking.booking_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.apartment_name}</div>
                        <div className="text-sm text-gray-500">Комната: {booking.room_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Заезд: {booking.check_in_date}</div>
                        <div>Выезд: {booking.check_out_date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.host_name}</div>
                        <div className="text-sm text-gray-500">{booking.host_email}</div>
                        <div className="text-xs text-gray-400">{booking.host_company}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.booking_status)}`}>
                        {booking.booking_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBooking(booking.id_key)}
                          className="text-red-600 hover:text-red-700"
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

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Бронирования не найдены
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать бронирование</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <BookingDetailsForm
              booking={selectedBooking}
              onClose={() => setIsEditDialogOpen(false)}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ['admin-all-bookings'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsManagement;
