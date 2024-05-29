import { FC } from "react";
import Link from "next/link";

export const Footer: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 py-4 px-8 text-sm text-gray-600 font-roboto">
      <p className="text-center mb-2">
        This is an advisory tool and not a substitute for professional legal advice. We are not affiliated with or endorsed by the Canadian government.
      </p>
      <p className="text-center text-xs">
        &copy; {new Date().getFullYear()} All rights reserved.{' '}
        <Link href="/privacy" className="text-gray-600 hover:text-gray-700">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link href="/terms" className="text-gray-600 hover:text-gray-700">
          Terms of Service
        </Link>
      </p>
    </div>
  );
};