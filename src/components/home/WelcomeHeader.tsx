import React from 'react';

interface WelcomeHeaderProps {
  guestName: string;
  apartmentName: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ 
  guestName, 
  apartmentName 
}) => {
  return (
    <header className="py-8 animate-fade-in">
      <h1 className="font-light mb-3 text-center text-2xl text-foreground">
        <span>Добро пожаловать, </span>
        <span className="border-b border-dashed border-border px-1">
          {guestName}
        </span>
      </h1>
      <p className="text-xl text-muted-foreground text-center">
        {apartmentName}
      </p>
    </header>
  );
};
