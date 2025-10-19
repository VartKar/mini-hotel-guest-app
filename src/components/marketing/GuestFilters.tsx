import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GuestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  loyaltyTier: string;
  onLoyaltyTierChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export const GuestFilters = ({
  searchTerm,
  onSearchChange,
  loyaltyTier,
  onLoyaltyTierChange,
  sortBy,
  onSortByChange,
}: GuestFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="search">Поиск</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Имя, email или телефон..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="loyalty-tier">Уровень лояльности</Label>
        <Select value={loyaltyTier} onValueChange={onLoyaltyTierChange}>
          <SelectTrigger id="loyalty-tier">
            <SelectValue placeholder="Все уровни" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все уровни</SelectItem>
            <SelectItem value="Стандарт">Стандарт</SelectItem>
            <SelectItem value="Серебро">Серебро</SelectItem>
            <SelectItem value="Золото">Золото</SelectItem>
            <SelectItem value="Платина">Платина</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort-by">Сортировка</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Сортировать по..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_visit_desc">Последний визит (новые)</SelectItem>
            <SelectItem value="last_visit_asc">Последний визит (старые)</SelectItem>
            <SelectItem value="name_asc">Имя (А-Я)</SelectItem>
            <SelectItem value="name_desc">Имя (Я-А)</SelectItem>
            <SelectItem value="total_spent_desc">Потрачено (больше)</SelectItem>
            <SelectItem value="total_spent_asc">Потрачено (меньше)</SelectItem>
            <SelectItem value="loyalty_points_desc">Бонусы (больше)</SelectItem>
            <SelectItem value="loyalty_points_asc">Бонусы (меньше)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
