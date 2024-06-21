import { IconExternalLink } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export const Navbar: FC = () => {
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-green-200 transition-colors duration-200">
            Express Entry Search Engine
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-white mr-4">Welcome, {user.user_metadata.full_name || user.email}!</span>
              <LogoutButton />
            </div>
          )}
          {!user && (
            <Link href="/SignIn" className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200">
              Sign In
            </Link>
          )}
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
      </div>
    </nav>
  );
};