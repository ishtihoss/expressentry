import { IconExternalLink } from "@tabler/icons-react";
import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-8 rounded-lg shadow-lg">
      <div className="flex items-center">
        <a href="https://expressentry.ca" className="text-xl font-bold text-white hover:text-blue-200 transition-colors duration-200">
          Express Entry Search Engine
        </a>
      </div>
      <div>
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md shadow-md"
        >
          <span className="hidden sm:inline-block mr-1">Immigrate to Canada</span>
          <IconExternalLink size={20} />
        </a>
      </div>
    </nav>
  );
};