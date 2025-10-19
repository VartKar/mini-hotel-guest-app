import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { GuestFilters } from "./GuestFilters";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  loyalty_tier: string;
  loyalty_points: number;
  total_spent: number;
  last_visit_date: string | null;
}

interface GuestsTableProps {
  guests: Guest[];
  onViewHistory: (guestId: string) => void;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Платина":
      return "bg-purple-100 text-purple-800";
    case "Золото":
      return "bg-yellow-100 text-yellow-800";
    case "Серебро":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ITEMS_PER_PAGE = 20;

export const GuestsTable = ({ guests, onViewHistory }: GuestsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loyaltyTier, setLoyaltyTier] = useState("all");
  const [sortBy, setSortBy] = useState("last_visit_desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone && guest.phone.includes(searchTerm));

    const matchesTier = loyaltyTier === "all" || guest.loyalty_tier === loyaltyTier;

    return matchesSearch && matchesTier;
  });

  // Sort guests
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    switch (sortBy) {
      case "last_visit_desc":
        return (b.last_visit_date || "").localeCompare(a.last_visit_date || "");
      case "last_visit_asc":
        return (a.last_visit_date || "").localeCompare(b.last_visit_date || "");
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "total_spent_desc":
        return b.total_spent - a.total_spent;
      case "total_spent_asc":
        return a.total_spent - b.total_spent;
      case "loyalty_points_desc":
        return b.loyalty_points - a.loyalty_points;
      case "loyalty_points_asc":
        return a.loyalty_points - b.loyalty_points;
      default:
        return 0;
    }
  });

  // Paginate
  const totalPages = Math.ceil(sortedGuests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedGuests = sortedGuests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Список гостей</h3>

      <GuestFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        loyaltyTier={loyaltyTier}
        onLoyaltyTierChange={setLoyaltyTier}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Уровень</TableHead>
              <TableHead>Бонусы</TableHead>
              <TableHead>Потрачено</TableHead>
              <TableHead>Последний визит</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGuests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  Нет данных
                </TableCell>
              </TableRow>
            ) : (
              paginatedGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.name}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTierColor(guest.loyalty_tier)}>
                      {guest.loyalty_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{guest.loyalty_points.toLocaleString("ru-RU")}</TableCell>
                  <TableCell>{guest.total_spent.toLocaleString("ru-RU")}₽</TableCell>
                  <TableCell>
                    {guest.last_visit_date
                      ? new Date(guest.last_visit_date).toLocaleDateString("ru-RU")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewHistory(guest.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      История
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Показано {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedGuests.length)} из {sortedGuests.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 text-sm">
              Страница {currentPage} из {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
