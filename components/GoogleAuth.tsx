import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

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
    <button onClick={handleGoogleSignIn}>
      <img src="/PORKOsmall.png" alt="Sign in with Google" />
    </button>
  );
};

export default GoogleAuth;