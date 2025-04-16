
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoomPage from "./pages/RoomPage";
import TravelPage from "./pages/TravelPage";
import ServicesPage from "./pages/ServicesPage";
import ShopPage from "./pages/ShopPage";
import ChatPage from "./pages/ChatPage";
import PersonalAccountPage from "./pages/FeedbackPage";
import Layout from "./components/Layout";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/room" element={<Layout><RoomPage /></Layout>} />
            <Route path="/travel" element={<Layout><TravelPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
            <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
            <Route path="/feedback" element={<Layout><PersonalAccountPage /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
