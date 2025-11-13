
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
const ChatPage = lazy(() =>
  import("./pages/ChatPage").then((m) => ({ default: (m as any).default ?? (m as any) }))
);
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const HostPage = lazy(() => import("./pages/HostPage"));
const GuestPage = lazy(() => import("./pages/GuestPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache retained longer
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      retry: 1, // One retry on failure
      retryDelay: 1000, // 1 second between retries
    },
  },
});

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
              <Suspense fallback={<div>Загрузка...</div>}>
                <AdminPage />
              </Suspense>
            } />
            <Route path="/host" element={
              <Suspense fallback={<div>Загрузка...</div>}>
                <HostPage />
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
