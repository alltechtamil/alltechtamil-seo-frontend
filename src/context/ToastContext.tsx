"use client";

import React, { createContext, useContext } from "react";
import { Toaster, toast, ToastOptions } from "react-hot-toast";

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  custom: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, options);
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  const custom = (message: string, options?: ToastOptions) => {
    toast(message, options);
  };

  return (
    <ToastContext.Provider value={{ success, error, loading, dismiss, custom }}>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--surface-container-highest)",
            color: "var(--on-surface)",
            borderRadius: "12px",
            border: "1px solid var(--outline-variant)",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "var(--surface-container-lowest)",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "var(--error)",
              secondary: "var(--on-error)",
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
