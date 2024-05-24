// pages/index.tsx
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SettingsModal } from "@/components/SettingsModal";
import ExpressEntryChecklist from "@/components/ExpressEntryChecklist";
import { SearchContainer } from "@/components/SearchContainer";
import { ExpressEntryChunk } from "@/types";
import Head from "next/head";
import { LogoContainer } from "@/components/LogoContainer";
import { useSearch } from "@/hooks/useSearch";
import { useSettings } from "@/hooks/useSettings";

export default function Home() {
  const { query, chunks, answer, loading, handleSearch } = useSearch();
  const { showSettings, matchCount, toggleSettings, handleMatchCountChange, handleSave, handleClear } = useSettings();

  return (
    <>
      <Head>
        <meta
          name="description"
          content={`AI-powered search engine for Express Entry immigration to Canada.`}
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
          </div>
        </main>
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