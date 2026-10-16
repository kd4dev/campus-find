import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import BackgroundEnvironment from "@/components/ui/BackgroundEnvironment";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CampusFind | College Lost & Found",
  description: "Find your lost items, verify ownership, and return safely on your campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Prevent Flash of Wrong Theme (FOUC) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const stored = localStorage.getItem('campusfind-theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && systemDark) || (stored === 'system' && systemDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className={`${inter.className} min-h-screen bg-white text-neutral-900 dark:bg-[#0a0a0b] dark:text-[#fafafa] transition-colors duration-200 relative overflow-x-hidden selection:bg-orange-100 dark:selection:bg-neutral-800`}>
          <ThemeProvider>
            <BackgroundEnvironment />
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            <Navbar />
            <main className="min-h-screen pt-16 relative">
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
