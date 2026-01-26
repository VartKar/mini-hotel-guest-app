import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsManagement from "./BookingsManagement";
import ChangeRequestsManagement from "./ChangeRequestsManagement";
import TravelOrdersManagement from "./TravelOrdersManagement";
import ShopOrdersManagement from "./ShopOrdersManagement";
import FeedbackManagement from "./FeedbackManagement";
import DatabaseManagement from "./DatabaseManagement";
import { DefaultGuestQRCodes } from "./DefaultGuestQRCodes";
import { AdminMarketingDashboard } from "./AdminMarketingDashboard";
import { UsersManagement } from "./UsersManagement";

const AdminDashboard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      
    <Tabs defaultValue="marketing" className="w-full">
      <TabsList className="grid w-full grid-cols-9">
        <TabsTrigger value="marketing">📊 Маркетинг</TabsTrigger>
        <TabsTrigger value="users">👥 Роли</TabsTrigger>
        <TabsTrigger value="bookings">Бронирования</TabsTrigger>
        <TabsTrigger value="qr-codes">QR-коды</TabsTrigger>
        <TabsTrigger value="change-requests">Изменения</TabsTrigger>
        <TabsTrigger value="travel-orders">Экскурсии</TabsTrigger>
        <TabsTrigger value="shop-orders">Магазин</TabsTrigger>
        <TabsTrigger value="feedback">Отзывы</TabsTrigger>
        <TabsTrigger value="database">БД</TabsTrigger>
      </TabsList>
        
        <TabsContent value="marketing" className="mt-6">
          <AdminMarketingDashboard />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UsersManagement />
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingsManagement />
        </TabsContent>
        
        <TabsContent value="qr-codes" className="mt-6">
          <DefaultGuestQRCodes />
        </TabsContent>
        
        <TabsContent value="change-requests" className="mt-6">
          <ChangeRequestsManagement />
        </TabsContent>
        
        <TabsContent value="travel-orders" className="mt-6">
          <TravelOrdersManagement />
        </TabsContent>
        
        <TabsContent value="shop-orders" className="mt-6">
          <ShopOrdersManagement />
        </TabsContent>
        
        <TabsContent value="feedback" className="mt-6">
          <FeedbackManagement />
        </TabsContent>
        
        <TabsContent value="database" className="mt-6">
          <DatabaseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
