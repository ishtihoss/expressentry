// components/LogoContainer.tsx
import Image from "next/image";

export const LogoContainer = () => {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg transform rotate-3 shadow-lg"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-md">
        <Image
          src="/logo.png"
          alt="Express Entry Search Engine Logo"
          width={150}
          height={150}
          className="mx-auto"
        />
      </div>
    </div>
  );
};