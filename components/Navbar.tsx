import { IconExternalLink, IconMenu2 } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export const Navbar: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-4 md:px-8 shadow-lg">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold text-white hover:text-green-200 transition-colors duration-200">
          Express Entry Search
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <IconMenu2 size={24} />
          </button>
        </div>
        <div className={`flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 ${isMenuOpen ? 'absolute top-16 right-4 bg-blue-700 p-4 rounded-md' : 'hidden md:flex'}`}>
          {user && (
            <>
              <span className="text-white text-sm md:text-base">Welcome, {user.user_metadata.full_name || user.email}!</span>
              <LogoutButton />
            </>
          )}
          {!user && (
            <Link href="/SignIn" className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-200 text-sm md:text-base">
              Sign In
            </Link>
          )}
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white bg-green-500 hover:bg-green-600 px-3 py-1 md:px-4 md:py-2 rounded-md transition-colors duration-200 text-sm md:text-base"
          >
            <span className="mr-1">Immigrate</span>
            <IconExternalLink size={16} />
          </a>
        </div>
      </div>
    </nav>
  );
};