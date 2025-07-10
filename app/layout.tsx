import "@/styles/globals.css";
import { Metadata } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import Header from "@/components/Header";
import { Figtree } from "next/font/google"

import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

const figtree = Figtree({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-[100dvh] bg-background",
          figtree.className
        )}
      >
        <SessionProvider>
          <header>
            <Header session={session} />
          </header>
          <main className="">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
