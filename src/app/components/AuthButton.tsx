import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "../lib/auth";

export const AuthButton = async () => {
  const session = await auth();

  return (
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
  );
};
