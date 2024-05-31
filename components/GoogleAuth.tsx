// components/GoogleAuth.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const GoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          // User successfully signed in
          // You can access the user's session and perform further actions
          console.log('User signed in:', session);
          setIsSignedIn(true);
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          setIsSignedIn(false);
        }
      }
    );

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
    return null; // Hide the button when the user is signed in
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