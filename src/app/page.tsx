import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "./lib/auth";

export const maxDuration = 60;

const OnlyClientPage = dynamic(() => import("./page.client"), { ssr: false });

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="max-w-7xl mx-auto flex flex-col gap-8 py-10 px-4">
      <Suspense>
        <OnlyClientPage />
      </Suspense>
    </main>
  );
}
