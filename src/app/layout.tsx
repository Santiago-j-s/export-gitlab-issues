import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Navbar } from "./components/Navbar";
import "./globals.css";

const inter = FontSans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Export Gitlab Issues",
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background-primary text-default font-sans antialiased dark"
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
