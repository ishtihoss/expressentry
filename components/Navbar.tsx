import { IconExternalLink, IconMenu2, IconUser } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export const Navbar: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-4 md:px-8 shadow-lg z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold text-white hover:text-green-200 transition-colors duration-200">
          Express Entry Search
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          {['Home', 'Resources'].map((item) => (
            <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
              {item}
            </Link>
          ))}
          {user ? (
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center text-white hover:text-green-200">
                <IconUser size={24} />
                <span className="ml-2">{user.user_metadata.full_name || user.email}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/SignIn" className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium">
              Sign In
            </Link>
          )}
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
          >
            <span className="mr-1">Immigrate</span>
            <IconExternalLink size={16} />
          </a>
        </div>
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none" aria-label="Toggle menu">
          <IconMenu2 size={24} />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link href="/" className="block text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          <Link href="/resources" className="block text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium">Resources</Link>
          {user && (
            <>
              <span className="block text-white text-sm px-3 py-2">Welcome, {user.user_metadata.full_name || user.email}!</span>
              <button onClick={handleLogout} className="block text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium w-full text-left">
                Log out
              </button>
            </>
          )}
          {!user && (
            <Link href="/SignIn" className="block text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium">
              Sign In
            </Link>
          )}
          <a
            href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
          >
            <span className="mr-1">Immigrate</span>
            <IconExternalLink size={16} />
          </a>
        </div>
      )}
    </nav>
  );
};