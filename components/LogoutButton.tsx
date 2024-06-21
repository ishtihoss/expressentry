import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const LogoutButton = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/SignIn");
    }
  };

  return (
    <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors duration-200">
      Logout
    </button>
  );
};

export default LogoutButton;