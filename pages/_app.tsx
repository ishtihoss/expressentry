import "../styles/globals.css";
import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from 'next/head'; // Import Head

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }: AppProps<{}>) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Log page views or perform analytics tracking
      console.log(`Page viewed: ${url}`);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Express Entry Search Engine</title> {/* Set the default site-wide title */}
      </Head>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </main>
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Express Entry Information Retrieval. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}