/**
 * Toast Component Documentation
 * 
 * LexisCMS uses `react-hot-toast` integrated tightly with the React Context API.
 * 
 * Please do NOT use this file directly for rendering toasts. 
 * Instead, use the custom `useToast` hook provided by our `ToastContext`.
 * 
 * Example:
 * ```tsx
 * import { useToast } from '@/context/ToastContext';
 * 
 * const { success, error, loading } = useToast();
 * 
 * const handleSave = () => {
 *   success('Post saved successfully!');
 * }
 * ```
 * 
 * The underlying `<Toaster />` configuration (including custom LexisCMS 
 * design system styling, colors, and positioning) is managed globally 
 * inside `src/context/ToastContext.tsx`.
 */

export { Toaster as ToastProvider } from 'react-hot-toast';
