import GoogleAuth from "../components/GoogleAuth";
import SignInSentinel from "../components/SignInSentinel";
import Link from 'next/link';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean;
    gtag: (...args: any[]) => void;
  }
}

export default function SignIn() {
  useEffect(() => {
    window.gtag_report_conversion = function(url) {
      const callback = function () {
        if (typeof(url) != 'undefined') {
          window.location.href = url;
        }
      };
      window.gtag('event', 'conversion', {
        'send_to': 'AW-11387636261/01ZGCLj4-7MZEKWUhrYq',
        'event_callback': callback
      });
      return false;
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full fixed inset-0 bg-gradient-to-r from-blue-500 to-green-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute top-0 right-0 mt-10 md:mt-0 md:mr-10 lg:mr-20">
          <SignInSentinel />
        </div>
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md border-t-8 border-green-500 z-10">
          <h1 className="text-4xl font-bold text-center mb-8 font-display text-blue-500">
            Welcome Back!
          </h1>
          <p className="text-center text-gray-600 mb-10 text-xl">
            Sign in to your account to continue.
          </p>
          <div className="flex justify-center mb-10">
            <GoogleAuth />
          </div>
          <div className="border-t border-gray-300 pt-6">
            <div className="flex justify-center space-x-8 text-sm">
              <Link href="/privacy">
                <span className="text-gray-600 hover:text-blue-500 cursor-pointer transition duration-300 ease-in-out">Privacy Policy</span>
              </Link>
              <Link href="/terms">
                <span className="text-gray-600 hover:text-blue-500 cursor-pointer transition duration-300 ease-in-out">Terms of Service</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}