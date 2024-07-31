import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "../lib/auth";

export const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-gray-800 w-full py-4">
      <div className="flex justify-between max-w-7xl mx-auto w-full items-center">
        <h1 className="text-2xl">Export Gitlab Issues</h1>

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
      </div>
    </header>
  );
};
