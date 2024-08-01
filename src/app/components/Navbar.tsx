import { AuthButton } from "./AuthButton";

export const Navbar = () => {
  return (
    <header className="bg-gray-800 w-full py-4">
      <div className="flex justify-between max-w-7xl mx-auto w-full items-center">
        <h1 className="text-2xl">Export Gitlab Issues</h1>
        <AuthButton />
      </div>
    </header>
  );
};
