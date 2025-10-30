import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface HotelImageCardProps {
  imageUrl: string;
  isLoading: boolean;
  hasError: boolean;
  onLoad: () => void;
  onError: () => void;
  defaultImage: string;
}

export const HotelImageCard: React.FC<HotelImageCardProps> = ({
  imageUrl,
  isLoading,
  hasError,
  onLoad,
  onError,
  defaultImage
}) => {
  return (
    <section className="w-full h-56 mb-8 rounded-lg overflow-hidden bg-muted relative shadow-sm">
      {isLoading && <Skeleton className="w-full h-full" />}
      
      {!isLoading && !hasError && (
        <img
          src={imageUrl}
          alt="Фото апартаментов"
          className="object-cover w-full h-full animate-fade-in"
          loading="lazy"
          onLoad={onLoad}
          onError={onError}
        />
      )}
      
      {!isLoading && hasError && (
        <div className="w-full h-full bg-muted flex flex-col justify-center items-center">
          <span className="text-muted-foreground text-xs">
            Ошибка загрузки изображения
          </span>
          <img
            src={defaultImage}
            alt="Фото по умолчанию"
            className="w-20 h-20 opacity-40 mt-2"
            draggable={false}
          />
        </div>
      )}
    </section>
  );
};
