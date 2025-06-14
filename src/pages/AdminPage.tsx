
import React, { useState } from "react";
import { Shield, LogOut, Loader2, Calendar, FileText, Users, Building } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminPage = () => {
  const { isAdminAuthenticated, loginAsAdmin, logoutAdmin, loading, error, clearError } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Введите email адрес");
      return;
    }

    setIsLoggingIn(true);
    clearError();
    
    const success = await loginAsAdmin(email);
    
    if (success) {
      toast.success("Успешный вход в панель администратора");
      setEmail("");
    }
    
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Вы вышли из панели администратора");
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto pt-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Панель администратора
            </h1>
            <p className="text-gray-600">
              Войдите для управления бронированиями и запросами хостов
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email администратора
              </label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLoggingIn}
              />
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoggingIn || !email.trim()}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти как администратор'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Только для администраторов системы. Доступ ограничен.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pt-4 px-4">
      {/* Header */}
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
