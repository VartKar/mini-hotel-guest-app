import { Link } from "react-router-dom";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 border-t">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">RubikInn</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/host" className="hover:text-foreground transition-colors">
              Для хостов
            </Link>
            <a href="#solution" className="hover:text-foreground transition-colors">
              Решение
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Цены
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
