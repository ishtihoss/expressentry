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
  const [supabaseClient] = useState(() => {
    try {
      return createPagesBrowserClient();
    } catch (error) {
      console.error("Failed to create Supabase client:", error);
      return null;
    }
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const isAuthPage = router.pathname === '/SignIn' || router.pathname === '/auth/callback';

  useEffect(() => {
    if (supabaseClient) {
      supabaseClient.auth.getSession().then(() => {
        setIsLoading(false);
      });
    }
  }, [supabaseClient]);

  if (!supabaseClient) {
    return <div>Error: Failed to initialize Supabase client</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
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