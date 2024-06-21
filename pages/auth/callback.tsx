import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

const AuthCallback = () => {
  const router = useRouter()
  const supabase = useSupabaseClient()

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (session) {
          console.log("Session found in callback, redirecting to home")
          router.push('/')
        } else {
          console.log("No session found in callback, redirecting to SignIn")
          router.push('/SignIn')
        }
      } catch (error) {
        console.error("Error in handleAuthChange:", error)
        router.push('/SignIn')
      }
    }

    handleAuthChange()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event in callback:", event)
      if (event === 'SIGNED_IN' && session) {
        console.log("Signed in, redirecting to home")
        router.push('/')
      } else if (event === 'SIGNED_OUT') {
        console.log("Signed out, redirecting to SignIn")
        router.push('/SignIn')
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  return <div>Processing authentication...</div>
}

export default AuthCallback