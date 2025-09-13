import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  // For now, skip auth checks in Next.js runtime
  // In production, this would use proper Supabase auth

  return supabaseResponse
}
