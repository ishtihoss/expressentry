import { IconMenu2, IconUser } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";

export const Navbar: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchUserAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const response = await fetch('/api/subscription', {
          headers: {
            'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
          }
        });
        const data = await response.json();
        setSubscription(data.subscription);
      }
    };

    fetchUserAndSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setSubscription(null);
      }
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

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription? You will immediately lose access to premium features upon cancellation.")) {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        alert("Your subscription has been canceled. You no longer have access to premium features.");
        // Refresh the page
        window.location.reload();
      } else {
        alert("Failed to cancel subscription. Please try again.");
      }
    }
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
                  {subscription && (
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p>Subscription: Active</p>
                      <button onClick={handleCancelSubscription} className="mt-2 text-red-600 hover:text-red-800">
                        Cancel Subscription
                      </button>
                    </div>
                  )}
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
              {subscription && (
                <div className="px-3 py-2 text-sm text-white">
                  <p>Subscription: Active</p>
                  <button onClick={handleCancelSubscription} className="mt-2 text-red-300 hover:text-red-100">
                    Cancel Subscription
                  </button>
                </div>
              )}
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
        </div>
      )}
    </nav>
  );
};