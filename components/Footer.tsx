import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 py-4 px-8 text-sm text-gray-600 font-roboto">
      <p className="text-center">
        Express Entry Search Engine is an advisory tool and should not be considered a substitute for professional legal advice. We are not affiliated with or endorsed by the Canadian government.
      </p>
    </div>
  );
};