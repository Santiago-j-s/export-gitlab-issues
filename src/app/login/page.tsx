import { redirect } from "next/navigation";
import { AuthButton } from "../components/AuthButton";
import { auth } from "../lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full flex flex-col gap-6 py-10 justify-center items-center">
      <h1 className="text-4xl font-semibold">Export Gitlab Issues</h1>
      <p className="text-2xl">Please sign in to continue</p>
      <AuthButton />
    </div>
  );
}
