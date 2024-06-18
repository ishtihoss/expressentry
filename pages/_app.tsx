// pages/_app.tsx

import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from 'next/head';
import Script from 'next/script';
import 'tailwindcss/tailwind.css';
import ProtectedRoute from '../components/ProtectedRoute';
import React, { useEffect } from 'react';

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
        <title>Express Entry Search Engine</title>
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-11387636261"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-11387636261');
        `}
      </Script>
      <Script id="gtag-event" strategy="afterInteractive">
        {`
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
              'send_to': 'AW-11387636261/01ZGCLj4-7MZEKWUhrYq',
              'event_callback': callback
            });
            return false;
          }
        `}
      </Script>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
        </main>
      </div>
    </>
  );
}