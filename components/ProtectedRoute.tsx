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
    if (user === null && !isLoading) {
      router.push("/SignIn");
    } else {
      setIsLoading(false);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/SignIn");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;