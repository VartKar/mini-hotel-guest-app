import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";

const LandingHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between max-w-6xl mx-auto px-4">
        <Link to="/for-hosts" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ChillStay</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
          <a href="#solution" className="text-muted-foreground hover:text-primary transition-colors">
            Решение
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
            Как работает
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
            Цены
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button asChild size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20">
            <Link to="/">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Начать бесплатно</span>
              <span className="sm:hidden">Начать</span>
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="flex flex-col px-4 py-3 space-y-2 text-sm font-medium">
            <a 
              href="#solution" 
              className="text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Решение
            </a>
            <a 
              href="#how-it-works" 
              className="text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Как работает
            </a>
            <a 
              href="#pricing" 
              className="text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Цены
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
