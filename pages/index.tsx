import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useUser,
  useSupabaseClient,
  SupabaseClient,
} from "@supabase/auth-helpers-react";
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
import {
  Session,
  createPagesBrowserClient,
} from "@supabase/auth-helpers-nextjs";
import { useDropzone } from "react-dropzone";
import { TypeAnimation } from "react-type-animation";
import TypingAnimation from "@/components/TypingAnimation";
import { Comment, MagnifyingGlass } from "react-loader-spinner";

export default function Home() {
  const {
    query,
    chunks,
    answer,
    loading,
    error,
    handleSearch: originalHandleSearch,
  } = useSearch();
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
  const supabase = useSupabaseClient();
  const { queryCount, incrementQueryCount, resetQueryCount } = useQueryCount();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackArray, setFeedbackArray] = useState<string[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isErrorFeedback, setIsErrorFeedback] = useState(false);
  const [remainingQueries, setRemainingQueries] = useState<number | undefined>(0);
  const [session, setSession] = useState<Session | null>();
  const [subscription, setSubscription] = useState(null);

  const onDrop = useCallback(async (acceptedFiles: any) => {
    setIsLoadingFeedback(true);
    try {
      console.log("🚀 ~ acceptedFiles:", acceptedFiles);

      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      const res = await fetch("/api/get-resume-feedback", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData,
      }).then((res) => res.json());

      setFeedback(res.message[0].text.value);
      setFeedbackArray(res.textArray);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsErrorFeedback(true);
    } finally {
      setIsLoadingFeedback(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop });

  useEffect(() => {
    const getSessionAndSubscription = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (session && session.user) {
        await getSubscription();
      }

      setSession(session);
      setIsLoading(false);
    };

    getSessionAndSubscription();
  }, [router]);

  const getSubscription = async () => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();
    const res = await fetch("/api/subscription", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    const data = await res.json();

    console.log("Subscription data:", data);

    if (data.isSubscribed) {
      setSubscription(data.subscription);
      setRemainingQueries(undefined);
    } else {
      setSubscription(null);
      setRemainingQueries(20 - data.count < 0 ? 0 : 20 - data.count);
    }
  };

  useEffect(() => {
    if (user) {
      resetQueryCount();
    }
  }, [user, resetQueryCount]);

  const handleSubscribe = () => {
    router.push("/subscribe");
  };

  const saveQuery = async (searchQuery: string) => {
    try {
      const response = await fetch("/api/save-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          userId: user ? user.id : "anonymous",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save query");
      }

      const data = await response.json();
      console.log("Query saved successfully:", data);
    } catch (error) {
      console.error("Error saving query:", error);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    setShowSignInPrompt(false);

    if (!user && queryCount >= 3) {
      setShowSignInPrompt(true);
      return;
    }

    if (user && !subscription && (remainingQueries ?? 0) <= 0) {
      setShowSignInPrompt(true);
      return;
    }

    await saveQuery(searchQuery);

    if (!user) {
      incrementQueryCount();
    }

    if (user && !subscription) {
      await getSubscription();
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

            <div className="flex flex-col md:flex-row gap-5">
              {user && subscription && (
                <div className="p-4 bg-white max-w-[400px] min-w-[300px]">
                  {!isLoadingFeedback &&
                    feedbackArray &&
                    feedbackArray.length === 0 && (
                      <div
                        {...getRootProps()}
                        className="border-2 border-gray-300 border-dashed rounded-md p-4 text-center"
                      >
                        <input {...getInputProps()} type="file" accept=".pdf" />
                        {isDragActive ? (
                          <p>Drop the files here ...</p>
                        ) : (
                          <p>
                            Drag 'n' drop some files here, or click to select
                            files
                          </p>
                        )}

                        <p className="text-sm text-gray-500">
                          {acceptedFiles &&
                            acceptedFiles.map((file: any) => (
                              <p key={file.path}>
                                {file.path} - {file.size} bytes
                              </p>
                            ))}
                        </p>
                      </div>
                    )}

                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Feedback</h2>
                    {isLoadingFeedback ? (
                      <div>
                        <p>Loading feedback...</p>
                        <MagnifyingGlass
                          visible={true}
                          height="80"
                          width="80"
                          ariaLabel="magnifying-glass-loading"
                          wrapperStyle={{}}
                          wrapperClass="magnifying-glass-wrapper"
                          glassColor="#c0efff"
                          color="#e15b64"
                        />
                      </div>
                    ) : isErrorFeedback ? (
                      <p>Error loading feedback</p>
                    ) : null}
                    {feedbackArray && feedbackArray.length > 0 && (
                      <TypingAnimation lines={feedbackArray} />
                    )}
                  </div>
                </div>
              )}
              <SearchContainer
                onSearch={handleSearch}
                chunks={chunks}
                answer={answer}
                loading={loading}
                error={error}
                remainingQueries={subscription ? undefined : remainingQueries}
                showSignInPrompt={showSignInPrompt}
                isSubscribed={subscription !== null}
                isLoading={isLoading}
              />
            </div>

            {showSignInPrompt && !user && (
              <div className="mt-4 p-4 bg-yellow-100 rounded-md">
                <p className="text-sm text-yellow-700">
                  You have reached the limit of free queries. Please sign in to
                  continue using the app.
                </p>
                <button
                  className="mt-2 btn btn-primary"
                  onClick={() => router.push("/signin")}
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