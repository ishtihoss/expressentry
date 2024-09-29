import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSearch } from "@/hooks/useSearch";
import { SearchContainer } from "@/components/SearchContainer";
import { LogoContainer } from "@/components/LogoContainer";
import GoogleAuth from "@/components/GoogleAuth";
import SignInSentinel from "@/components/SignInSentinel";

export default function SignIn() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { chunks, answer, loading, error, handleSearch } = useSearch();
  const [isLoading, setIsLoading] = useState(true);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
      setIsLoading(false);
    };
    checkSession();
  }, [supabase.auth, router]);

  const handleLimitedSearch = async (searchQuery: string) => {
    setShowSignInPrompt(true);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 p-4 flex flex-col items-center justify-center relative">
      <div className="absolute top-4 right-12">
        <Link
          href="/blog"
          className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg text-white border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300 font-semibold py-2 px-6 rounded-full shadow-lg"
        >
          Blog
        </Link>
      </div>
      <div className="w-full max-w-4xl space-y-8">
        <LogoContainer />

        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Express Entry Search Engine
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
          <SearchContainer
            onSearch={handleLimitedSearch}
            chunks={chunks}
            answer={answer}
            loading={loading}
            error={error ? "Please sign in to use the search functionality." : null}
            showSignInPrompt={showSignInPrompt}
            isSubscribed={false}
            isLoading={false}
          />

          {showSignInPrompt && (
            <div
              role="alert"
              className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
            >
              <p className="font-bold">Sign in required</p>
              <p>
                To access our powerful search engine and get personalized results, please sign in using your Google account.
              </p>
            </div>
          )}

          <h2 className="text-3xl font-bold text-center text-blue-600">
            Sign In for Full Access
          </h2>
          <p className="text-center text-gray-600">
            Unlock unlimited searches and personalized results by signing in with your Google account.
          </p>
          <div className="flex justify-center">
            <GoogleAuth />
          </div>
          <nav className="mt-6">
            <ul className="flex justify-center space-x-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <SignInSentinel />
      </div>
    </div>
  );
}