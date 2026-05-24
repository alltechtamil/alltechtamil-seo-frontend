/**
 * Formats a read time (in minutes or seconds) into a human-readable string.
 * @param minutes - The estimated read time in minutes.
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadTime(minutes: number | null | undefined): string {
  if (typeof minutes !== 'number' || minutes <= 0) {
    return '1 min read';
  }
  
  // Round to nearest whole number
  const rounded = Math.round(minutes);
  return `${rounded > 0 ? rounded : 1} min read`;
}
