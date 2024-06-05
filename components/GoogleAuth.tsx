import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const GoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          if (event === 'SIGNED_IN') {
            setIsSignedIn(true);
            // Emit an event that the user has signed in
            window.dispatchEvent(new CustomEvent('USER_SIGNED_IN', { detail: session.user }));
          } else if (event === 'SIGNED_OUT') {
            setIsSignedIn(false);
          }
        }
      });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <button onClick={handleGoogleSignIn}>
      <img
        src="/PORKOsmall.png"
        alt="Sign in with Google"
      />
    </button>
  );
};

export default GoogleAuth;