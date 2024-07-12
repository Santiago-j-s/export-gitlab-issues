import dynamic from "next/dynamic";
import { Suspense } from "react";

const OnlyClientPage = dynamic(() => import("./page.client"), { ssr: false });

export default function Home() {
  return (
    <div className="w-full justify-center flex py-10">
      <main className="max-w-7xl flex flex-col gap-8">
        <Suspense>
          <OnlyClientPage />
        </Suspense>
      </main>
    </div>
  );
}
