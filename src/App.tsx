import React from "react";
import Index from "./pages/Index";
import RoomPage from "./pages/RoomPage";
import TravelPage from "./pages/TravelPage";
import ServicesPage from "./pages/ServicesPage";
import ShopPage from "./pages/ShopPage";
import FeedbackPage from "./pages/FeedbackPage";
import ChatPage from "./pages/ChatPage";
import AdminPage from "./pages/AdminPage";
import HostPage from "./pages/HostPage";
import GuestPage from "./pages/GuestPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomAccessPage from "@/pages/RoomAccessPage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/room" element={<Layout><RoomPage /></Layout>} />
          <Route path="/travel" element={<Layout><TravelPage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
          <Route path="/feedback" element={<Layout><FeedbackPage /></Layout>} />
          <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/guest/:token" element={<GuestPage />} />
          <Route path="/room/:token" element={<RoomAccessPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
