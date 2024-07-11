import React, { useState, useCallback } from "react";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { ExpressEntryChunk } from "@/types";
import { useUser } from "@supabase/auth-helpers-react";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/router";

interface SearchContainerProps {
  onSearch: (searchQuery: string) => void;
  chunks: ExpressEntryChunk[];
  answer: string;
  loading: boolean;
  error: string | null;
  remainingQueries?: number;
  showSignInPrompt: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  onSearch,
  chunks,
  answer,
  loading,
  error,
  remainingQueries,
  showSignInPrompt,
  isSubscribed,
  isLoading,
}) => {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const popularTopics = ["FSWP", "FSTP", "CEC", "PNP"];
  const router = useRouter();

  const handleTopicClick = useCallback((topic: string) => {
    setSearchQuery(`Tell me about the ${topic} program`);
  }, []);

  const createSubscription: PayPalButtonsComponentProps["createSubscription"] = useCallback((data, actions) => {
    // Call the conversion tracking function for subscription conversion
    if (typeof window !== 'undefined' && window.gtag_report_conversion) {
      window.gtag_report_conversion('subscription');
    }

    return actions.subscription.create({
      plan_id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || "P-4DV85087F93494849M2GIYBI", 
      custom_id: user?.id,
    });
  }, [user?.id]);

  const onApprove: PayPalButtonsComponentProps["onApprove"] = useCallback(async (data) => {
    try {
      const res = await fetch("/api/update-user-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          orderId: data.orderID,
          subscriptionId: data.subscriptionID,
          planId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || "P-4DV85087F93494849M2GIYBI",
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to update subscription');
      }
      const resData = await res.json();
      console.log("Subscription data:", resData);
      router.reload();
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('An error occurred while updating your subscription. Please try again or contact support.');
    }
  }, [user?.id, router]);

  return (
    <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">
        How it works
      </h2>
      <div className="flex flex-col items-end md:flex-row gap-5 justify-between">
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Ask any question about Express Entry</li>
          <li>Get instant answers from our AI-powered search engine</li>
          <li>Access official information and guidelines</li>
          <li>Stay updated with the latest Express Entry changes</li>
        </ul>
        {user && !isSubscribed && !isLoading && (
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
              vault: true,
              intent: "subscription",
            }}
          >
            <PayPalButtons
              style={{
                layout: "horizontal",
                color: "gold",
                shape: "rect",
                label: "subscribe",
              }}
              createSubscription={createSubscription}
              onApprove={onApprove}
            />
          </PayPalScriptProvider>
        )}
      </div>

      <SearchBar
        onSearch={onSearch}
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {popularTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            {topic}
          </button>
        ))}
      </div>

      {!isSubscribed && remainingQueries !== undefined && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {remainingQueries} free {remainingQueries === 1 ? "query" : "queries"} remaining
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(remainingQueries / (user ? 20 : 3)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {showSignInPrompt && !user && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-md">
          <p className="text-sm text-yellow-700">
            You have reached the limit of free queries. Please sign in to
            continue using the app.
          </p>
        </div>
      )}

      {showSignInPrompt && user && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-md">
          <p className="text-sm text-yellow-700">
            Please subscribe to continue, you have used up your free 20
            questions
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
          <button
            onClick={() => onSearch(searchQuery)}
            className="ml-2 underline hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse mt-4">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        </div>
      ) : chunks.length > 0 || answer ? (
        <SearchResults chunks={chunks} answer={answer} />
      ) : null}
    </div>
  );
};