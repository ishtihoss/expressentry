// components/ProtectedRoute.tsx

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        router.push("/SignIn");
      }
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        if (event === "SIGNED_OUT") {
          router.push("/SignIn");
        }
      }
    );

    // Call checkSession initially
    checkSession();

    // Clean up listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
