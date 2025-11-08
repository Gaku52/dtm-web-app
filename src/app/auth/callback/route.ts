import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // セッション確立に失敗した場合、ログインページにリダイレクト
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/login?error=セッションの確立に失敗しました', requestUrl.origin))
    }
  }

  // ダッシュボードにリダイレクト
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
