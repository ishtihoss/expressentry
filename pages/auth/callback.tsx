import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

const AuthCallback = () => {
  const router = useRouter()

  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log("Session found in callback, redirecting to home");
        router.push('/')
      }
    }

    handleAuthChange()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event in callback:", event);
      if (event === 'SIGNED_IN' && session) {
        console.log("Signed in, redirecting to home");
        router.push('/');
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return <div>Loading...</div>
}

export default AuthCallback