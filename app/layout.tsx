import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LoginProvider from "@/components/context/LoginProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Global Development Future | Dashboard",
  description: "Modern company management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </LoginProvider>
      </body>
    </html>
  );
}
