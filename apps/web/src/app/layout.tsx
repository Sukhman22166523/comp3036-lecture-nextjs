import type { Metadata } from "next";
import { Press_Start_2P, Roboto } from "next/font/google";

import "./globals.css";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "Full-Stack Blog",
  description: "Blog about full stack development",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${pressStart2P.variable}`}>
        {children}
      </body>
    </html>
  );
}

