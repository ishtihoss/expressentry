declare global {
  interface Window {
    gtag_report_conversion?: () => void;
  }
}

import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();

  const handleGoogleSignIn = async () => {
    if (typeof window !== 'undefined' && window.gtag_report_conversion) {
      window.gtag_report_conversion();
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {loading ? (
        <Image
          src="/spinner.gif"
          alt="Loading..."
          width={20}
          height={20}
          className="mr-2"
        />
      ) : (
        <FcGoogle className="w-5 h-5 mr-2" />
      )}
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;