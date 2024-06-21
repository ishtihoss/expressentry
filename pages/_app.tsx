import { useState, useEffect } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import ProtectedRoute from "../components/ProtectedRoute";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const isAuthPage = router.pathname === '/SignIn' || router.pathname === '/auth/callback' || router.pathname === '/subscribe';

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      console.log("Session check:", session ? "Session found" : "No session");
      
      if (!session && !isAuthPage) {
        console.log("No session and not on auth page, redirecting to SignIn");
        router.push('/SignIn');
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === "SIGNED_OUT" && !isAuthPage) {
        console.log("User signed out, redirecting to SignIn");
        router.push('/SignIn');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient, isAuthPage, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Head>
        <title>Express Entry Search Engine</title>
      </Head>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isAuthPage ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </main>
      </div>
    </SessionContextProvider>
  );
}

export default MyApp;