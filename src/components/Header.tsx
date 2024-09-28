import Link from "next/link";

import UserNav from "@/components/UserNav";

const Header = async () => {
  return (
    <header className="bg-gray-200 py-4">
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-gray-900 hover:text-gray-600"
        >
          e-commerce
        </Link>

        <UserNav />
      </div>
    </header>
  );
};

export default Header;
