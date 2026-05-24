declare module 'use-lodash-debounce' {
  export function useDebounce<T>(value: T, delay: number, options?: any): T;
  export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    options?: any
  ): T & { cancel: () => void; flush: () => void };
}
