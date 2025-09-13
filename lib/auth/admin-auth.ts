"use client"

export interface AdminSession {
  adminId: string
  email: string
  name: string
  role: string
  loginTime: string
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null

  try {
    const sessionData = localStorage.getItem("adminSession")
    if (!sessionData) return null

    const session = JSON.parse(sessionData) as AdminSession

    // Check if session is expired (24 hours)
    const loginTime = new Date(session.loginTime)
    const now = new Date()
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      localStorage.removeItem("adminSession")
      return null
    }

    return session
  } catch {
    return null
  }
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminSession")
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null
}
