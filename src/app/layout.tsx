import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import { ReduxProvider } from "../store/provider";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
      className={`${inter.variable} ${merriweather.variable} ${jetBrainsMono.variable} h-full antialiased light`}
    >
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
