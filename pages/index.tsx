import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SettingsModal } from "@/components/SettingsModal";
import ExpressEntryChecklist from "@/components/ExpressEntryChecklist";
import { SearchContainer } from "@/components/SearchContainer";
import { LogoContainer } from "@/components/LogoContainer";
import Sentinel from "@/components/Sentinel";
import GoogleAuth from "@/components/GoogleAuth";
import { useSearch } from "@/hooks/useSearch";
import { useSettings } from "@/hooks/useSettings";
import Head from "next/head";

export default function Home() {
  const { query, chunks, answer, loading, handleSearch } = useSearch();
  const { showSettings, matchCount, toggleSettings, handleMatchCountChange, handleSave, handleClear } = useSettings();

  return (
    <>
      <Head>
        <meta
          name="description"
          content={`Get accurate answers to your Express Entry Canada questions instantly. Our AI-powered chatbot provides reliable information and guidance to help you navigate the Express Entry process. Whether you need clarification on eligibility criteria, document requirements, or application steps, our chatbot is here to assist you. Start your journey to Canada with confidence, ask our Express Entry chatbot now!`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
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
            />
            <ExpressEntryChecklist />
            <div className="mt-8 text-center">
              <GoogleAuth />
            </div>
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