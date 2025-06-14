
import React from "react";
import { Calendar, FileText, Users, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  // Fetch bookings data
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('combined')
        .select('*')
        .eq('is_archived', false);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch change requests data
  const { data: changeRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['admin-change-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('host_change_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const totalBookings = bookings?.length || 0;
  const pendingRequests = changeRequests?.filter(req => req.status === 'pending').length || 0;
  const confirmedBookings = bookings?.filter(booking => booking.booking_status === 'confirmed').length || 0;
  const uniqueHosts = new Set(bookings?.map(booking => booking.host_email)).size || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего бронирований
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingsLoading ? "..." : totalBookings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ожидающие запросы
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requestsLoading ? "..." : pendingRequests}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Подтвержденные
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingsLoading ? "..." : confirmedBookings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные хосты
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingsLoading ? "..." : uniqueHosts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Недавние запросы на изменения</CardTitle>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : changeRequests && changeRequests.length > 0 ? (
              <div className="space-y-3">
                {changeRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{request.host_email}</p>
                      <p className="text-xs text-gray-600 mt-1">{request.request_type}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет запросов на изменения</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние бронирования</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <p className="text-gray-500">Загрузка...</p>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id_key} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{booking.guest_name || 'Без имени'}</p>
                      <p className="text-xs text-gray-600 mt-1">{booking.apartment_name} - {booking.room_number}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.booking_status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет бронирований</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
