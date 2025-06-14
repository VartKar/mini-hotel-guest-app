
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsManagement from "./BookingsManagement";
import ChangeRequestsManagement from "./ChangeRequestsManagement";
import TravelOrdersManagement from "./TravelOrdersManagement";
import ShopOrdersManagement from "./ShopOrdersManagement";

const AdminDashboard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="change-requests">Запросы изменений</TabsTrigger>
          <TabsTrigger value="travel-orders">Заказы путешествий</TabsTrigger>
          <TabsTrigger value="shop-orders">Заказы магазина</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="mt-6">
          <BookingsManagement />
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
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
