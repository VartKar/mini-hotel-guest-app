
import React, { useState } from "react";
import { FileText, Check, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChangeRequest {
  id: string;
  host_email: string;
  property_id: string | null;
  booking_id: string | null;
  request_type: string;
  request_details: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ChangeRequestsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  // Fetch change requests
  const { data: changeRequests, isLoading } = useQuery({
    queryKey: ['admin-change-requests-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('host_change_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ChangeRequest[];
    },
  });

  // Update request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      const { error } = await supabase
        .from('host_change_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-change-requests-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-change-requests'] });
      const statusText = variables.status === 'approved' ? 'одобрен' : 'отклонен';
      toast.success(`Запрос ${statusText}`);
    },
    onError: (error) => {
      console.error('Error updating request status:', error);
      toast.error('Ошибка при обновлении статуса запроса');
    },
  });

  // Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('host_change_requests')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-change-requests-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-change-requests'] });
      toast.success('Запрос удален');
    },
    onError: (error) => {
      console.error('Error deleting request:', error);
      toast.error('Ошибка при удалении запроса');
    },
  });

  // Filter requests
  const filteredRequests = changeRequests?.filter(request => {
    const matchesSearch = !searchTerm || 
      request.host_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.booking_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleApprove = (requestId: string) => {
    updateStatusMutation.mutate({ requestId, status: 'approved' });
  };

  const handleReject = (requestId: string) => {
    updateStatusMutation.mutate({ requestId, status: 'rejected' });
  };

  const handleDelete = (requestId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот запрос?')) {
      deleteRequestMutation.mutate(requestId);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка запросов...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Управление запросами на изменения
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по email хоста, типу запроса, деталям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидает</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-4 text-sm text-gray-600">
            Найдено запросов: {filteredRequests.length}
          </div>

          {/* Requests Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Хост</TableHead>
                  <TableHead>Тип запроса</TableHead>
                  <TableHead>Детали</TableHead>
                  <TableHead>Бронирование</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">{request.host_email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{request.request_type}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={request.request_details}>
                        {request.request_details}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>ID: {request.booking_id || '-'}</div>
                        <div className="text-gray-500">Объект: {request.property_id || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(request.created_at)}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                        {request.status || 'pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(request.id)}
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

          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Запросы не найдены
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeRequestsManagement;
