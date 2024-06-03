import dynamic from "next/dynamic";
import { Suspense } from "react";

const OnlyClientPage = dynamic(() => import("./page.client"), { ssr: false });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8 gap-8 w-full grid grid-cols-8">
        <Suspense>
          <OnlyClientPage />
        </Suspense>
      </div>
    </main>
  );
}
