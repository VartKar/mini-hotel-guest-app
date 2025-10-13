
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-hotel-light font-['Inter'] text-hotel-dark">
      {!isHomePage && (
        <header className="p-4 flex items-center">
          <Link to="/" className="text-2xl flex items-center">
            <ArrowLeft size={24} className="mr-2" />
            <span className="font-light">Назад</span>
          </Link>
        </header>
      )}
      <main className="px-4 pb-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
