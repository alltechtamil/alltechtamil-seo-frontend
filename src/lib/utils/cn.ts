import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names dynamically using clsx and tailwind-merge to safely resolve conflicts.
 * @param inputs - Array of class values or conditional values.
 * @returns Merged string of pristine Tailwind classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
