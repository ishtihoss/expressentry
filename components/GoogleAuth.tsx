import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

export default function GoogleAuth() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleSignIn = async () => {
    try {
      // Call gtag_report_conversion before signing in
      gtag_report_conversion();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    
      if (error) {
        console.error("Error signing in with Google:", error.message);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button onClick={handleSignIn}>
      <img src="/PORKOsmall.png" alt="Sign in with Google" />
    </button>
  );
}