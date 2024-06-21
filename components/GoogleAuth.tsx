import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean;
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAuth() {
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googleadservices.com/pagead/conversion.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      if (typeof window.gtag_report_conversion === 'function') {
        window.gtag_report_conversion();
      } else {
        console.warn("gtag_report_conversion is not available");
      }
      
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