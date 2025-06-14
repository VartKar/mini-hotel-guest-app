import React, { useState } from "react";
import { Calendar, FileText, Users, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { adminSupabase } from "@/integrations/supabase/adminClient";
import BookingsManagement from "./BookingsManagement";
import ChangeRequestsManagement from "./ChangeRequestsManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch bookings data using admin client
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      console.log('=== FETCHING DASHBOARD BOOKINGS ===');
      console.log('Using admin client for dashboard bookings');
      
      try {
        console.log('Making request to combined table...');
        
        // Test if admin client is properly configured
        const testResponse = await adminSupabase.auth.getSession();
        console.log('Admin client auth session:', testResponse);
        
        const { data, error } = await adminSupabase
          .from('combined')
          .select('*')
          .eq('is_archived', false);
        
        console.log('Dashboard bookings result:', { 
          dataCount: data?.length, 
          error: error ? {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          } : null 
        });
        
        if (error) {
          console.error('Detailed error fetching dashboard bookings:', error);
          
          // Check if it's an authentication issue
          if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
            throw new Error('Admin authentication failed. Please check the service role key configuration.');
          }
          
          throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
        }
        return data;
      } catch (err) {
        console.error('Exception in dashboard bookings fetch:', err);
        throw err;
      }
    },
    retry: 1, // Only retry once for auth errors
    retryDelay: 1000,
  });

  // Fetch change requests data using admin client
  const { data: changeRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['admin-change-requests'],
    queryFn: async () => {
      const { data, error } = await adminSupabase
        .from('host_change_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Show error if bookings failed to load
  if (bookingsError) {
    console.error('Bookings error in dashboard:', bookingsError);
  }

  const totalBookings = bookings?.length || 0;
  const pendingRequests = changeRequests?.filter(req => req.status === 'pending').length || 0;
  const confirmedBookings = bookings?.filter(booking => booking.booking_status === 'confirmed').length || 0;
  const uniqueHosts = new Set(bookings?.map(booking => booking.host_email)).size || 0;

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Building },
    { id: 'bookings', label: 'Бронирования', icon: Calendar },
    { id: 'requests', label: 'Запросы изменений', icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsManagement />;
      case 'requests':
        return <ChangeRequestsManagement />;
      default:
        return (
          <div className="space-y-6">
            {/* Show error message if bookings failed to load */}
            {bookingsError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="text-red-800">
                    <div className="font-semibold mb-2">Ошибка загрузки бронирований:</div>
                    <div className="text-sm">{bookingsError.message}</div>
                    {bookingsError.message.includes('authentication') && (
                      <div className="mt-2 text-xs text-red-600">
                        Проверьте конфигурацию ключей администратора в настройках Supabase.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.id === 'requests' && pendingRequests > 0 && (
                  <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    {pendingRequests}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default AdminDashboard;
