'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // usersテーブルにレコードが存在することを確認し、なければ作成
  const ensureUserRecord = async (authUser: User) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single()

      if (!existingUser) {
        console.log('Creating user record for:', authUser.email)
        const { error } = await supabase.from('users').insert([
          {
            id: authUser.id,
            email: authUser.email,
            username: authUser.email?.split('@')[0],
            display_name: authUser.email?.split('@')[0],
          },
        ])

        if (error) {
          console.error('Error creating user record:', error)
        } else {
          console.log('✅ User record created successfully')
        }
      }
    } catch (error) {
      console.error('Error ensuring user record:', error)
    }
  }

  useEffect(() => {
    console.log('[AuthContext] Initializing...')

    // 初期セッション取得
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('[AuthContext] Initial session:', session?.user?.email || 'No user')
      setSession(session)
      setUser(session?.user ?? null)

      // ユーザーがログインしている場合、usersテーブルにレコードを作成
      if (session?.user) {
        await ensureUserRecord(session.user)
      }

      console.log('[AuthContext] Setting loading to false (initial)')
      setLoading(false)
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session?.user?.email || 'No user')
      setSession(session)
      setUser(session?.user ?? null)

      // ユーザーがログインした場合、usersテーブルにレコードを作成
      if (session?.user) {
        await ensureUserRecord(session.user)
      }

      console.log('[AuthContext] Setting loading to false (state change)')
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
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
