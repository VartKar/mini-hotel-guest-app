import React from 'react';
import { Info } from 'lucide-react';

export const DemoNotice: React.FC = () => {
  return (
    <aside 
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800"
      role="note"
      aria-label="Информация о демо-режиме"
    >
      <div className="flex items-center gap-2">
        <Info size={16} className="text-blue-600 flex-shrink-0 dark:text-blue-400" />
        <div>
          <p className="text-xs text-blue-800 font-medium dark:text-blue-300">
            Просмотр демо-данных
          </p>
          <p className="text-xs text-blue-600 mt-0.5 dark:text-blue-400">
            Введите свой email в личном кабинете для персонализированной информации
          </p>
        </div>
      </div>
    </aside>
  );
};
