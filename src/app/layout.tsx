import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { AuthButton } from "./components/AuthButton";
import { Navbar } from "./components/Navbar";
import "./globals.css";
import { auth } from "./lib/auth";

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
          "min-h-screen bg-background-primary text-default font-sans antialiased dark"
        )}
      >
        <Navbar />
        {session ? (
          <>{children}</>
        ) : (
          <div className="w-full flex flex-col gap-6 py-10 justify-center items-center">
            <h1 className="text-4xl font-semibold">Export Gitlab Issues</h1>
            <p className="text-2xl">Please sign in to continue</p>
            <AuthButton />
          </div>
        )}
      </body>
    </html>
  );
}
