import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

interface MenuGridProps {
  items: MenuItem[];
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items }) => {
  return (
    <nav className="grid grid-cols-2 gap-4 mb-6" aria-label="Главное меню">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md hover-scale"
            aria-label={item.name}
          >
            <Icon size={20} strokeWidth={1.5} className="text-foreground mb-3" />
            <span className="text-center text-sm font-normal text-foreground">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
