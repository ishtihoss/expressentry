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

const isPublicPage = (path: string) => {
  const publicPages = ['/SignIn', '/auth/callback', '/privacy', '/terms', '/resources'];
  return publicPages.includes(path) || path.startsWith('/blog');
};

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session && !isPublicPage(router.pathname)) {
        console.log("No session and not on public page, redirecting to SignIn");
        router.push('/SignIn');
      } else {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      checkSession();
    }
  }, [router.isReady, router.pathname]);

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
        <meta name="description" content="AI-powered Express Entry search engine" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {isPublicPage(router.pathname) ? (
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