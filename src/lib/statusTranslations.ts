
// Status translation mappings
export const statusTranslations = {
  // Booking statuses
  confirmed: 'Подтверждено',
  paid: 'Оплачено',
  completed: 'Завершено'
} as const;

// Reverse mapping for API calls (if needed)
export const reverseStatusTranslations = Object.fromEntries(
  Object.entries(statusTranslations).map(([key, value]) => [value, key])
) as Record<string, keyof typeof statusTranslations>;

// Utility function to translate status
export const translateStatus = (status: string | null | undefined): string => {
  if (!status) return 'Неизвестно';
  return statusTranslations[status as keyof typeof statusTranslations] || status;
};

// Utility function to get status badge variant
export const getStatusBadgeVariant = (status: string | null | undefined) => {
  if (!status) return 'secondary';
  
  switch (status) {
    case 'confirmed':
      return 'secondary';
    case 'paid':
      return 'default';
    case 'completed':
      return 'outline';
    default:
      return 'secondary';
  }
};
