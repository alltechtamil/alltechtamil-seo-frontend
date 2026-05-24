import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats an ISO date string into a highly readable format (e.g., "Oct 24, 2024").
 * Includes robust fallback handling for invalid or null dates.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Just now';

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Just now';
    
    // Format: "Oct 24, 2024"
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Just now';
  }
}
