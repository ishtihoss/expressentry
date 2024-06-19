// components/GoogleAuth.tsx

import { useEffect, useState, useContext, createContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

// Define the type for the context
interface GoogleAuthContextType {
  isSignedIn: boolean;
}

// Create a context for the signed in state
const GoogleAuthContext = createContext<GoogleAuthContextType | null>(null);

export const useGoogleAuth = () => useContext(GoogleAuthContext);

const GoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          if (event === "SIGNED_IN") {
            setIsSignedIn(true);
            router.push("/");
            // Emit an event that the user has signed in
            window.dispatchEvent(
              new CustomEvent("USER_SIGNED_IN", { detail: session.user })
            );
          } else if (event === "SIGNED_OUT") {
            setIsSignedIn(false);
          }
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  // Provide the signed in state to children
  return (
    <GoogleAuthContext.Provider value={{ isSignedIn }}>
      {isSignedIn ? null : (
        <button onClick={handleGoogleSignIn}>
          <img src="/PORKOsmall.png" alt="Sign in with Google" />
        </button>
      )}
    </GoogleAuthContext.Provider>
  );
};

export default GoogleAuth;
