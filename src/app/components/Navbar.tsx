import { AuthButton } from "./AuthButton";

export const Navbar = () => {
  return (
    <header className="bg-background-secondary w-full py-4">
      <div className="flex justify-between max-w-[1360px] mx-auto w-full items-center px-4">
        <h1 className="text-h4 font-semibold">
          🛠️ <span className="hidden lg:inline-flex">Export Gitlab Issues</span>
        </h1>
        <AuthButton />
      </div>
    </header>
  );
};
