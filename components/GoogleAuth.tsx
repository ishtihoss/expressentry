import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Image from 'next/image';

const GoogleAuth = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  
    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <button 
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center bg-white text-gray-700 font-roboto font-medium py-2 px-4 rounded-md hover:shadow-md transition duration-300 border border-gray-300 w-full max-w-xs"
    >
      <div className="flex items-center justify-center">
        <div className="mr-3">
          <Image
            src="/google-logo.svg"
            alt="Google logo"
            width={18}
            height={18}
          />
        </div>
        <span>Sign in with Google</span>
      </div>
    </button>
  );
};

export default GoogleAuth;