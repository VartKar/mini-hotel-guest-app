import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Building2, UserPlus, UserMinus, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'add' | 'remove';
    userId: string;
    userEmail: string;
    role: 'admin' | 'host';
  } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('Необходима авторизация');
        return;
      }

      const response = await supabase.functions.invoke('list-users', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setUsers(response.data.users || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleAction = async () => {
    if (!confirmDialog) return;

    const { action, userId, role } = confirmDialog;
    setActionLoading(`${userId}-${role}-${action}`);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('Необходима авторизация');
        return;
      }

      const response = await supabase.functions.invoke('manage-user-role', {
        body: { action, userId, role },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      toast.success(action === 'add' ? 'Роль добавлена' : 'Роль удалена');
      fetchUsers();
    } catch (error: any) {
      console.error('Error managing role:', error);
      toast.error(error.message || 'Ошибка управления ролью');
    } finally {
      setActionLoading(null);
      setConfirmDialog(null);
    }
  };

  const openConfirmDialog = (
    action: 'add' | 'remove',
    userId: string,
    userEmail: string,
    role: 'admin' | 'host'
  ) => {
    setConfirmDialog({ open: true, action, userId, userEmail, role });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge variant="destructive" className="gap-1">
          <Shield className="w-3 h-3" />
          Админ
        </Badge>
      );
    }
    if (role === 'host') {
      return (
        <Badge variant="secondary" className="gap-1">
          <Building2 className="w-3 h-3" />
          Хост
        </Badge>
      );
    }
    return <Badge variant="outline">{role}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Управление пользователями
            </CardTitle>
            <CardDescription>
              Просмотр зарегистрированных пользователей и управление их ролями
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Нет зарегистрированных пользователей</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Роли</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead>Последний вход</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span key={role}>{getRoleBadge(role)}</span>
                        ))
                      ) : (
                        <Badge variant="outline">Пользователь</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.last_sign_in_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end flex-wrap">
                      {!user.roles.includes('admin') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirmDialog('add', user.id, user.email || '', 'admin')}
                          disabled={actionLoading !== null}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Админ
                        </Button>
                      )}
                      {user.roles.includes('admin') && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openConfirmDialog('remove', user.id, user.email || '', 'admin')}
                          disabled={actionLoading !== null}
                        >
                          <UserMinus className="w-3 h-3 mr-1" />
                          Админ
                        </Button>
                      )}
                      {!user.roles.includes('host') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openConfirmDialog('add', user.id, user.email || '', 'host')}
                          disabled={actionLoading !== null}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Хост
                        </Button>
                      )}
                      {user.roles.includes('host') && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openConfirmDialog('remove', user.id, user.email || '', 'host')}
                          disabled={actionLoading !== null}
                        >
                          <UserMinus className="w-3 h-3 mr-1" />
                          Хост
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <AlertDialog open={confirmDialog?.open} onOpenChange={(open) => !open && setConfirmDialog(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog?.action === 'add' ? 'Добавить роль?' : 'Удалить роль?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog?.action === 'add'
                  ? `Добавить роль "${confirmDialog?.role === 'admin' ? 'Админ' : 'Хост'}" для ${confirmDialog?.userEmail}?`
                  : `Удалить роль "${confirmDialog?.role === 'admin' ? 'Админ' : 'Хост'}" у ${confirmDialog?.userEmail}?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleRoleAction}>
                {confirmDialog?.action === 'add' ? 'Добавить' : 'Удалить'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
