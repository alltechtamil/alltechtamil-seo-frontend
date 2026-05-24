/**
 * Truncates text to a specified maximum length, ensuring it doesn't break words mid-way if possible,
 * and appends an ellipsis.
 * 
 * @param text - The string to truncate.
 * @param maxLength - The maximum allowed length (default: 120).
 */
export function truncateText(text: string | null | undefined, maxLength: number = 120): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  // Trim to maxLength and make sure we don't end in the middle of a word by finding the last space
  const trimmed = text.substring(0, maxLength);
  const lastSpaceIndex = trimmed.lastIndexOf(' ');

  // If there's a space within reasonable bounds, cut there. Otherwise, strict cut.
  if (lastSpaceIndex > 0) {
    return `${trimmed.substring(0, lastSpaceIndex)}...`;
  }

  return `${trimmed}...`;
}
