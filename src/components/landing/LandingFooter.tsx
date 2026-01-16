import { Link } from "react-router-dom";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">RubikInn</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/host" className="hover:text-primary transition-colors">
              Для хостов
            </Link>
            <a href="#solution" className="hover:text-primary transition-colors">
              Решение
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Цены
            </a>
            <a href="mailto:hello@rubikinn.app" className="hover:text-primary transition-colors">
              Контакты
            </a>
          </nav>

          <p className="text-sm text-muted-foreground">
            © {currentYear} RubikInn. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
