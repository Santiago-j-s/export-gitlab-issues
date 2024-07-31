import { revalidatePath } from "next/cache";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { auth, signIn, signOut } from "./lib/auth";

const OnlyClientPage = dynamic(() => import("./page.client"), { ssr: false });

export default async function Home() {
  const session = await auth();

  return (
    <div className="w-full justify-center flex py-10">
      <main className="max-w-7xl flex flex-col gap-8">
        <form
          action={async () => {
            "use server";
            if (!session) {
              await signIn("gitlab").then(() => {
                revalidatePath("/");
              });
              return;
            }

            await signOut().then(() => {
              revalidatePath("/");
            });
          }}
        >
          <button type="submit">
            {session ? "Sign out" : "Sign in with Gitlab"}
          </button>
        </form>

        <Suspense>
          <OnlyClientPage />
        </Suspense>
      </main>
    </div>
  );
}
