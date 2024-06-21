import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found in ProtectedRoute, redirecting to SignIn");
        router.push("/SignIn");
      } else {
        console.log("Session found in ProtectedRoute, allowing access");
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in ProtectedRoute:", event);
      if (event === "SIGNED_OUT") {
        console.log("User signed out in ProtectedRoute, redirecting to SignIn");
        router.push("/SignIn");
      } else if (event === "SIGNED_IN" && session) {
        console.log("User signed in in ProtectedRoute, allowing access");
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;