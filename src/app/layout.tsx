import type { Metadata } from "next";
import "../styles/globals.css";
import { ReduxProvider } from "../store/provider";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { envConfig } from "../config/env.config";

export const metadata: Metadata = {
  title: `${envConfig.siteName} - Premium Editorial Platform`,
  description: "A secure, developer-focused, next-generation editorial platform for tech insights and developer workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased light"
    >
      <head>
        {/* Preconnect for performance, then load fonts at runtime (not build-time) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Merriweather:wght@400;700&family=JetBrains+Mono:wght@100..800&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <ReduxProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
