import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
        <Link to="/for-hosts" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">RubikInn</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#solution" className="text-muted-foreground hover:text-foreground transition-colors">
            Решение
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            Как работает
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Цены
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/host">Войти</Link>
          </Button>
          <Button asChild>
            <a href="#pricing">Начать бесплатно</a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
