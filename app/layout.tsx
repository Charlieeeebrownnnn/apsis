import type { Metadata } from "next";
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import SiteNav from "@/components/SiteNav";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "APSIS",
  description: "APSIS fashion brand website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SiteNav />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
