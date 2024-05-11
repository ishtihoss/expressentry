import { IconExternalLink } from "@tabler/icons-react";
import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <nav className="flex items-center justify-between bg-white py-4 px-8 shadow-md">
      <div className="flex items-center">
        <a href="https://immigrationai.ca" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200">
          ImmigrationAI
        </a>
      </div>
      <div>
        <a
          href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <span className="hidden sm:inline-block mr-1">Immigrate to Canada</span>
          <IconExternalLink size={20} />
        </a>
      </div>
    </nav>
  );
};