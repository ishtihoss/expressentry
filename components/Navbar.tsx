import { FC, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { IconMenu2 } from "@tabler/icons-react";

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
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
            Express Entry Search
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <span className="text-gray-600 text-sm md:text-base">Welcome, {user.user_metadata.full_name || user.email}!</span>
            )}
            <Link href="/subscribe" className="text-indigo-500 hover:text-indigo-600 transition-colors duration-200 text-sm md:text-base">
              Subscribe
            </Link>
            {user ? <LogoutButton /> : (
              <Link href="/SignIn" className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md transition-colors duration-200 text-sm md:text-base">
                Sign In
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-indigo-600 focus:outline-none">
              <IconMenu2 size={24} />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col space-y-2">
              {user && (
                <span className="text-gray-600 text-sm">Welcome, {user.user_metadata.full_name || user.email}!</span>
              )}
              <Link href="/subscribe" className="text-indigo-500 hover:text-indigo-600 transition-colors duration-200 text-sm">
                Subscribe
              </Link>
              {user ? <LogoutButton /> : (
                <Link href="/SignIn" className="text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md transition-colors duration-200 text-sm text-center">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};