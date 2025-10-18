import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CartAuthPrompt() {
  return (
    <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
      <p className="text-muted-foreground">
        Для оформления заказа необходимо авторизоваться
      </p>
      <Link to="/feedback">
        <Button>Перейти в личный кабинет</Button>
      </Link>
    </div>
  );
}
