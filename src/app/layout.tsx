import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from '@/components/Providers/Providers';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import { EnvScript } from '@daniel-rose/envex/script';
import { EnvexProvider } from '@daniel-rose/envex';
import { getPublicEnv } from '@daniel-rose/envex/server';
import TokenProvider from '@/components/Providers/TokenPrivider';
import EnvProvider from '@/components/Providers/envProvider';
import AlertProvider from '@/components/Providers/alertProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin for manage ticket system.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialEnv = await getPublicEnv();

  return (
    <html lang="en">
      <body className={inter.className}>
        <EnvScript />
        <EnvexProvider initialEnv={initialEnv}>
          <AppRouterCacheProvider>
            <NextIntlClientProvider>
              <Providers>
                <EnvProvider>
                  <AlertProvider>
                    <TokenProvider>
                      {children}
                    </TokenProvider>
                  </AlertProvider>
                </EnvProvider>
              </Providers>
            </NextIntlClientProvider>
          </AppRouterCacheProvider>
        </EnvexProvider>
      </body>
    </html>
  );
}
