import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useSearch } from "@/hooks/useSearch";
import { SearchContainer } from "@/components/SearchContainer";
import { LogoContainer } from "@/components/LogoContainer";
import GoogleAuth from "@/components/GoogleAuth";
import SignInSentinel from "@/components/SignInSentinel";

export default function SignIn() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { chunks, answer, loading, error, handleSearch } = useSearch();
  const [queryCount, setQueryCount] = useState(0);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };
    checkSession();

    const storedCount = localStorage.getItem('queryCount');
    if (storedCount) {
      setQueryCount(parseInt(storedCount, 10));
    }
  }, [supabase.auth, router]);

  const incrementQueryCount = () => {
    const newCount = queryCount + 1;
    setQueryCount(newCount);
    localStorage.setItem('queryCount', newCount.toString());
  };

  const saveQuery = async (searchQuery: string) => {
    try {
      const response = await fetch('/api/save-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, userId: 'anonymous' }),
      });

      if (!response.ok) {
        throw new Error('Failed to save query');
      }
    } catch (error) {
      console.error('Error saving query:', error);
    }
  };

  const handleLimitedSearch = async (searchQuery: string) => {
    if (queryCount >= 3) {
      setShowSignInPrompt(true);
      return;
    }
    
    incrementQueryCount();
    await saveQuery(searchQuery);
    await handleSearch(searchQuery);
  };

  const remainingQueries = 3 - queryCount;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <LogoContainer />
        
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Express Entry Search Engine
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
          <div className="text-center mb-4">
            <p className="text-lg font-semibold text-blue-600">
              Remaining free searches: <span className="text-2xl">{remainingQueries}</span>
            </p>
          </div>

          <SearchContainer
            onSearch={handleLimitedSearch}
            chunks={chunks}
            answer={answer}
            loading={loading}
            error={error}
            remainingQueries={remainingQueries}
            showSignInPrompt={showSignInPrompt}
          />

          {showSignInPrompt && (
            <div role="alert" className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p className="font-bold">Sign in required</p>
              <p>You have reached the limit of free searches. Please sign in to continue.</p>
            </div>
          )}

          <h2 className="text-3xl font-bold text-center text-blue-600">
            Sign In for Full Access
          </h2>
          <p className="text-center text-gray-600">
            Sign in to unlock unlimited searches and personalized results.
          </p>
          <div className="flex justify-center">
            <GoogleAuth />
          </div>
          <nav className="mt-6">
            <ul className="flex justify-center space-x-4">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200">
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