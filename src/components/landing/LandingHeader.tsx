import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
        <Link to="/for-hosts" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">R</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RubikInn</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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

        <div className="flex items-center space-x-3">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/host">Войти</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20">
            <a href="#pricing">
              <Sparkles className="mr-2 h-4 w-4" />
              Начать бесплатно
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
