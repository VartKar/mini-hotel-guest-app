import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const RoomPage = lazy(() => import("./pages/RoomPage"));
const TravelPage = lazy(() => import("./pages/TravelPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const HostPage = lazy(() => import("./pages/HostPage"));
const GuestPage = lazy(() => import("./pages/GuestPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/guest/:token" element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <GuestPage />
              </Suspense>
            } />
            <Route path="/" element={<Layout />}>
              <Route index element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <Index />
                </Suspense>
              } />
              <Route path="/room" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <RoomPage />
                </Suspense>
              } />
              <Route path="/travel" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <TravelPage />
                </Suspense>
              } />
              <Route path="/services" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <ServicesPage />
                </Suspense>
              } />
              <Route path="/shop" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <ShopPage />
                </Suspense>
              } />
              <Route path="/chat" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <ChatPage />
                </Suspense>
              } />
              <Route path="/feedback" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <FeedbackPage />
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <AdminPage />
                </Suspense>
              } />
              <Route path="/host" element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <HostPage />
                </Suspense>
              } />
            </Route>
            <Route path="*" element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
