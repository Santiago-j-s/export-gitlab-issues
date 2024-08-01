import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { AuthButton } from "./components/AuthButton";
import { Navbar } from "./components/Navbar";
import "./globals.css";
import { auth } from "./lib/auth";

const inter = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background font-sans antialiased dark"
        )}
      >
        <Navbar />
        {session ? <>{children}</> : <AuthButton />}
      </body>
    </html>
  );
}
