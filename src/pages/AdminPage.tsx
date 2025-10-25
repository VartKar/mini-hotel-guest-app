import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminPage = () => {
  const { isAdminAuthenticated, loading, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdminAuthenticated) {
      navigate('/auth');
    }
  }, [isAdminAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Вы вышли из панели администратора');
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return null; // Will redirect to /auth
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-light flex items-center">
            <Shield className="w-8 h-8 mr-3 text-red-600" />
            Панель администратора
          </h1>
          <p className="text-gray-600 mt-1">
            Управление бронированиями и запросами хостов
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
