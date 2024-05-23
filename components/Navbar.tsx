import { IconExternalLink } from "@tabler/icons-react";
import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <nav className="bg-gradient-to-r from-green-400 to-blue-500 py-4 px-8 rounded-lg shadow-lg relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <a
          href="https://expressentry.ca"
          className="text-2xl font-bold text-white hover:text-yellow-200 transition-colors duration-200 inline-block bg-blue-600 px-4 py-2 rounded-md shadow-md transform hover:scale-110 hover:rotate-3"
        >
          Express Entry Search Engine
        </a>
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-yellow-200 transition-colors duration-200 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md shadow-md transform hover:scale-110 hover:-rotate-3"
        >
          <span className="hidden sm:inline-block mr-1">Immigrate to Canada</span>
          <IconExternalLink size={20} />
        </a>
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-md opacity-50 animate-pulse"></div>
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-yellow-500 to-red-500 rounded-lg blur-md opacity-50 animate-pulse animation-delay-2000"></div>
    </nav>
  );
};