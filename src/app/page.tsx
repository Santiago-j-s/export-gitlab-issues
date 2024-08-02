import dynamic from "next/dynamic";
import { Suspense } from "react";

export const maxDuration = 60;

const OnlyClientPage = dynamic(() => import("./page.client"), { ssr: false });

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto flex flex-col gap-8 py-10">
      <Suspense>
        <OnlyClientPage />
      </Suspense>
    </main>
  );
}
