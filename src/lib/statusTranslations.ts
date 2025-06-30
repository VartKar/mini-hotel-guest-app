
// Status translation mappings
export const statusTranslations = {
  // Booking statuses
  pending: 'В ожидании',
  processing: 'В обработке', 
  completed: 'Выполнен',
  cancelled: 'Отменен',
  confirmed: 'Подтверждено',
  rejected: 'Отклонено',
  approved: 'Одобрено',
  demo: 'Демо',
  
  // Order statuses
  'pending': 'Ожидает',
  'processing': 'В обработке',
  'completed': 'Выполнен', 
  'cancelled': 'Отменен'
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
    case 'completed':
    case 'approved':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'processing':
      return 'secondary';
    case 'cancelled':
    case 'rejected':
      return 'destructive';
    case 'demo':
      return 'outline';
    default:
      return 'secondary';
  }
};
