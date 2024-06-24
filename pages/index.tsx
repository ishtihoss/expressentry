import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from '@supabase/auth-helpers-react';
import Head from "next/head";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SettingsModal } from "@/components/SettingsModal";
import ExpressEntryChecklist from "@/components/ExpressEntryChecklist";
import { SearchContainer } from "@/components/SearchContainer";
import { LogoContainer } from "@/components/LogoContainer";
import Sentinel from "@/components/Sentinel";
import { SubscribeButton } from "@/components/SubscribeButton";
import { useSearch } from "@/hooks/useSearch";
import { useSettings } from "@/hooks/useSettings";
import { useQueryCount } from "@/hooks/useQueryCount";

export default function Home() {
  const { query, chunks, answer, loading, error, handleSearch: originalHandleSearch } = useSearch();
  const {
    showSettings,
    matchCount,
    toggleSettings,
    handleMatchCountChange,
    handleSave,
    handleClear,
  } = useSettings();
  const router = useRouter();
  const user = useUser();
  const { queryCount, incrementQueryCount } = useQueryCount();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const handleSubscribe = () => {
    router.push('/subscribe');
  };

  const handleSearch = async (searchQuery: string) => {
    if (!user && queryCount >= 3) {
      setShowSignInPrompt(true);
      return;
    }
    
    if (!user) {
      incrementQueryCount();
    }
    await originalHandleSearch(searchQuery);
  };

  return (
    <>
      <Head>
        <title>Express Entry Search Engine</title>
        <meta
          name="description"
          content="Get accurate answers to your Express Entry Canada questions instantly. Our AI-powered chatbot provides reliable information and guidance to help you navigate the Express Entry process."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="sticky top-0 z-50 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Navbar />
          </div>
        </div>

        <main className="flex-grow p-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <LogoContainer />
            </div>
            <SearchContainer
              onSearch={handleSearch}
              chunks={chunks}
              answer={answer}
              loading={loading}
              error={error}
              remainingQueries={user ? undefined : 3 - queryCount}
              showSignInPrompt={showSignInPrompt}
            />
            {showSignInPrompt && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-md">
                <p className="text-sm text-yellow-700">
                  You have reached the limit of free queries. Please sign in to continue using the app.
                </p>
                <button
                  className="mt-2 btn btn-primary"
                  onClick={() => router.push('/signin')}
                >
                  Sign In
                </button>
              </div>
            )}
            <ExpressEntryChecklist />
          </div>
        </main>

        <Sentinel />
        <Footer />
      </div>

      <SettingsModal
        show={showSettings}
        matchCount={matchCount}
        onMatchCountChange={handleMatchCountChange}
        onSave={handleSave}
        onClear={handleClear}
      />

      <button
        className="fixed bottom-4 left-4 btn btn-primary"
        onClick={toggleSettings}
      >
        {showSettings ? "Hide" : "Show"} Settings
      </button>
    </>
  );
}