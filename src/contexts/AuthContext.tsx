import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase, User, CreditTransaction } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  addCredits: (amount: number, type: 'purchased' | 'bonus', description: string) => Promise<void>
  deductCredits: (amount: number, description: string, module?: string) => Promise<boolean>
  getCreditHistory: () => Promise<CreditTransaction[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Initialize user data from Supabase
  const initializeUser = async (supabaseUser: SupabaseUser) => {
    try {

      // Check if user exists in our users table
      const selectProfile = async () => {
        return await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single()
      }

      let { data: existingUser, error: fetchError } = await selectProfile()

      // If not found yet (race with trigger), retry once after a short delay
      if (fetchError && fetchError.code === 'PGRST116') {
        await new Promise(r => setTimeout(r, 400))
        const retry = await selectProfile()
        existingUser = retry.data as any
        fetchError = retry.error as any
      }

      if (existingUser) {
        setUser(existingUser)
        console.log('User loaded:', existingUser.email, 'Credits:', existingUser.credits)
      } else if (fetchError) {
        console.error('Error fetching user:', fetchError)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try refreshing the page.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error initializing user:', error)
      toast({
        title: "Error",
        description: "Failed to initialize user account. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Email/password - Sign up
  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: fullName ? { full_name: fullName } : undefined,
        },
      })
      if (error) throw error

      // If email confirmation is enabled, there may be no session yet
      if (data?.user && !data?.session) {
        toast({ title: 'Verify your email', description: 'We sent a confirmation link to your inbox.' })
        return
      }

      if (data.user) {
        await initializeUser(data.user)
        toast({ title: 'Account created', description: 'Welcome to Productica!' })
      }
    } catch (error: any) {
      console.error('Error signing up:', error)
      const message = error?.message || 'Please try again.'
      toast({ title: 'Sign Up Failed', description: message, variant: 'destructive' })
    }
  }

  // Email/password - Sign in
  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (supabaseUrl.includes('placeholder')) {
        toast({
          title: "Supabase Not Configured",
          description: "Please set Supabase env vars to enable authentication.",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.user) {
        await initializeUser(data.user)
        toast({ title: 'Signed in', description: `Welcome back!` })
      }
    } catch (error) {
      console.error('Error signing in:', error)
      toast({ title: 'Sign In Failed', description: 'Invalid email or password.', variant: 'destructive' })
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      toast({ title: 'Coming soon', description: 'Google sign-in will be available soon.' })
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Sign In Failed",
        description: "There was an error with Google sign-in.",
        variant: "destructive",
      })
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (session?.user) {
      await initializeUser(session.user)
    }
  }

  // Add credits (via RPC)
  const addCredits = async (amount: number, type: 'purchased' | 'bonus', description: string) => {
    if (!user) return

    try {
      const { error } = await supabase.rpc('rpc_add_credits', {
        p_amount: amount,
        p_type: type,
        p_description: description,
      })
      if (error) throw error

      // Update local state
      setUser(prev => prev ? { ...prev, credits: prev.credits + amount } : null)

      toast({
        title: "Credits Added!",
        description: `${amount} credits added. Total: ${user.credits + amount}`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Error adding credits:', error)
      toast({
        title: "Error",
        description: "Failed to add credits. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Deduct credits (via RPC)
  const deductCredits = async (amount: number, description: string, module?: string): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase.rpc('rpc_spend_credits', {
        p_amount: amount,
        p_description: description,
        p_module: module ?? null,
      })
      if (error) throw error
      if (data !== true) {
        toast({ title: 'Insufficient credits', description: 'Please purchase more credits.' })
        return false
      }

      // Update local state
      setUser(prev => prev ? { ...prev, credits: prev.credits - amount } : null)

      toast({
        title: "Credit Used",
        description: `${user.credits - amount} credits remaining`,
        duration: 2000,
      })

      return true
    } catch (error) {
      console.error('Error deducting credits:', error)
      toast({
        title: "Error",
        description: "Failed to deduct credits. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  // Get credit history
  const getCreditHistory = async (): Promise<CreditTransaction[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching credit history:', error)
      return []
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        let { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          // try fallback from localStorage if available
        }

        // Fallback: hydrate from localStorage if Supabase hasn't yet
        if (!session) {
          try {
            const raw = localStorage.getItem('productica-auth')
            if (raw) {
              const parsed = JSON.parse(raw)
              if (parsed?.currentSession?.access_token && parsed?.currentSession?.refresh_token) {
                const { data, error: setErr } = await supabase.auth.setSession({
                  access_token: parsed.currentSession.access_token,
                  refresh_token: parsed.currentSession.refresh_token,
                })
                if (!setErr) session = data.session
              }
            }
          } catch (e) {
            console.warn('Session hydration fallback failed:', e)
          }
        }

        if (mounted) {
          setSession(session)
          if (session?.user) {
            await initializeUser(session.user)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (mounted) {
        setSession(session)
        if (session?.user) {
          await initializeUser(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    session,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    refreshUser,
    addCredits,
    deductCredits,
    getCreditHistory,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
