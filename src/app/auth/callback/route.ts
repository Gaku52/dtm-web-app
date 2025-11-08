import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('[Auth Callback] Received request:', {
    url: requestUrl.toString(),
    hasCode: !!code,
  })

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // セッション確立に失敗した場合、ログインページにリダイレクト
      console.error('[Auth Callback] Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/login?error=セッションの確立に失敗しました', requestUrl.origin))
    }

    console.log('[Auth Callback] Session established successfully:', {
      userId: data.user?.id,
      email: data.user?.email,
    })
  } else {
    console.warn('[Auth Callback] No code parameter found')
  }

  // ダッシュボードにリダイレクト
  console.log('[Auth Callback] Redirecting to dashboard')
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
