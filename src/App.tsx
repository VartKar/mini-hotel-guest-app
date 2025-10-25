
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
const AuthPage = lazy(() => import("./pages/AuthPage"));
const HostRegisterPage = lazy(() => import("./pages/HostRegisterPage"));
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
            <Route path="/" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <Index />
                </Suspense>
              </Layout>
            } />
            <Route path="/room" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <RoomPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/travel" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <TravelPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/services" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <ServicesPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/shop" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <ShopPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/chat" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <ChatPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/feedback" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <FeedbackPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/admin" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <AdminPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/host" element={
              <Layout>
                <Suspense fallback={<div>Загрузка...</div>}>
                  <HostPage />
                </Suspense>
              </Layout>
            } />
            <Route path="/auth" element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <AuthPage />
              </Suspense>
            } />
            <Route path="/host-register" element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <HostRegisterPage />
              </Suspense>
            } />
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
