import Head from 'next/head';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const resources = [
  {
    title: "Official Express Entry Page",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
    description: "The official Government of Canada page for Express Entry. Find detailed information about eligibility, how to apply, and the application process."
  },
  {
    title: "Comprehensive Ranking System (CRS) Criteria",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html",
    description: "Learn about the points-based system used to assess and score your profile for Express Entry."
  },
  {
    title: "Find Your National Occupation Classification (NOC)",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/find-national-occupation-code.html",
    description: "Guide to finding your NOC code, which is crucial for determining your eligibility for Express Entry programs."
  },
  {
    title: "Language Testing for Express Entry",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-requirements.html",
    description: "Information on language proficiency tests accepted for Express Entry applications."
  },
  {
    title: "Express Entry Program Timelines",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html",
    description: "Check the current processing times for Express Entry applications."
  }
];

export default function Resources() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>Express Entry Resources - Immigration to Canada</title>
        <meta name="description" content="Comprehensive list of official resources for Express Entry immigration to Canada. Find information on eligibility, application process, and more." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Express Entry Resources</h1>
        <p className="mb-8 text-gray-700">
          Here you will find a curated list of official resources to help you navigate the Express Entry immigration process to Canada. These links provide valuable information directly from the Government of Canada.
        </p>

        <div className="space-y-6">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {resource.title}
                </a>
              </h2>
              <p className="text-gray-600">{resource.description}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}