import { IconExternalLink } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const Navbar: FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const handleUserSignedIn = (event: CustomEvent) => {
      const user = event.detail as User;
      setUsername(user.user_metadata.full_name);
    };

    window.addEventListener('USER_SIGNED_IN', handleUserSignedIn as EventListener);

    return () => {
      window.removeEventListener('USER_SIGNED_IN', handleUserSignedIn as EventListener);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <a
            href="https://expressentry.ca"
            className="text-2xl font-bold text-white hover:text-green-200 transition-colors duration-200"
          >
            Express Entry Search Engine
          </a>
          {username && (
            <span className="ml-2 text-white">Welcome, {username}!</span> //bingo
          )}
        </div>
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200"
        >
          <span className="hidden sm:inline-block mr-1">Immigrate to Canada</span>
          <IconExternalLink size={20} />
        </a>
      </div>
    </nav>
  );
};